'use client';

import Link from 'next/link';
import { login } from '../signup/actions';
import { useActionState } from 'react';

export default function LoginPage() {
    const [state, formAction, isPending] = useActionState(login, { message: '' });

    return (
        <div className="flex min-h-[calc(100vh-200px)] items-center justify-center px-4">
            <div className="w-full max-w-md bg-white p-8 rounded-[2rem] shadow-2xl border border-pink-50">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
                    <p className="text-gray-500 mt-2">Please enter your details to sign in.</p>
                </div>

                <form action={formAction} className="flex flex-col gap-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input name="email" type="email" required className="w-full p-4 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" placeholder="hello@example.com" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input name="password" type="password" required className="w-full p-4 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" placeholder="••••••••" />
                    </div>

                    {state?.message && (
                        <p className="text-sm text-red-500 text-center">{state.message}</p>
                    )}

                    <button type="submit" disabled={isPending} className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-pink-600 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-pink-200">
                        {isPending ? 'Logging in...' : 'Log In'}
                    </button>
                </form>

                <p className="text-center mt-8 text-gray-500 text-sm">
                    Don't have an account? <Link href="/signup" className="text-primary font-bold hover:underline">Sign up</Link>
                </p>
            </div>
        </div>
    )
}
