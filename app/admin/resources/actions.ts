'use server';

import { verifyAdmin } from '@/lib/admin-auth';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createResource(formData: FormData) {
    await verifyAdmin();
    const supabase = await createClient();

    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const program_id = formData.get('program_id') as string;
    const file_url = formData.get('file_url') as string;

    const { error } = await supabase
        .from('resources')
        .insert({
            title,
            description,
            program_id,
            file_url
        });

    if (error) {
        console.error("Error creating resource:", error);
        return { message: 'Failed to create resource' };
    }

    revalidatePath('/admin/resources');
    revalidatePath(`/programs/${program_id}`); // Revalidate public page too
    redirect('/admin/resources');
}

export async function deleteResource(id: string) {
    await verifyAdmin();
    const supabase = await createClient();

    const { error } = await supabase
        .from('resources')
        .delete()
        .eq('id', id);

    if (error) {
        console.error("Error deleting resource:", error);
        return { message: 'Failed to delete resource' };
    }

    revalidatePath('/admin/resources');
}
