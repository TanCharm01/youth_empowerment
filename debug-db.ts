
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    try {
        console.log("Connecting to database...")
        const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
        console.log('--- TABLES IN DB ---');
        console.table(tables);
    } catch (e) {
        console.error("Error querying database:", e);
    } finally {
        await prisma.$disconnect()
    }
}

main();
