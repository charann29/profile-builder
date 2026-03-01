import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// We explicitly create a service-role client to bypass RLS for this public read specifically
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        if (!id) {
            return NextResponse.json({ error: 'Profile ID is required' }, { status: 400 });
        }

        // Fetch just the profile_data, none of the messages or private metadata
        const { data, error } = await supabaseAdmin
            .from('profiles')
            .select('profile_data, updated_at')
            .eq('id', id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
            }
            console.error('Error fetching public profile:', error);
            return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Unexpected error in public profile route:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
