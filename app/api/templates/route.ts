import { NextResponse } from 'next/server';
import { getTemplateList } from '@/app/lib/template-engine';

export async function GET() {
    const templates = await getTemplateList();
    return NextResponse.json({ templates });
}
