import Link from "next/link";
import { ProspectJoinForm } from "@/components/prospect-join-form";

/** P1-12 + requirements + optional Clerk path */
export function JoinSection() {
    return (
        <section
            id="join"
            className="py-20 md:py-28 px-6 w-full max-w-7xl mx-auto border-t border-white/5"
        >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
                <div className="lg:col-span-5 space-y-6 min-w-0">
                    <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent-gold">
                        Membership
                    </p>
                    <h2 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl text-text-primary tracking-tight text-balance">
                        Join our{" "}
                        <span className="font-display-drama gold-text">community</span>
                    </h2>
                    <p className="font-mono text-sm text-text-secondary leading-relaxed">
                        Students and young professionals in and around Chennai who want to run real service — not spectate.
                    </p>

                    <div className="rounded-2xl border border-white/10 p-5 space-y-3">
                        <p className="font-mono text-[10px] uppercase tracking-wider text-accent-cranberry">
                            Requirements
                        </p>
                        <ul className="space-y-2 font-mono text-xs text-text-secondary">
                            <li>• Age typically 18–30 (Rotaract guidelines)</li>
                            <li>• Willing to serve the community in Chennai</li>
                            <li>• Available for club meetings and project days</li>
                            <li>• Active participation preferred</li>
                        </ul>
                    </div>

                    <p className="font-mono text-xs text-text-secondary">
                        Prefer an account first?{" "}
                        <Link href="/sign-up" className="text-accent-gold hover:underline">
                            Create a member login
                        </Link>
                    </p>
                </div>

                <div className="lg:col-span-7 glass-panel rounded-[2rem] border border-white/5 p-6 sm:p-8 min-w-0">
                    <p className="font-heading font-bold text-lg text-text-primary mb-6">
                        Membership application
                    </p>
                    <ProspectJoinForm />
                </div>
            </div>
        </section>
    );
}
