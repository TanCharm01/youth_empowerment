import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function verifyAdmin() {
    const supabase = await createClient();

    // 1. Try Supabase Auth (Checks Authorization Header / Token automatically if cookie present)
    // createClient in utils/supabase/server handles cookies.
    const {
        data: { user },
    } = await supabase.auth.getUser();

    let userId = user?.id;

    // 2. If no Supabase user, try Custom Session
    if (!userId) {
        const cookieStore = await cookies();
        const customSession = cookieStore.get('custom_session');
        if (customSession) {
            userId = customSession.value;
        }
    }

    // 3. If still no user, unauthorized
    if (!userId) {
        redirect('/login?error=admin_no_user');
    }

    // Validate UUID (optional but good hygiene)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(userId)) {
        redirect('/login?error=admin_invalid_uuid');
    }

    // 4. Verify Role via Supabase Query (HTTP)
    const { data: dbUser, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .single();

    if (error || !dbUser || dbUser.role !== 'ADMIN') {
        // If not admin or error finding user
        console.log("Admin Auth Failed:", error?.message || "Not Admin");
        redirect('/');
    }

    return userId;
}
