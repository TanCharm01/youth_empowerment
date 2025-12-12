import { createClient } from '@/utils/supabase/server';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { BookOpen, GraduationCap, User, Star, ArrowRight } from 'lucide-react';

// Icon mapping based on the seed data "cover_image" strings
const iconMap: Record<string, any> = {
    'book-open': BookOpen,
    'graduation-cap': GraduationCap,
    'user': User,
    'star': Star,
};

export default async function ProgramsPage() {
    // Fetch programs from DB
    const programs = await prisma.programs.findMany({
        orderBy: { created_at: 'asc' } // or whatever order
    });

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4">
                <div className="mb-10 text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Explore Our Programs</h1>
                    <p className="text-gray-500 max-w-2xl mx-auto">
                        Choose the path that fits your current stage of life.
                        Unlock your potential with our tailored curriculums.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {programs.map((program) => {
                        const Icon = iconMap[program.cover_image || 'book-open'] || BookOpen;

                        // Dynamic styling based on icon/type for visual variety (optional but nice)
                        // formatting: High School -> text-pink-500, University -> text-purple-500, etc.
                        // For now we use a generic aesthetic similar to the dashboard.

                        return (
                            <Link
                                key={program.id}
                                href={`/programs/${program.id}`} // Assuming route is /programs/[id]
                                className="bg-white rounded-[2rem] p-8 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 block group border border-gray-100"
                            >
                                <div className="w-16 h-16 rounded-2xl bg-pink-50 flex items-center justify-center text-pink-500 mb-6 group-hover:scale-110 transition-transform">
                                    <Icon className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-pink-600 transition-colors">
                                    {program.title}
                                </h3>
                                <p className="text-gray-500 text-sm leading-relaxed mb-6">
                                    {program.description}
                                </p>
                                <div className="flex items-center text-sm font-bold text-gray-400 group-hover:text-pink-500 transition-colors">
                                    View Program <ArrowRight className="w-4 h-4 ml-2" />
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {programs.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-gray-400">No programs found yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
