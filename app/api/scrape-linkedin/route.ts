import { NextRequest, NextResponse } from "next/server";

// Apify actor: curious_coder/linkedin-profile-scraper
const ACTOR_ID = "PEgClm7RgRD7YO94b";

export async function POST(req: NextRequest) {
    try {
        const { linkedin_url } = await req.json();

        if (!linkedin_url || !linkedin_url.includes("linkedin.com/in/")) {
            return NextResponse.json(
                { detail: "Invalid LinkedIn URL" },
                { status: 400 },
            );
        }

        const apiKey = process.env.APIFY_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { detail: "Apify API key is not configured." },
                { status: 500 },
            );
        }

        const profileUrl = linkedin_url.trim().replace(/\/$/, "") + "/";
        console.log(`[scrape-linkedin] Scraping: ${profileUrl}`);

        // Run the Apify actor synchronously and get dataset items
        const apifyUrl = `https://api.apify.com/v2/acts/${ACTOR_ID}/run-sync-get-dataset-items?token=${apiKey}`;

        const res = await fetch(apifyUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                urls: [profileUrl],
            }),
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error("[scrape-linkedin] Apify error:", res.status, errorText);
            return NextResponse.json(
                { detail: `Scraping failed: ${errorText}` },
                { status: res.status },
            );
        }

        const data = await res.json();
        console.log(`[scrape-linkedin] Success — got ${Array.isArray(data) ? data.length : 0} result(s)`);

        // Return in the same format the frontend expects
        return NextResponse.json({
            success: true,
            data: Array.isArray(data) ? data : [data],
        });
    } catch (err) {
        console.error("[scrape-linkedin] Error:", err);
        return NextResponse.json(
            { detail: err instanceof Error ? err.message : "Scraping failed" },
            { status: 500 },
        );
    }
}
