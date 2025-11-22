'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { TransferStatus, TransferType } from '@prisma/client'

const moveSchema = z.object({
    productId: z.string(),
    quantity: z.coerce.number().min(1),
})

const transferSchema = z.object({
    type: z.enum(['INCOMING', 'OUTGOING', 'INTERNAL', 'ADJUSTMENT']),
    contactId: z.string().optional().nullable(),
    sourceLocationId: z.string().optional().nullable(),
    destinationLocationId: z.string().optional().nullable(),
    scheduledDate: z.date().optional(),
    items: z.array(moveSchema).min(1, "At least one product is required"),
})

export async function getTransfers(type?: TransferType) {
    try {
        const where = type ? { type } : {}
        const transfers = await prisma.stockTransfer.findMany({
            where,
            include: {
                contact: true,
                sourceLocation: true,
                destinationLocation: true,
                stockMoves: {
                    include: {
                        product: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        })

        const serializedTransfers = transfers.map(transfer => ({
            ...transfer,
            stockMoves: transfer.stockMoves.map(move => ({
                ...move,
                product: {
                    ...move.product,
                    costPrice: Number(move.product.costPrice),
                    salesPrice: Number(move.product.salesPrice)
                }
            }))
        }))

        return { success: true, data: serializedTransfers }
    } catch (error) {
        return { success: false, error: 'Failed to fetch transfers' }
    }
}

async function generateReference(type: TransferType) {
    const prefixMap = {
        INCOMING: 'WH/IN',
        OUTGOING: 'WH/OUT',
        INTERNAL: 'WH/INT',
        ADJUSTMENT: 'WH/ADJ'
    }
    const prefix = prefixMap[type]
    const count = await prisma.stockTransfer.count({
        where: { type }
    })
    const padding = (count + 1).toString().padStart(5, '0')
    return `${prefix}/${padding}`
}

export async function createTransfer(data: z.infer<typeof transferSchema>) {
    const validated = transferSchema.safeParse(data)
    if (!validated.success) {
        return { success: false, error: validated.error.flatten().fieldErrors }
    }

    const { type, contactId, sourceLocationId, destinationLocationId, items, scheduledDate } = validated.data

    if (sourceLocationId && destinationLocationId && sourceLocationId === destinationLocationId) {
        return { success: false, error: "Source and Destination locations cannot be the same." }
    }

    try {
        const reference = await generateReference(type)

        await prisma.stockTransfer.create({
            data: {
                reference,
                type,
                contactId,
                sourceLocationId,
                destinationLocationId,
                scheduledDate,
                status: 'DRAFT',
                stockMoves: {
                    create: items.map(item => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        sourceLocationId,
                        destinationLocationId,
                        status: 'DRAFT'
                    }))
                }
            }
        })

        revalidatePath('/dashboard/operations/deliveries')
        revalidatePath('/dashboard/operations/receipts')
        return { success: true }
    } catch (error) {
        console.error(error)
        return { success: false, error: 'Failed to create transfer' }
    }
}

export async function validateTransfer(id: string) {
    try {
        const transfer = await prisma.stockTransfer.findUnique({
            where: { id },
            include: { stockMoves: true }
        })

        if (!transfer) return { success: false, error: 'Transfer not found' }
        if (transfer.status === 'DONE') return { success: false, error: 'Transfer already validated' }

        // Transaction to ensure data integrity
        await prisma.$transaction(async (tx) => {
            // 1. Update Transfer Status
            await tx.stockTransfer.update({
                where: { id },
                data: {
                    status: 'DONE',
                    effectiveDate: new Date()
                }
            })

            // 2. Process each move
            for (const move of transfer.stockMoves) {
                // Update Move Status
                await tx.stockMove.update({
                    where: { id: move.id },
                    data: { status: 'DONE' }
                })

                // Update Source Stock (Decrement)
                if (move.sourceLocationId) {
                    const sourceStock = await tx.stockLevel.findUnique({
                        where: {
                            productId_locationId: {
                                productId: move.productId,
                                locationId: move.sourceLocationId
                            }
                        }
                    })

                    if (sourceStock) {
                        await tx.stockLevel.update({
                            where: { id: sourceStock.id },
                            data: { quantity: sourceStock.quantity - move.quantity }
                        })
                    } else {
                        // Create negative stock if allowed, or just 0 -> -qty
                        await tx.stockLevel.create({
                            data: {
                                productId: move.productId,
                                locationId: move.sourceLocationId,
                                quantity: -move.quantity
                            }
                        })
                    }
                }

                // Update Destination Stock (Increment)
                if (move.destinationLocationId) {
                    const destStock = await tx.stockLevel.findUnique({
                        where: {
                            productId_locationId: {
                                productId: move.productId,
                                locationId: move.destinationLocationId
                            }
                        }
                    })

                    if (destStock) {
                        await tx.stockLevel.update({
                            where: { id: destStock.id },
                            data: { quantity: destStock.quantity + move.quantity }
                        })
                    } else {
                        await tx.stockLevel.create({
                            data: {
                                productId: move.productId,
                                locationId: move.destinationLocationId,
                                quantity: move.quantity
                            }
                        })
                    }
                }
            }
        })

        revalidatePath('/dashboard/operations/deliveries')
        revalidatePath('/dashboard/operations/receipts')
        revalidatePath('/dashboard/inventory') // Update product stock levels
        return { success: true }

    } catch (error) {
        console.error(error)
        return { success: false, error: 'Failed to validate transfer' }
    }
}

export async function deleteTransfer(id: string) {
    try {
        await prisma.stockTransfer.delete({ where: { id } })
        revalidatePath('/dashboard/operations/deliveries')
        revalidatePath('/dashboard/operations/receipts')
        return { success: true }
    } catch (error) {
        return { success: false, error: 'Failed to delete transfer' }
    }
}
