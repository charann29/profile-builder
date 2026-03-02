import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Server-side Supabase client (uses anon key; email confirmation is disabled)
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

function shadowEmail(mobile: string) {
    return `${mobile}@mobile.oneasy.com`;
}

export async function POST(req: NextRequest) {
    try {
        const { mobile, otp } = await req.json();

        if (!mobile || !/^\d{10}$/.test(mobile)) {
            return NextResponse.json(
                { error: "Invalid mobile number." },
                { status: 400 },
            );
        }

        if (!otp || !/^\d{4,6}$/.test(otp)) {
            return NextResponse.json(
                { error: "Invalid OTP." },
                { status: 400 },
            );
        }

        // ── Step 1: Verify OTP via MSG91 ──────────────────────────────────
        const authKey = process.env.MSG91_AUTHKEY;
        const countryCode = process.env.MSG91_COUNTRY_CODE || "91";

        if (!authKey) {
            console.error("MSG91_AUTHKEY is missing from environment variables");
            return NextResponse.json(
                { error: "OTP service is not configured." },
                { status: 500 },
            );
        }

        console.log(`[verify-otp] Verifying OTP for mobile: ${countryCode}${mobile}`);

        const verifyRes = await fetch(
            `https://control.msg91.com/api/v5/otp/verify?mobile=${countryCode}${mobile}&otp=${otp}&authkey=${authKey}`,
            { method: "POST" },
        );

        const verifyData = await verifyRes.json();
        console.log("[verify-otp] MSG91 response:", JSON.stringify(verifyData));

        if (verifyData.type !== "success" && verifyData.type !== "SUCCESS") {
            return NextResponse.json(
                { error: verifyData.message || "OTP verification failed." },
                { status: 400 },
            );
        }

        // ── Step 2: Shadow account login/signup in Supabase ──────────────
        const email = shadowEmail(mobile);

        // Generate a random password using native crypto (serverless-safe)
        // Supabase enforces a 72-character password limit
        const randomPassword = crypto.randomUUID() + 'A1!';

        // Create an admin client to securely manage the user
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // 1. Try to find existing user by email (avoids loading ALL users)
        console.log(`[verify-otp] Looking up user by email: ${email}`);
        const { data: userList, error: fetchError } = await supabaseAdmin.auth.admin.listUsers({
            page: 1,
            perPage: 1,
        });

        // Use a targeted approach: try to sign in first, create if not found
        let userExists = false;

        // Check if user exists by attempting to get user list filtered approach
        // Since Supabase admin API doesn't support email filter directly,
        // we use a try-signIn approach to avoid loading all users
        const { data: testSignIn, error: testSignInError } = await supabase.auth.signInWithPassword({
            email,
            password: 'dummy-test-will-fail',
        });

        // If error is "Invalid login credentials", user exists but wrong password
        // If error is something else or user is null, user might not exist
        if (testSignInError) {
            if (testSignInError.message.includes("Invalid login credentials")) {
                userExists = true;
            }
            // Any other error means user likely doesn't exist
        }

        console.log(`[verify-otp] User exists: ${userExists}`);

        if (userExists) {
            // Find the user to get their ID — use a paginated search
            const { data: { users }, error: listErr } = await supabaseAdmin.auth.admin.listUsers({
                page: 1,
                perPage: 50,
            });

            const user = users?.find((u) => u.email === email);

            if (!user) {
                console.error("[verify-otp] User exists but could not be found in list");
                return NextResponse.json(
                    { error: "Account lookup failed. Please try again." },
                    { status: 500 },
                );
            }

            // Update their password to the new random one
            const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
                user.id,
                { password: randomPassword }
            );

            if (updateError) {
                console.error("[verify-otp] Failed to update shadow password:", updateError);
                return NextResponse.json(
                    { error: "Login failed during security update. Please try again." },
                    { status: 500 },
                );
            }
        } else {
            // Create the user with the random password
            console.log(`[verify-otp] Creating new user: ${email}`);
            const { data: signUpData, error: signUpError } = await supabaseAdmin.auth.admin.createUser({
                email,
                password: randomPassword,
                email_confirm: true,
                user_metadata: {
                    full_name: `Mobile User ${mobile}`,
                    phone: mobile,
                    is_mobile_user: true,
                }
            });

            if (signUpError) {
                console.error("[verify-otp] Shadow signup error:", signUpError);
                return NextResponse.json(
                    { error: "Could not create your account. Please try again." },
                    { status: 500 },
                );
            }
            console.log(`[verify-otp] User created successfully: ${signUpData?.user?.id}`);
        }

        // 2. Now sign in through the client api to get a real session
        console.log(`[verify-otp] Signing in with new password...`);
        const { data: sessionData, error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password: randomPassword
        });

        if (signInError || !sessionData?.session) {
            console.error("[verify-otp] Sign in with dynamic password failed:", signInError);
            return NextResponse.json(
                { error: "Login failed after verification. Please try again." },
                { status: 500 },
            );
        }

        console.log(`[verify-otp] Login successful for ${mobile}`);
        return NextResponse.json({
            success: true,
            session: sessionData.session,
        });
    } catch (err) {
        console.error("[verify-otp] Unhandled error:", err);
        return NextResponse.json(
            { error: err instanceof Error ? `Server error: ${err.message}` : "Something went wrong. Please try again." },
            { status: 500 },
        );
    }
}
