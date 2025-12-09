import Link from 'next/link';
import { Instagram, Youtube, Twitter } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-white border-t border-pink-100 py-12 mt-20">
            <div className="container mx-auto px-4 flex flex-col items-center justify-center gap-6">
                <h3 className="text-xl font-bold text-primary">Tanatswa's Hub</h3>
                <p className="text-gray-500 text-sm text-center max-w-md">
                    Empowering the next generation of leaders with resources, mentorship, and faith.
                </p>

                <div className="flex items-center gap-6 text-gray-400">
                    <Link href="#" className="hover:text-primary transition-colors"><Instagram className="w-5 h-5" /></Link>
                    <Link href="#" className="hover:text-primary transition-colors"><Youtube className="w-5 h-5" /></Link>
                    <Link href="#" className="hover:text-primary transition-colors"><Twitter className="w-5 h-5" /></Link>
                </div>

                <div className="text-xs text-gray-400">
                    &copy; {new Date().getFullYear()} Tanatswa's Youth Empowerment Hub. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
