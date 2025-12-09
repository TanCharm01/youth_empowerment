'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { logout } from '@/app/(auth)/signup/actions';

export default function Navbar({ isLoggedIn }: { isLoggedIn: boolean }) {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm' : 'bg-transparent'}`}>
            <div className="container mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="text-2xl font-bold tracking-tight text-primary flex items-center gap-2">
                    <Heart className="w-6 h-6 fill-current" />
                    <span>Tanatswa</span>
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
                    <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                    <Link href="/about" className="hover:text-primary transition-colors">About</Link>
                    <Link href="/programs" className="hover:text-primary transition-colors">Programs</Link>
                    <Link href="/mentorship" className="hover:text-primary transition-colors">Mentorship</Link>
                </div>

                {/* Auth Buttons */}
                <div className="hidden md:flex items-center gap-4">
                    {isLoggedIn ? (
                        <>
                            <Link href="/programs" className="font-medium text-gray-600 hover:text-primary transition-colors">
                                My Dashboard
                            </Link>
                            <form action={logout}>
                                <button type="submit" className="px-5 py-2.5 bg-gray-100 text-gray-700 text-sm font-semibold rounded-full hover:bg-gray-200 transition-transform active:scale-95 border border-gray-200">
                                    Log Out
                                </button>
                            </form>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-primary">Log in</Link>
                            <Link href="/signup" className="px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-full hover:bg-primary/90 transition-transform active:scale-95 shadow-lg shadow-primary/25">
                                Get Started
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 text-gray-600">
                    {isOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-b"
                    >
                        <div className="flex flex-col p-4 gap-4 text-center">
                            <Link href="/" onClick={() => setIsOpen(false)}>Home</Link>
                            <Link href="/programs" onClick={() => setIsOpen(false)}>Programs</Link>
                            {isLoggedIn ? (
                                <form action={logout} className="w-full">
                                    <button type="submit" className="w-full py-2 text-red-500 font-medium">
                                        Log Out
                                    </button>
                                </form>
                            ) : (
                                <Link href="/signup" onClick={() => setIsOpen(false)} className="text-primary font-bold">Sign Up</Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
