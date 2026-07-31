import Link from "next/link";
import { ProspectJoinForm } from "@/components/prospect-join-form";

/**
 * Act V · the single ask.
 *
 * The last thing on the page, and the only one with a form, so the form gets
 * the panel and everything else stays flat.
 */
export function JoinSection() {
    return (
        <div id="join" className="w-full max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
                <div className="lg:col-span-5 min-w-0" data-reveal>
                    <h2 className="font-heading font-extrabold text-step-4 text-text-primary tracking-tight">
                        Run service.{" "}
                        <span className="font-display-drama text-gold-ink">Don&apos;t spectate.</span>
                    </h2>
                    <p className="mt-6 text-step-1 text-text-primary/85 measure leading-relaxed">
                        Vishwahita takes in students and young professionals in and around
                        Chennai who want to lead projects, not just attend them.
                    </p>

                    <dl className="mt-10 divide-y divide-white/10 border-y border-white/10">
                        {[
                            ["Age", "Typically 18–30, per Rotaract guidelines"],
                            ["Commitment", "Club meetings and project days in Chennai"],
                            ["Expectation", "Active participation on at least one committee"],
                        ].map(([label, value]) => (
                            <div key={label} className="grid grid-cols-12 gap-4 py-4">
                                <dt className="col-span-4 font-mono text-[10px] uppercase tracking-[0.22em] text-text-secondary pt-1">
                                    {label}
                                </dt>
                                <dd className="col-span-8 text-step-0 text-text-primary">
                                    {value}
                                </dd>
                            </div>
                        ))}
                    </dl>

                    <p className="mt-6 text-step--1 text-text-secondary">
                        Prefer an account first?{" "}
                        <Link
                            href="/sign-up"
                            className="text-gold-ink border-b border-accent-gold/40 hover:border-accent-gold transition-colors"
                        >
                            Create a member login
                        </Link>
                    </p>
                </div>

                <div
                    className="lg:col-span-6 lg:col-start-7 glass-panel rounded-[2rem] border border-white/10 p-6 sm:p-9 min-w-0"
                    data-reveal
                    data-reveal-delay="120"
                >
                    <h3 className="font-heading font-bold text-step-1 text-text-primary mb-7">
                        Membership application
                    </h3>
                    <ProspectJoinForm />
                </div>
            </div>
        </div>
    );
}
