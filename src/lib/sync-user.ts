import { currentUser } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

/**
 * Syncs the currently authenticated Clerk user into the Supabase `users` table.
 * This is a server-side utility that should be called from any server component
 * or layout where the user is expected to be authenticated.
 * 
 * This approach is more reliable than webhooks as it runs within our own app.
 */
export async function syncUserToSupabase() {
    try {
        const user = await currentUser();

        if (!user) return null;

        const email = user.emailAddresses[0]?.emailAddress;
        if (!email) return null;

        const { error } = await supabaseAdmin.from("users").upsert({
            id: user.id,
            email: email,
            first_name: user.firstName,
            last_name: user.lastName,
            image_url: user.imageUrl,
        }, {
            onConflict: "id",
        });

        if (error) {
            console.error("[syncUserToSupabase] Error upserting user:", error);
        }

        return user;
    } catch (err) {
        console.error("[syncUserToSupabase] Unexpected error:", err);
        return null;
    }
}
