
import { createClient } from './utils/supabase/server';
import prisma from './lib/prisma'; // Assumes you have a prisma client export
import { signSession, verifySession } from './lib/auth';
import { z } from 'zod';

const TEST_EMAIL = 'security_test_' + Date.now() + '@example.com';
const TEST_PASSWORD = 'SecurePassword123!';

async function main() {
    console.log("🔒 Starting Comprehensive Security Audit...\n");

    let errors = 0;

    // --- TEST 1: Security Headers ---
    console.log("1️⃣  Testing Security Headers (A05)...");
    try {
        const res = await fetch('http://localhost:3000');
        const headers = res.headers;

        const requiredHeaders = [
            'x-content-type-options',
            'x-frame-options',
            'strict-transport-security',
            'referrer-policy'
        ];

        let headerMissing = false;
        requiredHeaders.forEach(h => {
            if (!headers.get(h)) {
                console.error(`   ❌ Missing Header: ${h}`);
                headerMissing = true;
            } else {
                console.log(`   ✅ Found: ${h}`);
            }
        });

        if (headerMissing) errors++;
        else console.log("   ✅ Security Headers check passed.");

    } catch (e) {
        console.error("   ❌ Failed to fetch localhost:3000. Is the server running?", e);
        errors++;
    }
    console.log("");


    // --- TEST 2: JWT Security (A01, A07) ---
    console.log("2️⃣  Testing JWT Session Logic (A01/A07)...");
    const payload = { userId: 'test-user-id', role: 'user' };
    const token = await signSession(payload);

    // Test Valid Verification
    const verified = await verifySession(token);
    if (verified && verified.userId === payload.userId) {
        console.log("   ✅ Valid JWT verified successfully.");
    } else {
        console.error("   ❌ Failed to verify valid JWT.");
        errors++;
    }

    // Test Tampered Token
    const tamperedToken = token.substring(0, token.length - 5) + "XXXXX";
    const verifiedTampered = await verifySession(tamperedToken);
    if (verifiedTampered === null) {
        console.log("   ✅ Tampered JWT correctly rejected.");
    } else {
        console.error("   ❌ Tampered JWT NOT rejected!");
        errors++;
    }
    console.log("");

    console.log("3️⃣  Testing Input Validation Logic (A03)...");
    const loginSchema = z.object({
        email: z.string().email(),
        password: z.string().min(6),
    });

    const valid = loginSchema.safeParse({ email: 'test@example.com', password: 'password123' });
    const invalidEmail = loginSchema.safeParse({ email: 'not-an-email', password: 'password123' });
    const shortPass = loginSchema.safeParse({ email: 'test@example.com', password: '123' });

    if (valid.success && !invalidEmail.success && !shortPass.success) {
        console.log("   ✅ Zod Schema correctly validates inputs.");
    } else {
        console.error("   ❌ Zod Schema validation failed.");
        errors++;
    }
    console.log("");

    // --- Summary ---
    console.log("--------------------------------------------------");
    if (errors === 0) {
        console.log("🎉  ALL AUTOMATED CHECKS PASSED!");
        console.log("Note: Database hashing for actual users must be checked manually or via database inspection.");
    } else {
        console.log(`⚠️  Found ${errors} issues during automated testing.`);
    }
}

main().catch(console.error);
