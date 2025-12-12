import { PrismaClient } from '@prisma/client';

async function main() {
    console.log("Checking Users Table for Hashed Passwords...");

    // We can't use the server action client here easily as it uses cookies/headers
    // We'll use the direct postgres query via prisma if available, or just use a raw query
    // Actually, let's use the local Prisma instance since we are on the server

    const prisma = new PrismaClient();

    try {
        const users = await prisma.users.findMany({
            take: 5,
            select: { id: true, email: true, password: true }
        });

        console.log(`Found ${users.length} users.`);

        users.forEach(u => {
            const isHashed = u.password && u.password.startsWith('$2b$'); // bcrypt prefix
            console.log(`User: ${u.email}`);
            console.log(`   Password starts with: ${u.password ? u.password.substring(0, 10) + '...' : 'null'}`);
            console.log(`   Is Hashed (bcrypt)? ${isHashed ? '✅ YES' : '❌ NO (Plaintext)'}`);
        });

    } catch (e) {
        console.error("Error querying prisma:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
