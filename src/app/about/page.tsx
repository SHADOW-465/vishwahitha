import Link from "next/link";
import { User, Mail } from "lucide-react";
import { supabase } from "@/lib/supabase";

export const revalidate = 60;

export default async function AboutPage() {
    const [{ data: boardMembers }, { data: storySection }, { data: standingSection }] =
        await Promise.all([
            supabase.from("board_members").select("*").order("display_order"),
            supabase
                .from("page_sections")
                .select("content")
                .eq("section_key", "about_story")
                .single(),
            supabase
                .from("page_sections")
                .select("content")
                .eq("section_key", "standing")
                .maybeSingle(),
        ]);

    const story = storySection?.content as { paragraphs?: string[] } | null;
    const paragraphs = story?.paragraphs ?? [
        "The Rotaract Club of Vishwahita is a community of young leaders dedicated to service, fellowship, and professional growth in Chennai.",
        "Chartered 10 March 1999 and sponsored by the Rotary Club of Madras Industrial City, we serve under RI District 3234, Group 01. Vishwahita means universal friendship.",
    ];

    const standing = (standingSection?.content ?? {
        charter: "10 March 1999",
        sponsor: "Rotary Club of Madras Industrial City",
        district: "3234",
        group: "01",
    }) as Record<string, string>;

    const fallbackBoardMembers = [
        {
            id: "fb-1",
            name: "Rtr. Shivanandhini",
            role: "Club President",
            email: "president.vishwahita@gmail.com",
            image_url: null as string | null,
        },
        {
            id: "fb-2",
            name: "Rtr. Yogi",
            role: "Club Secretary",
            email: "secretary.vishwahita@gmail.com",
            image_url: null,
        },
        {
            id: "fb-3",
            name: "Rtr. IPP. Ashwin",
            role: "Group Rotaract Representative",
            email: "grr.group1@gmail.com",
            image_url: null,
        },
    ];

    const displayBoardMembers =
        boardMembers && boardMembers.length > 0 ? boardMembers : fallbackBoardMembers;

    return (
        <div className="min-h-screen pt-24 pb-16 px-5 md:pt-32 md:pb-24 md:px-6 max-w-7xl mx-auto space-y-16 md:space-y-20">
            <section className="max-w-3xl">
                <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-text-primary tracking-tight text-balance">
                    About the club
                </h1>
                <div className="mt-8 space-y-5 text-base text-text-secondary leading-relaxed">
                    {paragraphs.map((p: string, i: number) => (
                        <p key={i}>{p}</p>
                    ))}
                </div>
            </section>

            <section aria-labelledby="standing-heading">
                <h2
                    id="standing-heading"
                    className="font-heading text-2xl md:text-3xl font-bold text-text-primary"
                >
                    Official standing
                </h2>
                <dl className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: "Chartered", value: standing.charter || "10 March 1999" },
                        { label: "Sponsor", value: standing.sponsor || "Rotary Club of Madras Industrial City" },
                        { label: "District", value: standing.district || "3234" },
                        { label: "Group", value: standing.group || "01" },
                    ].map((row) => (
                        <div
                            key={row.label}
                            className="rounded-2xl border border-white/8 bg-white/[0.03] p-5 min-w-0"
                        >
                            <dt className="font-mono text-[10px] uppercase tracking-wider text-text-secondary">
                                {row.label}
                            </dt>
                            <dd className="mt-2 font-heading font-semibold text-text-primary text-sm leading-snug">
                                {row.value}
                            </dd>
                        </div>
                    ))}
                </dl>
            </section>

            <section id="board">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-8">
                    <div>
                        <h2 className="font-heading text-2xl md:text-3xl font-bold text-text-primary">
                            Leadership
                        </h2>
                        <p className="mt-2 text-sm text-text-secondary">
                            Officers published by the board. Update any time in Admin.
                        </p>
                    </div>
                    <Link
                        href="/#join"
                        className="font-mono text-xs text-accent-gold hover:underline shrink-0"
                    >
                        Apply to join →
                    </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {displayBoardMembers.map((member: {
                        id: string;
                        name: string;
                        role: string;
                        email?: string | null;
                        image_url?: string | null;
                    }) => (
                        <div
                            key={member.id}
                            className="rounded-2xl border border-white/8 bg-white/[0.03] p-6"
                        >
                            <div className="w-full aspect-square rounded-xl bg-white/5 mb-5 overflow-hidden flex items-center justify-center border border-white/5">
                                {member.image_url ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={member.image_url}
                                        alt=""
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <User size={40} className="text-white/20" />
                                )}
                            </div>
                            <h3 className="font-heading text-lg font-bold text-text-primary">
                                {member.name}
                            </h3>
                            <p className="text-xs font-mono text-accent-gold mt-1 mb-3">
                                {member.role}
                            </p>
                            {member.email && (
                                <a
                                    href={`mailto:${member.email}`}
                                    className="inline-flex items-center gap-1.5 text-xs font-mono text-text-secondary hover:text-text-primary truncate max-w-full"
                                >
                                    <Mail size={12} className="shrink-0" />
                                    <span className="truncate">{member.email}</span>
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            <section className="rounded-2xl border border-white/8 bg-white/[0.03] p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="font-heading text-xl font-bold text-text-primary">
                        Ready to serve with us?
                    </h2>
                    <p className="mt-1 text-sm text-text-secondary">
                        Prospect applications go to the board — no account required to apply.
                    </p>
                </div>
                <Link
                    href="/#join"
                    className="inline-flex justify-center rounded-full bg-accent-cranberry text-text-primary font-bold text-sm px-6 py-3 hover:bg-[#e01872] transition-colors shrink-0"
                >
                    Apply to join
                </Link>
            </section>
        </div>
    );
}
