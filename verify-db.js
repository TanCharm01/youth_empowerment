const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Load .env manually to avoid dotenv weirdness if possible, or just use it if reliable.
// We saw earlier that reading it manually helped debug the newline issue.
function getDatabaseUrl() {
    try {
        const envPath = path.resolve(__dirname, '.env');
        const envContent = fs.readFileSync(envPath, 'utf8');
        const lines = envContent.split('\n');
        for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith('DATABASE_URL=')) {
                let value = trimmed.substring('DATABASE_URL='.length);
                if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
                    value = value.slice(1, -1);
                }
                return value;
            }
        }
    } catch (e) {
        console.error("Error reading .env:", e);
    }
    return process.env.DATABASE_URL;
}

async function testConnection() {
    let connectionString = getDatabaseUrl();
    if (!connectionString) {
        console.error("No DATABASE_URL found");
        return;
    }

    console.log(`Original URL length: ${connectionString.length}`);
    console.log(`Original URL (ends with): ${JSON.stringify(connectionString.slice(-5))}`);

    // The Fix: Trim it!
    const trimmed = connectionString.trim();
    console.log(`Trimmed URL length: ${trimmed.length}`);

    // Test 1: Try without SSL explicit (relies on query param or defaults)
    console.log("\n--- Attempting connection with Trimmed URL ---");
    const pool = new Pool({ connectionString: trimmed });

    try {
        const res = await pool.query('SELECT count(*) FROM "user_progress"');
        console.log("SUCCESS! user_progress count:", res.rows[0].count);
    } catch (e) {
        console.error("Connection failed:", e.message);
        if (e.message.includes("SSL")) {
            console.log("Retrying with SSL: true...");
            const poolSSL = new Pool({ connectionString: trimmed, ssl: true });
            try {
                const res = await poolSSL.query('SELECT count(*) FROM "user_progress"');
                console.log("SUCCESS with SSL! user_progress count:", res.rows[0].count);
            } catch (e2) {
                console.error("Connection failed even with SSL:", e2.message);

                console.log("Retrying with SSL: rejectUnauthorized: false...");
                const poolRelaxed = new Pool({ connectionString: trimmed, ssl: { rejectUnauthorized: false } });
                try {
                    const res = await poolRelaxed.query('SELECT count(*) FROM "user_progress"');
                    console.log("SUCCESS with Relaxed SSL! user_progress count:", res.rows[0].count);
                } catch (e3) {
                    console.error("Connection failed with Relaxed SSL:", e3.message);
                }
            }
        }
    } finally {
        await pool.end();
    }
}

testConnection();
