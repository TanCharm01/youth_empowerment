'use server';
// Prisma Client regenerated and verified

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import prisma from '@/lib/prisma';
import { user_level } from '@prisma/client';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { z } from 'zod'; // Import Zod
import { signSession } from '@/lib/auth'; // Import JWT helper

// Zod Schemas
const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

const signupSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().min(2),
});

export async function login(prevState: any, formData: FormData) {
    const supabase = await createClient();

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    // 1. Zod Validation
    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
        return { message: "Invalid input: " + parsed.error.issues.map(i => i.message).join(", ") };
    }

    const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        // Fallback: Check our DB directly
        if (error.message.includes("Email not confirmed") || error.message.includes("Invalid login credentials")) {
            console.log("Supabase Auth failed/blocked. Checking DB...");

            const { data: user, error: dbError } = await supabase
                .from('users')
                .select('*')
                .eq('email', email)
                .single();

            if (user) {
                // Check password with bcrypt
                const isMatch = await bcrypt.compare(password, user.password);

                // BACKWARD COMPATIBILITY: Check plain text if bcrypt fails (remove this after migration if desired)
                const isPlainMatch = user.password === password;

                if (isMatch || isPlainMatch) {
                    // Update to hash if it was plain text? (Optional enhancement)

                    // Create a signed JWT session
                    const token = await signSession({ userId: user.id });

                    (await cookies()).set('custom_session', token, {
                        httpOnly: true,
                        path: '/',
                        secure: process.env.NODE_ENV === 'production',
                        // 30 minutes idle timeout
                        maxAge: 30 * 60 // 30 minutes
                    });

                    revalidatePath('/', 'layout');
                    redirect('/');
                }
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

    // 1. Zod Validation
    const parsed = signupSchema.safeParse({ email, password, name });
    if (!parsed.success) {
        return { message: "Invalid input: " + parsed.error.issues.map(i => i.message).join(", ") };
    }

    // 2. Sign up with Supabase Auth
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

    // 3. Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Insert into public.users table (Sync)
    if (data.user) {
        const { error: insertError } = await supabase
            .from('users')
            .insert({
                id: data.user.id,
                email: email,
                name: name,
                password: hashedPassword, // Store Hashed Password
                level: 'HIGH_SCHOOL',
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

    redirect('/login');
}

export async function logout() {
    const supabase = await createClient();
    await supabase.auth.signOut();

    (await cookies()).delete('custom_session');

    revalidatePath('/', 'layout');
    redirect('/');
}
