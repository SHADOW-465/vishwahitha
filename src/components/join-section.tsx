import Link from "next/link";
import { ProspectJoinForm } from "@/components/prospect-join-form";
import { FAQSection } from "@/components/faq-section";

/** Primary conversion: prospect form. Clerk is secondary for inducted members. */
export function JoinSection() {
    return (
        <section
            id="join"
            className="cinema-section py-20 md:py-28 px-6 w-full max-w-7xl mx-auto border-t border-white/5"
        >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
                <div className="lg:col-span-5 space-y-6 min-w-0">
                    <h2 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl text-text-primary tracking-tight text-balance">
                        Tell the board you want in
                    </h2>
                    <p className="text-sm text-text-secondary leading-relaxed max-w-md">
                        Students and young professionals in and around Chennai who want to run real
                        service — not spectate. Submit once; we reply with next steps for orientation.
                    </p>

                    <div className="rounded-2xl border border-white/10 p-5 space-y-3">
                        <p className="font-mono text-[10px] uppercase tracking-wider text-accent-gold">
                            What we look for
                        </p>
                        <ul className="space-y-2 text-sm text-text-secondary">
                            <li>• Age typically 18–30 (Rotaract guidelines)</li>
                            <li>• Willing to serve communities in Chennai</li>
                            <li>• Available for meetings and project days</li>
                            <li>• Ready to participate, not only observe</li>
                        </ul>
                    </div>

                    <p className="font-mono text-xs text-text-secondary">
                        Already a club member?{" "}
                        <Link href="/sign-in" className="text-accent-gold hover:underline">
                            Sign in to the clubroom
                        </Link>
                    </p>

                    <FAQSection embedded />
                </div>

                <div className="lg:col-span-7 rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 sm:p-8 min-w-0">
                    <p className="font-heading font-bold text-lg text-text-primary mb-2">
                        Membership application
                    </p>
                    <p className="font-mono text-[11px] text-text-secondary mb-6">
                        Goes to the president&apos;s inbox — no account required to apply.
                    </p>
                    <ProspectJoinForm />
                </div>
            </div>
        </section>
    );
}
