import { SignJWT, jwtVerify } from 'jose';
import { z } from 'zod';

const JWT_SECRET = process.env.JWT_SECRET || 'default-dev-secret-do-not-use-in-prod';
const key = new TextEncoder().encode(JWT_SECRET);

const sessionSchema = z.object({
    userId: z.string(),
    role: z.string().optional(),
});

export type SessionPayload = z.infer<typeof sessionSchema>;

export async function signSession(payload: SessionPayload): Promise<string> {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(key);
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
    try {
        const { payload } = await jwtVerify(token, key, {
            algorithms: ['HS256'],
        });
        return sessionSchema.parse(payload);
    } catch (error) {
        return null;
    }
}
