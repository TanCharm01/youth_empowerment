import { verifyAdmin } from '@/lib/admin-auth';
import { createClient } from '@/utils/supabase/server';
import { createProgram, deleteProgram } from './actions';
import { Trash2, Plus } from 'lucide-react';

export default async function ProgramsPage() {
    await verifyAdmin();
    const supabase = await createClient();

    const { data: programs, error } = await supabase
        .from('programs')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching programs:", error);
    }

    const list = programs || [];

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Manage Programs</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* List Section */}
                <div>
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">Existing Programs</h2>
                    <div className="space-y-4">
                        {list.map((program) => (
                            <div key={program.id} className="bg-white p-4 rounded-lg shadow border border-gray-200 flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold text-lg">{program.title}</h3>
                                    <p className="text-sm text-gray-500 truncate max-w-xs">{program.description}</p>
                                </div>
                                <form action={deleteProgram.bind(null, program.id)}>
                                    <button type="submit" className="text-red-500 hover:text-red-700 p-2">
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </form>
                            </div>
                        ))}
                        {list.length === 0 && (
                            <p className="text-gray-500 italic">No programs found.</p>
                        )}
                    </div>
                </div>

                {/* Create Section */}
                <div className="bg-white p-6 rounded-lg shadow border border-gray-200 h-fit">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700 flex items-center">
                        <Plus className="w-5 h-5 mr-2" />
                        Add New Program
                    </h2>
                    <form action={createProgram} className="space-y-4">
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image URL</label>
                            <input
                                name="cover_image"
                                type="text"
                                className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
                                placeholder="https://..."
                            />
                        </div>
                        <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                            Create Program
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
