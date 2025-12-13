import Link from "next/link";
import { notFound } from "next/navigation";
import { FileText, PlayCircle, ArrowLeft, Download } from "lucide-react";
import prisma from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import StartProgramButton from "../components/StartProgramButton";

// Helper to get YouTube ID
function getYoutubeId(url: string) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

export default async function ProgramPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    const program = await prisma.programs.findUnique({
        where: { id: slug },
        include: {
            videos: { orderBy: { order_index: 'asc' } },
            resources: true
        }
    });

    if (!program) return notFound();

    // Check if user is enrolled
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    let isEnrolled = false;

    if (user) {
        const enrollment = await prisma.user_progress.findUnique({
            where: {
                user_id_program_id: {
                    user_id: user.id,
                    program_id: slug
                }
            }
        });
        isEnrolled = !!enrollment;
    }

    return (
        <div className="min-h-screen bg-white">
            {/* 1. Header Section with Half-Circle */}
            <div className="relative bg-primary text-white pt-20 pb-32 rounded-b-[50%] md:rounded-b-[40%] shadow-xl overflow-hidden">
                <div className="absolute top-4 left-4 z-10">
                    <Link href="/programs" className="inline-flex items-center text-white/80 hover:text-white transition-colors">
                        <ArrowLeft className="w-5 h-5 mr-1" /> Back
                    </Link>
                </div>
                <div className="container mx-auto px-4 text-center relative z-10">
                    <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold mb-4 uppercase tracking-wider">
                        Program
                    </span>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 tracking-tight">
                        {program.title}
                    </h1>
                    <p className="text-lg text-pink-100 max-w-2xl mx-auto opacity-90 mb-8">
                        {program.description}
                    </p>
                    
                    {/* Start/Continue Button */}
                    <div className="flex justify-center">
                        <StartProgramButton programId={program.id} isEnrolled={isEnrolled} />
                    </div>
                </div>
                {/* Decorative background pattern could go here */}
            </div>

            {/* 2. My Thoughts Section */}
            <section className="container mx-auto px-4 py-16 -mt-10 relative z-20">
                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl max-w-5xl mx-auto border border-pink-50 flex flex-col md:flex-row gap-10 items-center">
                    <div className="flex-1 space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900 border-b-4 border-pink-200 inline-block pb-1">
                            My Thoughts on {program.title}
                        </h2>
                        <div className="prose text-gray-600 leading-relaxed">
                            <p>
                                I believe this stage is crucial for everyone. It bridges the gap between fundamental knowledge and real-world application.
                                In this program, we dive deep into the core concepts that I wish I knew when I was starting out.
                                It is designed not just to teach, but to inspire and empower you to take the next step in your journey with confidence.
                            </p>
                            <p>
                                Take your time with each episode, and don't forget to check the resources!
                            </p>
                        </div>
                    </div>
                    <div className="w-full md:w-1/3 shrink-0">
                        {/* Placeholder Image as requested - using program cover if available or a placeholder */}
                        <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 shadow-lg rotate-3 transform hover:rotate-0 transition-transform duration-300">
                            {/* Using a placeholder service or the program image if it exists, implementing the requested hardcoded style */}
                            <img
                                src={program.cover_image || "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
                                alt="Author Thoughts"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Episodes Section (Horizontal Scroll) */}
            <section className="py-16 bg-gray-50/50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                        {program.title} Episodes
                    </h2>

                    {program.videos && program.videos.length > 0 ? (
                        <div className="flex overflow-x-auto gap-6 pb-8 snap-x p-4 scrollbar-hide">
                            {program.videos.map((video) => {
                                const videoId = getYoutubeId(video.youtube_url);
                                return (
                                    <div key={video.id} className="min-w-[300px] md:min-w-[400px] snap-center bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden flex flex-col">
                                        <div className="aspect-video bg-black relative group">
                                            {videoId ? (
                                                <iframe
                                                    src={`https://www.youtube.com/embed/${videoId}`}
                                                    title={video.title}
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                    className="w-full h-full"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-white">
                                                    <PlayCircle className="w-12 h-12 opacity-50" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-5 flex-1 flex flex-col">
                                            <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">{video.title}</h3>
                                            <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">{video.description}</p>
                                        </div>
                                    </div>
                                );
                            })}
                            {/* Spacer for right padding */}
                            <div className="w-4 shrink-0"></div>
                        </div>
                    ) : (
                        <div className="text-center text-gray-400 py-10">No videos available yet.</div>
                    )}
                </div>
            </section>

            {/* Resources Section (Preserved just in case, but styled minimally) */}
            {program.resources && program.resources.length > 0 && (
                <section className="container mx-auto px-4 py-8">
                    <div className="max-w-2xl mx-auto">
                        <h3 className="text-xl font-bold text-gray-800 mb-4 px-4">Resources</h3>
                        <div className="space-y-3">
                            {program.resources.map(file => (
                                <a key={file.id} href={file.file_url} download className="flex items-center p-4 bg-white rounded-xl border border-gray-100 hover:border-primary/30 transition-colors shadow-sm gap-4">
                                    <div className="bg-blue-50 p-2 rounded-lg text-blue-600"><FileText size={20} /></div>
                                    <div className="flex-1">
                                        <div className="font-semibold text-gray-900">{file.title}</div>
                                        <div className="text-xs text-gray-500">{file.description}</div>
                                    </div>
                                    <Download size={18} className="text-gray-400" />
                                </a>
                            ))}
                        </div>
                    </div>
                </section>
            )}


            {/* 4. Subscribe CTA Section */}
            <section className="py-20 bg-white border-t border-gray-100">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">Want more?</h2>
                    <p className="text-gray-500 mb-8 max-w-lg mx-auto">
                        Subscribe to my YouTube channel for weekly updates, behind-the-scenes content, and more educational videos.
                    </p>
                    <a
                        href="https://www.youtube.com/@TanCharm"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-8 py-4 bg-[#FF0000] text-white font-bold rounded-full text-lg shadow-lg hover:bg-red-700 hover:scale-105 transition-all transform"
                    >
                        <PlayCircle className="w-6 h-6 mr-2 fill-current" />
                        Subscribe to YT
                    </a>
                </div>
            </section>

        </div>
    );
}

