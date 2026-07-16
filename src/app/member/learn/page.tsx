import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { LearnClient } from "@/components/member/learn-client";

export default async function LearnPage() {
    const { userId } = await auth();
    if (!userId) redirect("/sign-in");

    const { data: me } = await supabase
        .from("users")
        .select("tutorial_completed_at")
        .eq("id", userId)
        .maybeSingle();

    return (
        <div className="max-w-2xl">
            <p className="font-mono text-xs text-text-secondary mb-6 leading-relaxed">
                Soft onboarding — not a hard gate. Walk through the basics every Rotaractor should
                know, then jump into events or the weekly prompt.
            </p>
            <LearnClient alreadyComplete={Boolean(me?.tutorial_completed_at)} />
        </div>
    );
}
