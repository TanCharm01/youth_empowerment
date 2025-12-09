
import { createClient } from '@supabase/supabase-js';
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
} catch (e) {
    console.log("Could not load .env file:", e.message);
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials in .env");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    console.log("Checking Supabase connection to:", supabaseUrl);
    const { data, error } = await supabase.from('users').select('count', { count: 'exact', head: true });

    if (error) {
        console.error("Supabase Error:", error);
    } else {
        console.log("Supabase Connection Successful! Users count result/meta:", data === null ? "null data (expected for HEAD)" : data);

        // Try selecting one user
        const { data: users, error: userError } = await supabase.from('users').select('email, role').limit(5);
        if (userError) {
            console.error("User fetch error:", userError);
        } else {
            console.log("Fetched users:", users);
        }
    }
}

main().catch(console.error);
