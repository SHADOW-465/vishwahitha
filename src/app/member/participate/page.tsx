import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ParticipateClient } from "@/components/member/participate-client";

export default async function ParticipatePage() {
    const { userId } = await auth();
    if (!userId) redirect("/sign-in");

    const [{ data: forms }, { data: responses }, { data: ideas }, { data: votes }, { data: comments }] =
        await Promise.all([
            supabase.from("pulse_forms").select("*").eq("is_active", true).limit(1),
            supabase.from("pulse_responses").select("form_id").eq("member_id", userId),
            supabase.from("ideas").select("*").order("created_at", { ascending: false }).limit(50),
            supabase.from("idea_votes").select("idea_id").eq("member_id", userId),
            supabase.from("idea_comments").select("*").order("created_at", { ascending: true }).limit(200),
        ]);

    const form = forms?.[0]
        ? {
              id: forms[0].id,
              week_label: forms[0].week_label,
              questions: forms[0].questions || [],
          }
        : null;

    const hasSubmitted = form
        ? (responses ?? []).some((r: { form_id: string }) => r.form_id === form.id)
        : false;

    const votedIds = (votes ?? []).map((v: { idea_id: string }) => v.idea_id);

    return (
        <div>
            <p className="font-mono text-xs text-text-secondary mb-6 max-w-xl leading-relaxed">
                Two ways to show up online: answer the board&apos;s weekly prompt, and propose
                ideas the club can take up.
            </p>
            <ParticipateClient
                form={form}
                hasSubmitted={hasSubmitted}
                ideas={ideas ?? []}
                userId={userId}
                votedIds={votedIds}
                comments={comments ?? []}
            />
        </div>
    );
}
