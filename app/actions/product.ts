'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { Prisma } from '@prisma/client'

// --- Products ---

const productSchema = z.object({
    name: z.string().min(2, "Name is required"),
    sku: z.string().min(2, "SKU is required"),
    barcode: z.string().optional(),
    description: z.string().optional(),
    type: z.enum(['STORABLE', 'CONSUMABLE', 'SERVICE']),
    unitOfMeasure: z.string().default("Units"),
    costPrice: z.coerce.number().min(0),
    salesPrice: z.coerce.number().min(0),
    categoryId: z.string().optional().nullable(),
    minStock: z.coerce.number().min(0).default(0),
    maxStock: z.coerce.number().min(0).optional(),
})

export async function getProducts() {
    try {
        const products = await prisma.product.findMany({
            include: {
                category: true,
                stockLevels: true, // To calculate total stock
            },
            orderBy: {
                createdAt: 'desc',
            },
        })
        return { success: true, data: products }
    } catch (error) {
        return { success: false, error: 'Failed to fetch products' }
    }
}

export async function createProduct(data: z.infer<typeof productSchema>) {
    if (data.categoryId === 'none' || data.categoryId === '') data.categoryId = null;
    if (data.barcode === '') data.barcode = undefined;

    const validated = productSchema.safeParse(data)
    if (!validated.success) {
        return { success: false, error: validated.error.flatten().fieldErrors }
    }

    try {
        await prisma.product.create({
            data: validated.data,
        })
        revalidatePath('/dashboard/inventory')
        return { success: true }
    } catch (error) {
        console.error(error)
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                return { success: false, error: `Product with this ${error.meta?.target} already exists` }
            }
        }
        return { success: false, error: 'Failed to create product' }
    }
}

export async function updateProduct(id: string, data: z.infer<typeof productSchema>) {
    if (data.categoryId === 'none' || data.categoryId === '') data.categoryId = null;
    if (data.barcode === '') data.barcode = undefined;

    const validated = productSchema.safeParse(data)
    if (!validated.success) {
        return { success: false, error: validated.error.flatten().fieldErrors }
    }

    try {
        await prisma.product.update({
            where: { id },
            data: validated.data,
        })
        revalidatePath('/dashboard/inventory')
        return { success: true }
    } catch (error) {
        console.error(error)
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                return { success: false, error: `Product with this ${error.meta?.target} already exists` }
            }
        }
        return { success: false, error: 'Failed to update product' }
    }
}

export async function deleteProduct(id: string) {
    try {
        await prisma.product.delete({
            where: { id },
        })
        revalidatePath('/dashboard/inventory')
        return { success: true }
    } catch (error) {
        return { success: false, error: 'Failed to delete product' }
    }
}
