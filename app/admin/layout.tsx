import { verifyAdmin } from '@/lib/admin-auth';
import Link from 'next/link';
import { LayoutDashboard, Users, BookOpen, Video, FileText } from 'lucide-react';
import { logout } from '@/app/(auth)/signup/actions';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    await verifyAdmin();

    const navItems = [
        { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
        { name: 'Programs', href: '/admin/programs', icon: BookOpen },
        { name: 'Videos', href: '/admin/videos', icon: Video },
        // { name: 'Resources', href: '/admin/resources', icon: FileText }, // Future
        { name: 'Users', href: '/admin/users', icon: Users },
    ];

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md flex flex-col">
                <div className="p-6 border-b border-gray-200">
                    <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-blue-600 rounded-lg transition-colors"
                        >
                            <item.icon className="w-5 h-5 mr-3" />
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    ))}
                </nav>
                <div className="p-4 border-t border-gray-200">
                    <form action={logout}>
                        <button type="submit" className="w-full flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            Logout
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8">
                {children}
            </main>
        </div>
    );
}
