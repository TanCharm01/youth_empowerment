import { verifyAdmin } from '@/lib/admin-auth';
import { createClient } from '@/utils/supabase/server';

export default async function AdminDashboard() {
    await verifyAdmin();
    const supabase = await createClient();

    // Fetch stats using count option
    const { count: programsCount } = await supabase.from('programs').select('*', { count: 'exact', head: true });
    const { count: videosCount } = await supabase.from('videos').select('*', { count: 'exact', head: true });
    const { count: usersCount } = await supabase.from('users').select('*', { count: 'exact', head: true });

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-gray-500 font-medium text-sm uppercase tracking-wider">Total Users</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{usersCount || 0}</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-gray-500 font-medium text-sm uppercase tracking-wider">Programs</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{programsCount || 0}</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-gray-500 font-medium text-sm uppercase tracking-wider">Videos</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{videosCount || 0}</p>
                </div>
            </div>
        </div>
    );
}
