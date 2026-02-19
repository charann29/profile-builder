// This is a Server Component
import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, Plus } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import LiveTemplatePreview from '../components/templates/LiveTemplatePreview';

// Ensure we don't cache this page aggressively so new templates appear
export const dynamic = 'force-dynamic';

export default async function TemplatesPage() {
    // Server-side Supabase client
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY! // Use Service Key for server-side fetching if needed, or Anon
    );

    const { data: templates } = await supabase
        .from('templates')
        .select('*')
        .order('created_at', { ascending: false });

    // We can't use useProfileStore here directly as it's client-side, 
    // but the gallery is mainly for display. Selection happens via client component or URL.
    // Actually, "Selected" state is client-side. 
    // To mix Server Component (fetching) and Client Component (state), we usually separate them.
    // However, for simplicity, let's keep it as is but make the INTERACTIVE parts client-side?
    // OR just make this page Client Component and fetch in useEffect (easiest migration).
    // Given the task constraints, let's make it a Client Component for now to preserve existing logic 
    // or refactor to fetch server side and pass to a client list.

    // DECISION: Refactor to Client Component fetching from Supabase to preserve `useProfileStore` logic easily.
    // Ideally Server Components are better, but mixed state is complex.
    // Let's stick to Client Component for now to match `AdminTemplatesPage`. 
    // WAIT, the previous file was 'use client'. I should probably keep it 'use client' and fetch in useEffect,
    // OR fetch data here (as server component) and pass to a Client Component wrapper.
    // Let's go with Client Component fetching to minimal code change.

    return <TemplatesPageClient />;
}

import TemplatesPageClient from './TemplatesPageClient';
