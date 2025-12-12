'use server';

import { createClient } from '@/utils/supabase/server';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function enrollInProgram(programId: string) {
    const supabase = await createClient();

    // 1. Get User
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        // Should ideally be handled by middleware/layout, but safety check
        return { error: "Unauthorized" };
    }

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
            return { message: "Already enrolled" };
        }

        // 3. Create enrollment record
        await prisma.user_progress.create({
            data: {
                user_id: user.id,
                program_id: programId,
                total_videos: 0, // Should be calculated, but default 0 for now
                watched_videos: 0,
                percent_complete: 0
            }
        });

        // 4. Revalidate to update UI
        revalidatePath('/dashboard');
        revalidatePath(`/programs/${programId}`);

        return { success: true };
    } catch (error) {
        console.error("Enrollment error:", error);
        return { error: "Failed to enroll" };
    }
}
