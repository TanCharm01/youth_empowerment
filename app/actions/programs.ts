'use server';

import { createClient } from '@/utils/supabase/server';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

console.log("AG_DEBUG: programs.ts module loaded");
export async function enrollInProgram(programId: string) {
    console.log(`AG_DEBUG: enrollInProgram called for ${programId}`);
    try {
        const supabase = await createClient();
        console.log("AG_DEBUG: Supabase client created");

        // 1. Get User
        const { data: { user: supabaseUser }, error: authError } = await supabase.auth.getUser();
        let user = supabaseUser;

        if (authError || !user) {
            console.log("AG_DEBUG: Supabase Auth failed/empty, checking custom session...");
            const { cookies } = await import('next/headers');
            const { verifySession } = await import('@/lib/auth');
            const cookieStore = await cookies();
            const customSession = cookieStore.get('custom_session');

            if (customSession) {
                const sessionPayload = await verifySession(customSession.value);
                if (sessionPayload && sessionPayload.userId) {
                    console.log("AG_DEBUG: Found valid custom session.");
                    user = { id: sessionPayload.userId } as any; // Mock user object with just ID
                }
            }
        }

        if (!user) {
            console.error("AG_DEBUG: No authenticated user found (Supabase or Custom).");
            return { error: "Unauthorized" };
        }

        console.log(`Attempting enrollment for User: ${user.id}, Program: ${programId}`);

        try {
            // 2. Check if already enrolled
            const existing = await prisma.user_progress.findUnique({
                where: {
                    user_id_program_id: {
                        user_id: user.id,
                        program_id: programId
                    }
                }
            });

            if (existing) {
                console.log("User already enrolled.");
                return { message: "Already enrolled" };
            }

            // 3. Create enrollment record
            console.log("Creating enrollment record...");
            await prisma.user_progress.create({
                data: {
                    user_id: user.id,
                    program_id: programId,
                    total_videos: 0, // Should be calculated, but default 0 for now
                    watched_videos: 0,
                    percent_complete: 0
                }
            });
            console.log("Enrollment successful.");

            // 4. Revalidate to update UI
            revalidatePath('/dashboard');
            revalidatePath(`/programs/${programId}`);

            return { success: true };
        } catch (error: any) {
            console.error("Enrollment error DETAILS (JSON):", JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
            return { error: `Failed to enroll: ${error.message}` };
        }
    } catch (e: any) {
        console.error("AG_DEBUG: Top level error in enrollInProgram:", JSON.stringify(e, Object.getOwnPropertyNames(e), 2));
        return { error: "An unexpected error occurred" };
    }
}
