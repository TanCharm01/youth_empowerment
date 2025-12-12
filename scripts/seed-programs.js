
// Ensure we load env vars first
require('dotenv').config();

const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const databaseUrl = process.env.DATABASE_URL;

// Re-implement the adapter logic locally for the script to be self-contained and sure
const connectionString = `${databaseUrl}`;
const pool = new Pool({
    connectionString,
    // Add SSL rejection is false as per our fix for dev
    ssl: { rejectUnauthorized: false }
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function seed() {
    try {
        const count = await prisma.programs.count();
        console.log(`Current count: ${count}`);

        if (count === 0) {
            console.log("Seeding programs...");
            const programs = [
                { title: "High School", description: "Ace your exams and navigate teen life with confidence.", cover_image: "book-open" },
                { title: "University", description: "Thrive in your degree, campus life, and beyond.", cover_image: "graduation-cap" },
                { title: "Gap Year", description: "Make the most of your time off to discover yourself.", cover_image: "user" },
                { title: "Personal Dev", description: "Grow in faith, character, leadership and life skills.", cover_image: "star" }
            ];

            for (const p of programs) {
                await prisma.programs.create({ data: p });
                console.log(`Created: ${p.title}`);
            }
            console.log("Seeding complete!");
        } else {
            console.log("Programs already exist. Skipping.");
        }
    } catch (e) {
        console.error("Seeding error:", e);
    } finally {
        await prisma.$disconnect();
    }
}

seed();
