import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { syncUserToSupabase } from "@/lib/sync-user";
import { MemberNav } from "@/components/member/member-nav";

export default async function MemberLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { userId } = await auth();
    if (!userId) redirect("/sign-in");
    await syncUserToSupabase();

    return (
        <div className="min-h-screen pt-24 pb-16 px-5 md:pt-32 md:pb-24 md:px-6 max-w-7xl mx-auto">
            <div className="mb-6">
                <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-text-primary tracking-tight">
                    Member clubroom
                </h1>
                <p className="mt-1 text-sm text-text-secondary">
                    RSVP, weekly prompt, ideas, and club tools.
                </p>
            </div>
            <MemberNav />
            {children}
        </div>
    );
}
