
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

// Load .env manually
try {
    const envPath = path.join(process.cwd(), '.env');
    const envFile = fs.readFileSync(envPath, 'utf8');

    // Handle CRLF and LF
    const lines = envFile.split(/\r?\n/);
    lines.forEach(line => {
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) {
            const key = match[1].trim();
            const value = match[2].trim().replace(/^['"]|['"]$/g, ''); // Remove quotes
            process.env[key] = value;
        }
    });
    console.log("Loaded .env file. Keys found:", Object.keys(process.env).filter(k => lines.some(l => l.startsWith(k))));
} catch (e: any) {
    console.log("Could not load .env file:", e.message);
}

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL || process.env.POSTGRES_URL_NON_POOLING;

if (!connectionString) {
    console.error("DATABASE_URL not found in .env");
    process.exit(1);
}

const prisma = new PrismaClient();

async function main() {
    console.log("Checking users in database...");
    try {
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
            console.log("Users found (" + users.length + "):");
            users.forEach(u => {
                console.log(`- Email: ${u.email}, Role: ${u.role}, ID: ${u.id}`);
            });
        }
    } catch (err) {
        console.error("Error querying users:", err);
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
