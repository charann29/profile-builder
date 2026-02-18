import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client with service role key (bypasses RLS)
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
);

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 });
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json({ error: 'Image must be under 5MB' }, { status: 400 });
        }

        // Create unique file path
        const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
        const fileName = `uploads/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

        // Convert to buffer for upload
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Upload using service role (bypasses RLS)
        const { error: uploadError } = await supabaseAdmin.storage
            .from('user_images')
            .upload(fileName, buffer, {
                contentType: file.type,
                cacheControl: '3600',
                upsert: true,
            });

        if (uploadError) {
            console.error('Upload error:', uploadError);
            return NextResponse.json({ error: uploadError.message }, { status: 500 });
        }

        // Get public URL
        const { data: urlData } = supabaseAdmin.storage
            .from('user_images')
            .getPublicUrl(fileName);

        return NextResponse.json({ url: urlData.publicUrl });
    } catch (err) {
        console.error('Upload failed:', err);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}
