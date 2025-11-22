'use server'

import { prisma } from '@/lib/prisma'

export async function getStockMoves() {
    try {
        const moves = await prisma.stockMove.findMany({
            include: {
                product: true,
                sourceLocation: true,
                destinationLocation: true,
                transfer: true,
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
