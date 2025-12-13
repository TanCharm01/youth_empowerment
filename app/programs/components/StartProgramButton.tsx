'use client';

import { useState } from 'react';
import { PlayCircle, CheckCircle, Loader2 } from 'lucide-react';
import { enrollInProgram } from '@/app/actions/programs';
import { useRouter } from 'next/navigation';

interface StartProgramButtonProps {
    programId: string;
    isEnrolled: boolean;
}

export default function StartProgramButton({ programId, isEnrolled }: StartProgramButtonProps) {
    const [loading, setLoading] = useState(false);
    const [enrolled, setEnrolled] = useState(isEnrolled);
    const router = useRouter();

    const handleStart = async () => {
        if (enrolled) {
            router.push('/dashboard');
            return;
        }

        setLoading(true);
        try {
            const result = await enrollInProgram(programId);
            if (result.success || result.message === "Already enrolled") {
                setEnrolled(true);
                router.refresh(); // Refresh server components to reflect changes if needed
                router.push('/dashboard'); // Optional: Redirect to dashboard immediately? Or just show "Enrolled"
                // User requirement: "user should be able to see a program on their dashboard when they start it"
                // Usually redirecting to dashboard or letting them stay is fine. Let's redirect to dashboard as a confirmation action?
                // Actually, maybe just changing the button state is better UX, but let's stick to simple "Start -> Enrolled" logic.
            } else {
                console.error(result.error);
                alert("Failed to enroll. Please try again.");
            }
        } catch (e) {
            console.error(e);
            alert("An error occurred.");
        } finally {
            setLoading(false);
        }
    };

    if (enrolled) {
        return (
            <button
                onClick={() => router.push('/dashboard')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary font-bold rounded-full shadow-lg hover:bg-gray-50 transition-all transform hover:scale-105"
            >
                <CheckCircle className="w-5 h-5" />
                Continue Learning
            </button>
        );
    }

    return (
        <button
            onClick={handleStart}
            disabled={loading}
            className="inline-flex items-center gap-2 px-8 py-3 bg-white text-primary font-bold rounded-full shadow-lg hover:bg-gray-50 hover:scale-105 transition-all transform disabled:opacity-70 disabled:cursor-not-allowed"
        >
            {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
                <PlayCircle className="w-5 h-5" />
            )}
            Start Program
        </button>
    );
}
