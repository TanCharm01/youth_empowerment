import { verifyAdmin } from '@/lib/admin-auth';
import { createClient } from '@/utils/supabase/server';
import { createVideo, deleteVideo } from './actions';
import { Trash2, Plus, PlayCircle } from 'lucide-react';

export default async function VideosPage() {
    await verifyAdmin();
    const supabase = await createClient();

    const { data: videos, error: videosError } = await supabase
        .from('videos')
        .select('*, program:programs(title)') // Join to get program title
        .order('created_at', { ascending: false });

    const { data: programs, error: programsError } = await supabase
        .from('programs')
        .select('*')
        .order('title', { ascending: true });

    const videoList = videos || [];
    const programList = programs || [];

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Manage Videos</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* List Section */}
                <div>
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">Existing Videos</h2>
                    <div className="space-y-4">
                        {videoList.map((video: any) => (
                            <div key={video.id} className="bg-white p-4 rounded-lg shadow border border-gray-200 flex justify-between items-center">
                                <div className="flex items-start">
                                    <PlayCircle className="w-10 h-10 text-gray-300 mr-4 flex-shrink-0" />
                                    <div>
                                        <h3 className="font-bold text-lg">{video.title}</h3>
                                        <div className="text-sm text-gray-500 mb-1">
                                            <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs font-semibold">
                                                {video.program?.title || 'Unknown Program'}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500 truncate max-w-xs">{video.youtube_url}</p>
                                    </div>
                                </div>
                                <form action={deleteVideo.bind(null, video.id)}>
                                    <button type="submit" className="text-red-500 hover:text-red-700 p-2">
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </form>
                            </div>
                        ))}
                        {videoList.length === 0 && (
                            <p className="text-gray-500 italic">No videos found.</p>
                        )}
                    </div>
                </div>

                {/* Create Section */}
                <div className="bg-white p-6 rounded-lg shadow border border-gray-200 h-fit">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700 flex items-center">
                        <Plus className="w-5 h-5 mr-2" />
                        Add New Video
                    </h2>
                    <form action={createVideo} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Program</label>
                            <select
                                name="program_id"
                                required
                                className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none bg-white"
                                defaultValue=""
                            >
                                <option value="" disabled>Select a Program</option>
                                {programList.map((p: any) => (
                                    <option key={p.id} value={p.id}>{p.title}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                            <input
                                name="title"
                                type="text"
                                required
                                className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                name="description"
                                rows={3}
                                className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
                            ></textarea>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">YouTube URL</label>
                            <input
                                name="youtube_url"
                                type="text"
                                required
                                className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
                                placeholder="https://youtube.com/..."
                            />
                        </div>
                        <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                            Add Video
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
