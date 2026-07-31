import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getBoardMembers } from "@/lib/actions";

const FALLBACK = [
    { id: "fb-1", name: "Rtr. Shivanandhini", role: "Club President", image_url: null as string | null },
    { id: "fb-2", name: "Rtr. Yogi", role: "Club Secretary", image_url: null },
    { id: "fb-3", name: "Rtr. IPP. Ashwin", role: "Group Rotaract Representative", image_url: null },
];

/** P1-8 — Public leadership strip */
export async function BoardStrip() {
    const members = await getBoardMembers();
    const list = members.length > 0 ? members.slice(0, 6) : FALLBACK;

    return (
        <section id="board" className="py-20 md:py-24 px-6 w-full max-w-7xl mx-auto border-t border-white/5">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
                <div>
                    <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-text-primary tracking-tight text-balance">
                        Leadership this term
                    </h2>
                </div>
                <Link
                    href="/about"
                    className="inline-flex items-center gap-1.5 font-mono text-xs text-accent-gold hover:text-accent-gold-light transition-colors"
                >
                    Full about <ArrowRight size={12} />
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {list.map((m: { id: string; name: string; role: string; image_url?: string | null }) => (
                    <div
                        key={m.id}
                        className="rounded-2xl border border-white/8 bg-white/[0.03] p-5 flex items-center gap-4 min-w-0"
                    >
                        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 shrink-0 overflow-hidden flex items-center justify-center">
                            {m.image_url ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={m.image_url} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <span className="font-heading font-bold text-accent-gold text-lg">
                                    {m.name.replace(/^Rtr\.\s*/i, "").charAt(0)}
                                </span>
                            )}
                        </div>
                        <div className="min-w-0">
                            <p className="font-heading font-bold text-text-primary truncate">{m.name}</p>
                            <p className="font-mono text-[11px] text-text-secondary mt-0.5 truncate">{m.role}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
