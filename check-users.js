
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("Checking users in database...");
    const users = await prisma.users.findMany({
        select: {
            id: true,
            email: true,
            role: true
        }
    });

    if (users.length === 0) {
        console.log("No users found in database.");
    } else {
        console.log("Users found:");
        users.forEach(u => {
            console.log(`- Email: ${u.email}, Role: ${u.role}, ID: ${u.id}`);
        });
    }
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
