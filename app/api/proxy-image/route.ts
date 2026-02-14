import { NextRequest, NextResponse } from 'next/server';

/**
 * Server-side image proxy to bypass LinkedIn CDN hotlinking protection.
 * LinkedIn returns 403 for direct browser requests from non-LinkedIn domains.
 * This route fetches the image server-side and streams it to the client.
 *
 * Usage: /api/proxy-image?url=<encoded-linkedin-image-url>
 */
export async function GET(req: NextRequest) {
    const url = req.nextUrl.searchParams.get('url');

    if (!url) {
        return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 });
    }

    // Only allow LinkedIn CDN URLs to prevent open proxy abuse
    const allowed = [
        'media.licdn.com',
        'media-exp1.licdn.com',
        'media-exp2.licdn.com',
        'static.licdn.com',
    ];

    let hostname: string;
    try {
        hostname = new URL(url).hostname;
    } catch {
        return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
    }

    if (!allowed.some(h => hostname.endsWith(h))) {
        return NextResponse.json({ error: 'URL domain not allowed' }, { status: 403 });
    }

    try {
        const response = await fetch(url, {
            headers: {
                // Mimic a browser request to avoid CDN blocks
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
                'Referer': 'https://www.linkedin.com/',
            },
        });

        if (!response.ok) {
            return NextResponse.json(
                { error: `Upstream returned ${response.status}` },
                { status: response.status }
            );
        }

        const contentType = response.headers.get('content-type') || 'image/jpeg';
        const buffer = await response.arrayBuffer();

        return new NextResponse(buffer, {
            status: 200,
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=86400, s-maxage=86400', // cache 24h
                'Access-Control-Allow-Origin': '*',
            },
        });
    } catch (error) {
        console.error('Image proxy error:', error);
        return NextResponse.json({ error: 'Failed to fetch image' }, { status: 502 });
    }
}
