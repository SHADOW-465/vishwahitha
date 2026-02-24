import { currentUser } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const user = await currentUser();

        if (!user) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        const email = user.emailAddresses[0]?.emailAddress;

        const { data, error } = await supabaseAdmin.from("users").upsert({
            id: user.id,
            email: email,
            first_name: user.firstName,
            last_name: user.lastName,
            image_url: user.imageUrl,
        }, { onConflict: "id" }).select();

        return NextResponse.json({
            success: !error,
            userId: user.id,
            email,
            supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
            hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
            serviceKeyPrefix: process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 20) + "...",
            error: error ? { message: error.message, code: error.code, details: error.details } : null,
            data,
        });
    } catch (err: any) {
        return NextResponse.json({ error: err.message, stack: err.stack }, { status: 500 });
    }
}
