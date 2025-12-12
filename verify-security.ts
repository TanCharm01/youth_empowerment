
import { signSession, verifySession } from './lib/auth';

async function main() {
    console.log("Starting Security Verification...");

    // 1. Test JWT
    const payload = { userId: '1234-uuid-test', role: 'admin' };
    console.log("Signing payload:", payload);
    const token = await signSession(payload);
    console.log("Token generated:", token);

    const verified = await verifySession(token);
    console.log("Verified payload:", verified);

    if (verified && verified.userId === payload.userId) {
        console.log("✅ JWT Verification Passed");
    } else {
        console.error("❌ JWT Verification Failed");
        process.exit(1);
    }

    // 2. Test Invalid Token
    const invalid = await verifySession("invalid.token.here");
    if (invalid === null) {
        console.log("✅ Invalid Token Handled Correctly");
    } else {
        console.error("❌ Invalid Token Failed (Result not null)");
    }
}

main().catch(err => console.error(err));
