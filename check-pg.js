
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

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
} catch (e) {
    console.log("Could not load .env file:", e.message);
}

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    console.error("No DATABASE_URL");
    process.exit(1);
}

console.log("Connecting to:", connectionString.replace(/:[^:@]+@/, ':****@')); // Hide password

const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false }
});

pool.connect().then(client => {
    console.log("Connected successfully!");
    return client.query('SELECT NOW()').then(res => {
        console.log("Query result:", res.rows[0]);
        client.release();
        pool.end();
    });
}).catch(err => {
    console.error("Connection failed:", err);
    pool.end();
});
