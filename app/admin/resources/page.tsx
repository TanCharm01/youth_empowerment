import { verifyAdmin } from '@/lib/admin-auth';
import { createClient } from '@/utils/supabase/server';
import { createResource, deleteResource } from './actions';
import { Trash2, Plus, FileText, Download } from 'lucide-react';

export default async function ResourcesPage() {
    await verifyAdmin();
    const supabase = await createClient();

    // Fetch resources with their associated program title
    const { data: resources, error: resourcesError } = await supabase
        .from('resources')
        .select('*, program:programs(title)')
        .order('created_at', { ascending: false });

    // Fetch programs for the dropdown
    const { data: programs, error: programsError } = await supabase
        .from('programs')
        .select('*')
        .order('title', { ascending: true });

    const resourceList = resources || [];
    const programList = programs || [];

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Manage Resources</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* List Section */}
                <div>
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">Existing Resources</h2>
                    <div className="space-y-4">
                        {resourceList.map((resource: any) => (
                            <div key={resource.id} className="bg-white p-4 rounded-lg shadow border border-gray-200 flex justify-between items-center">
                                <div className="flex items-start">
                                    <div className="bg-blue-50 p-3 rounded-lg mr-4 text-blue-600">
                                        <FileText className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">{resource.title}</h3>
                                        <div className="text-sm text-gray-500 mb-1">
                                            <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded text-xs font-semibold">
                                                {resource.program?.title || 'Unknown Program'}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500 truncate max-w-xs">{resource.description}</p>
                                        <a href={resource.file_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline flex items-center mt-1">
                                            <Download className="w-3 h-3 mr-1" /> {resource.file_url}
                                        </a>
                                    </div>
                                </div>
                                <form action={deleteResource.bind(null, resource.id)}>
                                    <button type="submit" className="text-red-500 hover:text-red-700 p-2">
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </form>
                            </div>
                        ))}
                        {resourceList.length === 0 && (
                            <p className="text-gray-500 italic">No resources found.</p>
                        )}
                    </div>
                </div>

                {/* Create Section */}
                <div className="bg-white p-6 rounded-lg shadow border border-gray-200 h-fit">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700 flex items-center">
                        <Plus className="w-5 h-5 mr-2" />
                        Add New Resource
                    </h2>
                    <form action={createResource} className="space-y-4">
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
                                placeholder="e.g., Study Guide PDF"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                name="description"
                                rows={2}
                                className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
                                placeholder="Brief description of the resource..."
                            ></textarea>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">File URL</label>
                            <input
                                name="file_url"
                                type="url"
                                required
                                className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
                                placeholder="https://drive.google.com/..."
                            />
                            <p className="text-xs text-gray-500 mt-1">Direct link to the file (Google Drive, Dropbox, etc.)</p>
                        </div>
                        <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                            Add Resource
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
