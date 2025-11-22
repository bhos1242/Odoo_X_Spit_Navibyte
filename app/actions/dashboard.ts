'use server'

import { prisma } from '@/lib/prisma'

export async function getDashboardStats() {
    try {
        const [
            totalProducts,
            lowStockProducts,
            pendingReceipts,
            pendingDeliveries,
            internalTransfers
        ] = await prisma.$transaction([
            // 1. Total Products
            prisma.product.count(),

            // 2. Low Stock Items (where current stock < minStock)
            // Note: This is an approximation. Ideally we check stock levels per location, 
            // but for a high-level KPI, we can check products where total stock is low if we aggregated it,
            // or just count products that have a reordering rule set. 
            // For now, let's count products.
            prisma.product.count({
                where: {
                    stockLevels: {
                        some: {
                            quantity: { lte: 5 } // Simple threshold for now, or use minStock if we could compare fields
                        }
                    }
                }
            }),

            // 3. Pending Receipts
            prisma.stockTransfer.count({
                where: {
                    type: 'INCOMING',
                    status: { not: 'DONE' }
                }
            }),

            // 4. Pending Deliveries
            prisma.stockTransfer.count({
                where: {
                    type: 'OUTGOING',
                    status: { not: 'DONE' }
                }
            }),

            // 5. Internal Transfers Scheduled
            prisma.stockTransfer.count({
                where: {
                    type: 'INTERNAL',
                    status: { not: 'DONE' }
                }
            })
        ])

        return {
            success: true,
            data: {
                totalProducts,
                lowStockProducts,
                pendingReceipts,
                pendingDeliveries,
                internalTransfers
            }
        }
    } catch (error) {
        console.error('Dashboard stats error:', error)
        return { success: false, error: 'Failed to fetch dashboard stats' }
    }
}
