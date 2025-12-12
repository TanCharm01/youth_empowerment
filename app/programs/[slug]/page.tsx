import Link from "next/link";
import { notFound } from "next/navigation";
import { FileText, PlayCircle, ArrowLeft, Download } from "lucide-react";
import prisma from "@/lib/prisma";

export default async function ProgramPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    // Fetch program with relations
    const program = await prisma.programs.findUnique({
        where: { id: slug },
        include: {
            videos: {
                orderBy: { order_index: 'asc' }
            },
            resources: true
        }
    });

    if (!program) return notFound();

    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* Header */}
            <div className="bg-white border-b border-pink-100">
                <div className="container mx-auto px-4 py-8 md:py-12">
                    <Link href="/programs" className="inline-flex items-center text-sm text-gray-500 hover:text-primary mb-6 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Programs
                    </Link>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{program.title}</h1>
                            <p className="text-gray-500 max-w-2xl">
                                {program.description || "Your curated learning path. Watch the lessons in order or download resources to study at your own pace."}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="px-3 py-1 bg-pink-100 text-pink-700 text-xs font-semibold rounded-full uppercase tracking-wider">
                                {(program.videos?.length || 0) + (program.resources?.length || 0)} Items
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content List */}
            <div className="container mx-auto px-4 py-12">
                <div className="grid gap-6 max-w-4xl mx-auto">
                    {/* Videos Section */}
                    {program.videos && program.videos.length > 0 && (
                        <>
                            <h2 className="text-xl font-bold text-gray-800 mt-4 mb-2">Video Lessons</h2>
                            {program.videos.map((video) => (
                                <div key={video.id} className="group bg-white rounded-2xl p-6 border border-pink-50 hover:border-pink-200 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-6 md:items-center">
                                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 bg-rose-50 text-rose-500">
                                        <PlayCircle className="w-8 h-8" />
                                    </div>
                                    <div className="flex-grow">
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-rose-100 text-rose-700">
                                                VIDEO
                                            </span>
                                            {/* Duration is not in DB Schema currently */}
                                            {/* <span className="text-xs text-gray-400">{video.duration}</span> */}
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors mb-2">
                                            {video.title}
                                        </h3>
                                        <p className="text-gray-500 text-sm leading-relaxed">
                                            {video.description}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3 shrink-0 mt-2 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-gray-100">
                                        <a
                                            href={video.youtube_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-5 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-primary transition-colors flex items-center gap-2 shadow-lg shadow-gray-200"
                                        >
                                            <PlayCircle className="w-4 h-4" /> Watch
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}

                    {/* Resources Section */}
                    {program.resources && program.resources.length > 0 && (
                        <>
                            <h2 className="text-xl font-bold text-gray-800 mt-8 mb-2">Downloadable Resources</h2>
                            {program.resources.map((file) => (
                                <div key={file.id} className="group bg-white rounded-2xl p-6 border border-pink-50 hover:border-pink-200 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-6 md:items-center">
                                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 bg-blue-50 text-blue-500">
                                        <FileText className="w-8 h-8" />
                                    </div>
                                    <div className="flex-grow">
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                                                PDF
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors mb-2">
                                            {file.title}
                                        </h3>
                                        <p className="text-gray-500 text-sm leading-relaxed">
                                            {file.description}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3 shrink-0 mt-2 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-gray-100">
                                        <a
                                            href={file.file_url}
                                            download
                                            className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2"
                                        >
                                            <Download className="w-4 h-4" /> Download
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}

                    {(!program.videos || program.videos.length === 0) && (!program.resources || program.resources.length === 0) && (
                        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                            <p className="text-gray-400">Content coming soon for {program.title}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

