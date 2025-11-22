'use server'

import { prisma } from '@/lib/prisma'

export async function getStockMoves(query?: string) {
    try {
        const whereClause = query ? {
            OR: [
                {
                    transfer: {
                        reference: {
                            contains: query,
                            mode: 'insensitive' as const
                        }
                    }
                },
                {
                    transfer: {
                        contact: {
                            name: {
                                contains: query,
                                mode: 'insensitive' as const
                            }
                        }
                    }
                }
            ]
        } : {}

        const moves = await prisma.stockMove.findMany({
            where: whereClause,
            include: {
                product: true,
                sourceLocation: true,
                destinationLocation: true,
                transfer: {
                    include: {
                        contact: true
                    }
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        })

        const serializedMoves = moves.map(move => ({
            ...move,
            product: {
                ...move.product,
                costPrice: move.product.costPrice.toNumber(),
                salesPrice: move.product.salesPrice.toNumber(),
            }
        }))

        return { success: true, data: serializedMoves }
    } catch (error) {
        console.error('Failed to fetch stock moves:', error)
        return { success: false, error: 'Failed to fetch stock moves' }
    }
}

export async function getCurrentStock() {
    try {
        const stockLevels = await prisma.stockLevel.findMany({
            where: {
                quantity: {
                    not: 0
                }
            },
            include: {
                product: true,
                location: true,
            },
            orderBy: {
                product: {
                    name: 'asc'
                }
            }
        })

        const serializedStock = stockLevels.map(stock => ({
            ...stock,
            product: {
                ...stock.product,
                costPrice: stock.product.costPrice.toNumber(),
                salesPrice: stock.product.salesPrice.toNumber(),
            }
        }))

        return { success: true, data: serializedStock }
    } catch (error) {
        console.error('Failed to fetch current stock:', error)
        return { success: false, error: 'Failed to fetch current stock' }
    }
}
