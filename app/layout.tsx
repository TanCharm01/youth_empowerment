import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Tanatswa's Youth Empowerment Hub",
  description: 'Empowering youth with resources and mentorship.',
};

import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const supabase = await createClient();

  // Check for real Supabase session
  const { data: { user } } = await supabase.auth.getUser();

  // Check for our custom fallback session
  const customSession = cookieStore.get('custom_session');

  const isLoggedIn = !!user || !!customSession;

  let isAdmin = false;
  const userId = user?.id || customSession?.value;

  if (userId) {
    const { data: dbUser } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single();

    if (dbUser?.role === 'ADMIN') {
      isAdmin = true;
    }
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.variable} font-sans antialiased flex flex-col min-h-screen bg-orange-50/30 text-foreground`}>
        <Navbar isLoggedIn={isLoggedIn} isAdmin={isAdmin} />
        <main className="flex-grow pt-20">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
