'use server';
// Prisma Client regenerated and verified

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import prisma from '@/lib/prisma';
import { user_level } from '@prisma/client';

import { cookies } from 'next/headers';

export async function login(prevState: any, formData: FormData) {
    const supabase = await createClient();

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        // Fallback: If "Email not confirmed", check our DB directly as per user request
        if (error.message.includes("Email not confirmed")) {
            console.log("Supabase Auth blocked login (Email not confirmed). Checking DB...");

            // Check public.users table
            const { data: user, error: dbError } = await supabase
                .from('users')
                .select('*')
                .eq('email', email)
                .single();

            // Simple password check (In production, use hashing!)
            // Since we stored it directly in step 328/332/624, we match it directly.
            if (user && user.password === password) {
                // Create a custom session cookie to bypass Supabase Auth restriction
                // This is a "Mock Session" for the demo requirement
                (await cookies()).set('custom_session', user.id, {
                    httpOnly: true,
                    path: '/',
                    maxAge: 60 * 60 * 24 * 7 // 1 week
                });

                revalidatePath('/', 'layout');
                redirect('/'); // Redirect to landing page
            }
        }
        return { message: error.message };
    }

    revalidatePath('/', 'layout');
    redirect('/');
}

export async function signup(prevState: any, formData: FormData) {
    const supabase = await createClient();

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const name = formData.get('name') as string;

    // 1. Sign up with Supabase Auth
    const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: name,
            },
        },
    });

    if (error) {
        return { message: error.message };
    }

    // 2. Insert into public.users table (Sync)
    if (data.user) {
        const { error: insertError } = await supabase
            .from('users')
            .insert({
                id: data.user.id,
                email: email,
                name: name,
                password: password,
                level: 'HIGH_SCHOOL', // Default
                role: 'USER',
            });

        if (insertError) {
            console.error("Failed to sync user to public table:", insertError);
            if (insertError.code === '42501') {
                return { message: 'Database policy violation. Please contact admin.' };
            }
            return { message: 'Failed to create user profile in database.' };
        }
    }

    // 3. Redirect to Login
    redirect('/login');
}

export async function logout() {
    const supabase = await createClient();
    await supabase.auth.signOut();

    // Clear custom session cookie
    (await cookies()).delete('custom_session');

    revalidatePath('/', 'layout');
    redirect('/');
}
