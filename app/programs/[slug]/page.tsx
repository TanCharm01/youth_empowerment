import Link from "next/link";
import { notFound } from "next/navigation";
import { FileText, PlayCircle, ArrowLeft, Download, Bookmark } from "lucide-react";

// Mock Data matching new Schema structure
const mockVideos = [
    {
        id: "v1",
        title: "Welcome & Course Overview",
        youtube_url: "https://youtube.com/...",
        description: "An introduction to what we will cover in this mentorship program.",
        duration: "10 min"
    },
    {
        id: "v2",
        title: "Finding Your Purpose",
        youtube_url: "https://youtube.com/...",
        description: "A deep dive into understanding your unique calling and gifts.",
        duration: "45 min"
    }
];

const mockFiles = [
    {
        id: "r1",
        title: "Goal Setting Worksheet",
        file_url: "/files/goal-setting.pdf",
        description: "Download this PDF to map out your vision for the year.",
        size: "2.4 MB"
    },
    {
        id: "r2",
        title: "Weekly Reflection Journal",
        file_url: "/files/journal.pdf",
        description: "Printable pages for your Sunday reset routine.",
        size: "1.1 MB"
    },
];

export default async function ProgramPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    if (!slug) return notFound();

    const title = slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

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
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{title}</h1>
                            <p className="text-gray-500 max-w-2xl">
                                Your curated learning path. Watch the lessons in order or download resources to study at your own pace.
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="px-3 py-1 bg-pink-100 text-pink-700 text-xs font-semibold rounded-full uppercase tracking-wider">
                                {mockVideos.length + mockFiles.length} Items
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content List */}
            <div className="container mx-auto px-4 py-12">
                <div className="grid gap-6 max-w-4xl mx-auto">
                    {/* Videos Section */}
                    <h2 className="text-xl font-bold text-gray-800 mt-4 mb-2">Video Lessons</h2>
                    {mockVideos.map((video) => (
                        <div key={video.id} className="group bg-white rounded-2xl p-6 border border-pink-50 hover:border-pink-200 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-6 md:items-center">
                            <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 bg-rose-50 text-rose-500">
                                <PlayCircle className="w-8 h-8" />
                            </div>
                            <div className="flex-grow">
                                <div className="flex items-center gap-3 mb-1">
                                    <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-rose-100 text-rose-700">
                                        VIDEO
                                    </span>
                                    <span className="text-xs text-gray-400">{video.duration}</span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors mb-2">
                                    {video.title}
                                </h3>
                                <p className="text-gray-500 text-sm leading-relaxed">
                                    {video.description}
                                </p>
                            </div>
                            <div className="flex items-center gap-3 shrink-0 mt-2 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-gray-100">
                                <button className="px-5 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-primary transition-colors flex items-center gap-2 shadow-lg shadow-gray-200">
                                    <PlayCircle className="w-4 h-4" /> Watch
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* Resources Section */}
                    <h2 className="text-xl font-bold text-gray-800 mt-8 mb-2">Downloadable Resources</h2>
                    {mockFiles.map((file) => (
                        <div key={file.id} className="group bg-white rounded-2xl p-6 border border-pink-50 hover:border-pink-200 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-6 md:items-center">
                            <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 bg-blue-50 text-blue-500">
                                <FileText className="w-8 h-8" />
                            </div>
                            <div className="flex-grow">
                                <div className="flex items-center gap-3 mb-1">
                                    <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                                        PDF
                                    </span>
                                    <span className="text-xs text-gray-400">{file.size}</span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors mb-2">
                                    {file.title}
                                </h3>
                                <p className="text-gray-500 text-sm leading-relaxed">
                                    {file.description}
                                </p>
                            </div>
                            <div className="flex items-center gap-3 shrink-0 mt-2 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-gray-100">
                                <button className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2">
                                    <Download className="w-4 h-4" /> Download
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
