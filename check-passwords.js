
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    console.log("Checking Users Table for Hashed Passwords...")
    try {
        const users = await prisma.users.findMany({
            take: 5,
            select: { id: true, email: true, password: true }
        })

        if (users.length === 0) {
            console.log("No users found.")
        }

        users.forEach(u => {
            const isHashed = u.password && u.password.startsWith('$2b$')
            console.log(`User: ${u.email}`)
            console.log(`   Password starts with: ${u.password ? u.password.substring(0, 10) + '...' : 'null'}`)
            console.log(`   Is Hashed (bcrypt)? ${isHashed ? '✅ YES' : '❌ NO (Plaintext)'}`)
        })
    } catch (e) {
        console.error("Error:", e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
