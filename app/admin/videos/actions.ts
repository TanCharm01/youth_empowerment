'use server';

import { verifyAdmin } from '@/lib/admin-auth';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createVideo(formData: FormData) {
    await verifyAdmin();
    const supabase = await createClient();

    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const youtube_url = formData.get('youtube_url') as string;
    const program_id = formData.get('program_id') as string;

    const { error } = await supabase.from('videos').insert({
        title,
        description,
        youtube_url,
        program_id,
    });

    if (error) {
        console.error("Error creating video:", error);
    }

    revalidatePath('/admin/videos');
}

export async function deleteVideo(id: string) {
    await verifyAdmin();
    const supabase = await createClient();

    const { error } = await supabase.from('videos').delete().eq('id', id);

    if (error) {
        console.error("Error deleting video:", error);
    }

    revalidatePath('/admin/videos');
}
