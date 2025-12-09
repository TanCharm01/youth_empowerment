'use server';

import { verifyAdmin } from '@/lib/admin-auth';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateUserRole(formData: FormData) {
    await verifyAdmin();
    const supabase = await createClient();

    const userId = formData.get('userId') as string;
    const newRole = formData.get('role') as string;

    const { error } = await supabase
        .from('users')
        .update({ role: newRole })
        .eq('id', userId);

    if (error) {
        console.error("Error updating user role:", error);
    }

    revalidatePath('/admin/users');
}
