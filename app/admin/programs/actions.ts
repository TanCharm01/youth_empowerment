'use server';

import { verifyAdmin } from '@/lib/admin-auth';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createProgram(formData: FormData) {
    await verifyAdmin();
    const supabase = await createClient();

    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const cover_image = formData.get('cover_image') as string;

    const { error } = await supabase.from('programs').insert({
        title,
        description,
        cover_image: cover_image || null,
    });

    if (error) {
        console.error("Error creating program:", error);
        // Ideally Handle error
    }

    revalidatePath('/admin/programs');
}

export async function deleteProgram(id: string) {
    await verifyAdmin();
    const supabase = await createClient();

    const { error } = await supabase.from('programs').delete().eq('id', id);

    if (error) {
        console.error("Error deleting program:", error);
    }

    revalidatePath('/admin/programs');
}
