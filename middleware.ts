
import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';

export default async function middleware(request: NextRequest) {
    try {
        // 1. Update Supabase session (refresh tokens, etc.)
        const { supabaseResponse, user } = await updateSession(request);

        // 2. Define protected routes
        // We only want to protect /programs and its sub-routes, and /dashboard
        const isProtectedRoute = request.nextUrl.pathname.startsWith('/programs') || request.nextUrl.pathname.startsWith('/dashboard');

        if (isProtectedRoute) {
            // 3. Check for Custom Session (Fallback)
            // If the user specific fallback cookie exists, we allow access
            const customSession = request.cookies.get('custom_session');

            if (!user && !customSession) {
                // No Supabase user AND no custom session -> Redirect to login
                const url = request.nextUrl.clone();
                url.pathname = '/login';
                return NextResponse.redirect(url);
            }
        }

        return supabaseResponse;
    } catch (e) {
        console.error('Middleware error:', e);
        // Fallback: allow request to proceed if auth fails, 
        // effectively failing open for non-protected routes or 
        // failing closed later for protected ones if needed?
        // For now, let's just return next() to avoid 500.
        return NextResponse.next({
            request: {
                headers: request.headers,
            },
        });
    }
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
