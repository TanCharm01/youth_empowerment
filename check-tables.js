
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    try {
        console.log('Attempting to connect to DB...')
        const result = await prisma.$queryRaw`SELECT 1 as result`
        console.log('Connection Successful. Result:', result)

        console.log('Checking for tables in public schema...')
        const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `
        console.log('Found tables:', tables)

        const userProgress = tables.find(t => t.table_name === 'user_progress')
        if (userProgress) {
            console.log('SUCCESS: user_progress table FOUND.')
        } else {
            console.log('FAILURE: user_progress table NOT FOUND.')
        }

    } catch (e) {
        console.error('Script Error:', e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
