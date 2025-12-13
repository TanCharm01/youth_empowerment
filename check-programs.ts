import fs from 'fs';
import path from 'path';

// Load .env manually
try {
    const envPath = path.join(process.cwd(), '.env');
    const envFile = fs.readFileSync(envPath, 'utf8');
    const lines = envFile.split(/\r?\n/);
    lines.forEach(line => {
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) {
            const key = match[1].trim();
            const value = match[2].trim().replace(/^['"]|['"]$/g, '');
            process.env[key] = value;
        }
    });
} catch (e) { console.log(e); }

// import prisma from './lib/prisma'; // REMOVED

async function checkPrograms() {
    const { default: prisma } = await import('./lib/prisma');
    console.log("Prisma imported dynamically.");
    try {
        const count = await prisma.programs.count();
        console.log(`Total programs: ${count}`);

        const programs = await prisma.programs.findMany();
        console.log("Current programs:", programs);

        if (count === 0) {
            console.log("No programs found. Seeding...");
            const seedData = [
                { title: "High School", description: "Ace your exams and navigate teen life with confidence.", cover_image: "book-open" },
                { title: "University", description: "Thrive in your degree, campus life, and beyond.", cover_image: "graduation-cap" },
                { title: "Gap Year", description: "Make the most of your time off to discover yourself.", cover_image: "user" },
                { title: "Personal Dev", description: "Grow in faith, character, leadership and life skills.", cover_image: "star" }
            ];

            for (const p of seedData) {
                await prisma.programs.create({ data: p });
            }
            console.log("Seeding complete.");
        }
    } catch (e) {
        console.error("Error:", e);
    }
    // Prisma client is managed by singleton, no need to disconnect explicitly usually, 
    // but here we are in a script.
}

checkPrograms();
