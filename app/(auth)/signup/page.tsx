'use client';

import Link from 'next/link';
import { signup } from './actions';
import { useActionState, useState, useEffect } from 'react';
import { Check, X } from 'lucide-react';

export default function SignupPage() {
    const [state, formAction, isPending] = useActionState(signup, { message: '' });

    // Password State
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isTouched, setIsTouched] = useState(false);

    // Password Criteria
    const criteria = [
        { label: 'At least 8 characters', valid: password.length >= 8 },
        { label: 'Contains uppercase letter', valid: /[A-Z]/.test(password) },
        { label: 'Contains lowercase letter', valid: /[a-z]/.test(password) },
        { label: 'Contains number', valid: /[0-9]/.test(password) },
        { label: 'Contains special character', valid: /[^A-Za-z0-9]/.test(password) },
    ];

    const isPasswordValid = criteria.every((c) => c.valid);
    const doPasswordsMatch = password === confirmPassword && password.length > 0;
    const canSubmit = isPasswordValid && doPasswordsMatch;

    return (
        <div className="flex min-h-[calc(100vh-200px)] items-center justify-center px-4 py-10">
            <div className="w-full max-w-md bg-white p-8 rounded-[2rem] shadow-2xl border border-pink-50">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
                    <p className="text-gray-500 mt-2">Join our community today.</p>
                </div>

                <form action={formAction} className="flex flex-col gap-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input name="name" type="text" required className="w-full p-4 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" placeholder="Tanatswa" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input name="email" type="email" required className="w-full p-4 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" placeholder="hello@example.com" />
                    </div>

                    {/* Password Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            name="password"
                            type="password"
                            required
                            className="w-full p-4 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setIsTouched(true);
                            }}
                        />

                        {/* Password Checklist */}
                        {isTouched && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-xl space-y-2 text-xs">
                                <p className="font-semibold text-gray-500 mb-1">Password must have:</p>
                                {criteria.map((item, index) => (
                                    <div key={index} className={`flex items-center gap-2 ${item.valid ? 'text-green-600' : 'text-gray-400'}`}>
                                        {item.valid ? <Check size={14} /> : <div className="w-3.5 h-3.5 rounded-full border border-gray-300" />}
                                        <span>{item.label}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Confirm Password Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                        <input
                            name="confirmPassword"
                            type="password"
                            required
                            className={`w-full p-4 rounded-xl border ${!doPasswordsMatch && confirmPassword ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-primary/20'} bg-gray-50 focus:outline-none focus:ring-2 transition-all`}
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        {!doPasswordsMatch && confirmPassword && (
                            <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
                        )}
                    </div>

                    {state?.message && (
                        <p className="text-sm text-red-500 text-center">{state.message}</p>
                    )}

                    <button
                        type="submit"
                        disabled={isPending || !canSubmit}
                        className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-pink-600 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-pink-200"
                    >
                        {isPending ? 'Signing up...' : 'Sign Up'}
                    </button>
                </form>

                <p className="text-center mt-8 text-gray-500 text-sm">
                    Already have an account? <Link href="/login" className="text-primary font-bold hover:underline">Log in</Link>
                </p>
            </div>
        </div>
    )
}
