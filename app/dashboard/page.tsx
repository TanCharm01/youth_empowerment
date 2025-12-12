import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { BookOpen, PlayCircle, Settings, LogOut, Award, Clock } from 'lucide-react';
import { logout } from '@/app/(auth)/signup/actions';

export default async function DashboardPage() {
    const supabase = await createClient();
    let userId: string | null = null;
    let userEmail: string | undefined;

    // 1. Try Supabase Auth
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
        userId = user.id;
        userEmail = user.email;
    } else {
        // 2. Try Custom Session Fallback
        const cookieStore = await cookies();
        const customSession = cookieStore.get('custom_session');
        if (customSession) {
            userId = customSession.value;
        }
    }

    if (!userId) {
        redirect('/login');
    }

    // 3. Fetch User Data & Stats from DB
    // We fetch in parallel for performance
    const [dbUser, progressCount, watchHistory] = await Promise.all([
        prisma.users.findUnique({
            where: { id: userId },
            select: { name: true, email: true, level: true }
        }),
        prisma.user_progress.count({
            where: { user_id: userId }
        }),
        prisma.watch_history.count({
            where: { user_id: userId }
        })
    ]);

    // Use DB name or fallback to email part or "Student"
    const displayName = dbUser?.name || userEmail?.split('@')[0] || "Student";

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header Section */}
            <div className="bg-white border-b border-pink-100">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-400">{displayName}</span>!
                            </h1>
                            <p className="text-gray-500 mt-1">Ready to continue your journey today?</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <form action={logout}>
                                <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium transition-colors">
                                    <LogOut className="w-4 h-4" />
                                    Log Out
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-10 space-y-10">
                {/* Stats Grid */}
                <section className="grid md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-pink-50 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-pink-50 flex items-center justify-center text-pink-500">
                            <BookOpen className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Programs Enrolled</p>
                            <h3 className="text-2xl font-bold text-gray-900">{progressCount}</h3>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-pink-50 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-500">
                            <PlayCircle className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Videos Watched</p>
                            <h3 className="text-2xl font-bold text-gray-900">{watchHistory}</h3>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-pink-50 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-yellow-50 flex items-center justify-center text-yellow-500">
                            <Award className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Current Level</p>
                            <h3 className="text-xl font-bold text-gray-900 capitalize">{dbUser?.level?.toString().replace('_', ' ').toLowerCase() || 'N/A'}</h3>
                        </div>
                    </div>
                </section>

                {/* Continue Learning / Quick Actions */}
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <Clock className="w-5 h-5 text-gray-400" />
                                Recommended for you
                            </h2>
                            <Link href="/programs" className="text-primary text-sm font-bold hover:underline">
                                Browse all programs
                            </Link>
                        </div>

                        {/* Placeholder for "Continue Watching" or "Recommended" */}
                        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm text-center py-16">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                                <PlayCircle className="w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">Start a new program</h3>
                            <p className="text-gray-500 max-w-sm mx-auto mt-2 mb-6">You haven't started any programs yet. Explore our library to find your next step.</p>
                            <Link href="/programs" className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full font-bold hover:bg-pink-600 transition-colors shadow-lg shadow-pink-200">
                                <BookOpen className="w-4 h-4" />
                                Browse Catalog
                            </Link>
                        </div>
                    </div>

                    {/* Sidebar / Profile Card */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-[2rem] border border-pink-50 shadow-sm">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center text-2xl font-bold text-white shadow-inner">
                                    {displayName[0].toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">{displayName}</h3>
                                    <p className="text-sm text-gray-500">{dbUser?.email || userEmail}</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Link href="/profile" className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 group transition-colors">
                                    <span className="text-gray-600 font-medium group-hover:text-primary">Edit Profile</span>
                                    <Settings className="w-4 h-4 text-gray-400 group-hover:text-primary" />
                                </Link>
                                {/* Add more links here if needed */}
                            </div>
                        </div>

                        {/* Motivational Quote Card */}
                        <div className="bg-gradient-to-br from-pink-500 to-rose-400 p-8 rounded-[2rem] text-white shadow-xl shadow-pink-200 relative overflow-hidden">
                            <div className="relative z-10">
                                <p className="font-serif text-lg italic opacity-90 leading-relaxed">
                                    "For I know the plans I have for you," declares the LORD, "plans to prosper you and not to harm you, plans to give you hope and a future."
                                </p>
                                <p className="mt-4 font-bold text-sm opacity-75">— Jeremiah 29:11</p>
                            </div>
                            {/* Decorative circles */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-xl -mr-10 -mt-10" />
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-xl -ml-10 -mb-10" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
