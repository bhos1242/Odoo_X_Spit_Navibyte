'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

// --- Warehouses ---

const warehouseSchema = z.object({
    name: z.string().min(2, "Name is required"),
    address: z.string().optional(),
})

export async function getWarehouses() {
    try {
        const warehouses = await prisma.warehouse.findMany({
            include: {
                locations: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        })
        return { success: true, data: warehouses }
    } catch (error) {
        return { success: false, error: 'Failed to fetch warehouses' }
    }
}

export async function createWarehouse(data: z.infer<typeof warehouseSchema>) {
    const validated = warehouseSchema.safeParse(data)
    if (!validated.success) {
        return { success: false, error: validated.error.flatten().fieldErrors }
    }

    try {
        await prisma.warehouse.create({
            data: validated.data,
        })
        revalidatePath('/dashboard/warehouses')
        return { success: true }
    } catch (error) {
        return { success: false, error: 'Failed to create warehouse' }
    }
}

// --- Locations ---

const locationSchema = z.object({
    name: z.string().min(2, "Name is required"),
    type: z.enum(['VIEW', 'INTERNAL', 'CUSTOMER', 'VENDOR', 'INVENTORY_LOSS', 'PRODUCTION', 'TRANSIT']),
    warehouseId: z.string().optional(),
    parentId: z.string().optional(),
})

export async function getLocations(warehouseId?: string) {
    try {
        const where = warehouseId ? { warehouseId } : {}
        const locations = await prisma.location.findMany({
            where,
            include: {
                warehouse: true,
                parent: true,
                children: true,
            },
            orderBy: {
                name: 'asc',
            },
        })
        return { success: true, data: locations }
    } catch (error) {
        return { success: false, error: 'Failed to fetch locations' }
    }
}

export async function createLocation(data: z.infer<typeof locationSchema>) {
    const validated = locationSchema.safeParse(data)
    if (!validated.success) {
        return { success: false, error: validated.error.flatten().fieldErrors }
    }

    try {
        await prisma.location.create({
            data: validated.data,
        })
        revalidatePath('/dashboard/warehouses')
        return { success: true }
    } catch (error) {
        return { success: false, error: 'Failed to create location' }
    }
}
