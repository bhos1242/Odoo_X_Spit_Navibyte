import { PrismaClient, UserRole } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const email = 'bhosalenaresh73@gmail.com'
    const password = 'Pass@123' // Default password
    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.upsert({
        where: { email },
        update: {
            name: 'Naresh Bhosale',
            role: UserRole.ADMIN,
            password: hashedPassword, // Optional: Reset password to default if running seed
        },
        create: {
            email,
            name: 'Naresh Bhosale',
            password: hashedPassword,
            role: UserRole.ADMIN,
        },
    })

    console.log({ user })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
