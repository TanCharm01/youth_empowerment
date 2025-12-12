const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

// Try to load dotenv
try {
    require('dotenv').config();
} catch (e) {
    console.log("dotenv not found or failed to load");
}

const envPath = path.resolve(__dirname, '..', '.env');
const sqlPath = path.resolve(__dirname, '..', 'create_missing_tables.sql');

// Simple .env parser fallback
function getDatabaseUrlFromFile() {
    try {
        if (!fs.existsSync(envPath)) return null;
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
        console.error("Error reading .env file manually:", e);
    }
    return null;
}

async function run() {
    let connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        console.log("DATABASE_URL not in process.env, trying manual parse...");
        connectionString = getDatabaseUrlFromFile();
    }

    if (!connectionString) {
        console.error("Could not find DATABASE_URL");
        process.exit(1);
    }

    // Debug log (masked)
    console.log(`URL found (raw): ${connectionString.substring(0, 15)}...`);

    // Sanitize: remove all whitespace/newlines
    connectionString = connectionString.replace(/\s/g, '');

    console.log(`URL (sanitized): ${connectionString.substring(0, 15)}...${connectionString.substring(connectionString.length - 10)}`);

    console.log("Connecting to database...");
    const pool = new Pool({ connectionString });

    try {
        const sql = fs.readFileSync(sqlPath, 'utf8');
        console.log("Executing SQL...");
        await pool.query(sql);
        console.log("Success! Tables created.");
    } catch (e) {
        console.error("Error executing SQL:", e);
        // Special handling for "relation already exists" is implicit since we use IF NOT EXISTS in SQL,
        // but let's see exactly what fails.
        process.exit(1);
    } finally {
        await pool.end();
    }
}

run();
