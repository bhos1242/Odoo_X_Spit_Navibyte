'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const contactSchema = z.object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email().optional().or(z.literal('')),
    phone: z.string().optional(),
    type: z.enum(['CUSTOMER', 'VENDOR']),
    address: z.string().optional(),
})

export async function getContacts(type?: 'CUSTOMER' | 'VENDOR') {
    try {
        const where = type ? { type } : {}
        const contacts = await prisma.contact.findMany({
            where,
            orderBy: { createdAt: 'desc' }
        })
        return { success: true, data: contacts }
    } catch (error) {
        return { success: false, error: 'Failed to fetch contacts' }
    }
}

export async function createContact(data: z.infer<typeof contactSchema>) {
    const validated = contactSchema.safeParse(data)
    if (!validated.success) {
        return { success: false, error: validated.error.flatten().fieldErrors }
    }

    try {
        await prisma.contact.create({
            data: validated.data
        })
        revalidatePath('/dashboard/operations/deliveries')
        revalidatePath('/dashboard/operations/receipts')
        return { success: true }
    } catch (error) {
        return { success: false, error: 'Failed to create contact' }
    }
}

export async function deleteContact(id: string) {
    try {
        await prisma.contact.delete({
            where: { id }
        })
        revalidatePath('/dashboard/contacts')
        return { success: true }
    } catch (error) {
        return { success: false, error: 'Failed to delete contact' }
    }
}
