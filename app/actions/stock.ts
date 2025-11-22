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
        return { success: true, data: moves }
    } catch (error) {
        console.error('Failed to fetch stock moves:', error)
        return { success: false, error: 'Failed to fetch stock moves' }
    }
}
