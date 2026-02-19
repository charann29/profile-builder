import { NextRequest, NextResponse } from 'next/server';
import { modifyTemplateWithAI } from '@/app/lib/ai-edit';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { html, prompt, userData } = body;

        if (!html || !prompt) {
            return NextResponse.json(
                { error: 'Missing html or prompt' },
                { status: 400 }
            );
        }

        const modifiedHtml = await modifyTemplateWithAI({ html, prompt, userData });
        return NextResponse.json({ html: modifiedHtml });

    } catch (error) {
        console.error('Error processing AI edit:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
