'use server'

import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

const signUpSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    role: z.enum(['MANAGER', 'STAFF', 'STOCK_MASTER']).optional(),
})

export async function signUp(data: z.infer<typeof signUpSchema>) {
    console.log("signUp action called with data:", JSON.stringify(data, null, 2));

    const validatedFields = signUpSchema.safeParse(data)

    if (!validatedFields.success) {
        console.error("Validation failed:", validatedFields.error.flatten().fieldErrors);
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }

    const { name, email, password, role } = validatedFields.data

    try {
        console.log("Checking for existing user...");
        if (!prisma) {
            console.error("Prisma instance is undefined!");
            throw new Error("Prisma instance is undefined");
        }

        const existingUser = await prisma.user.findUnique({
            where: { email },
        })

        if (existingUser) {
            console.log("User already exists.");
            return {
                message: 'User already exists with this email.',
            }
        }

        console.log("Hashing password...");
        const hashedPassword = await bcrypt.hash(password, 10)

        console.log("Creating user...");
        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: role as any || 'STAFF',
            },
        })

        console.log("User created successfully.");
        return { success: true }

    } catch (error) {
        console.error("Error in signUp action:", error);
        return {
            message: 'Database Error: Failed to create user.',
        }
    }
}

import { createSession, deleteSession } from '@/lib/session'

const signInSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
})

export async function signIn(prevState: any, formData: FormData) {
    const validatedFields = signInSchema.safeParse({
        email: formData.get('email'),
        password: formData.get('password'),
    })

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }

    const { email, password } = validatedFields.data

    try {
        const user = await prisma.user.findUnique({
            where: { email },
        })

        if (!user) {
            return {
                message: 'Invalid credentials.',
            }
        }

        const passwordsMatch = await bcrypt.compare(password, user.password)

        if (!passwordsMatch) {
            return {
                message: 'Invalid credentials.',
            }
        }

        await createSession(user.id, user.role)

    } catch (error) {
        console.error("Sign in error:", error)
        return {
            message: 'Something went wrong.',
        }
    }

    redirect('/dashboard')
}

export async function signOut() {
    await deleteSession()
    redirect('/sign-in')
}
