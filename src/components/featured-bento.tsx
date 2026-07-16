import Link from "next/link";
import { ArrowUpRight, Image as ImageIcon } from "lucide-react";
import { getInitiatives } from "@/lib/actions";

const THEMES = ["gold", "teal", "red"] as const;

function themeClasses(theme: (typeof THEMES)[number]) {
    return {
        gold: {
            border: "hover:border-accent-gold/40",
            gradient: "from-accent-gold/20 to-transparent",
        },
        teal: {
            border: "hover:border-accent-teal/40",
            gradient: "from-accent-teal/20 to-transparent",
        },
        red: {
            border: "hover:border-accent-red/40",
            gradient: "from-accent-red/20 to-transparent",
        },
    }[theme];
}

/**
 * Signature / ongoing programmes from CMS (Admin → Initiatives).
 * President sets is_featured + hero_image_url (e.g. /indru.jpeg).
 */
export async function FeaturedBento() {
    const initiatives = await getInitiatives();
    const list = initiatives.slice(0, 6);

    return (
        <section id="initiatives" className="py-24 px-6 w-full max-w-7xl mx-auto border-t border-white/5">
            <div className="mb-12 max-w-2xl min-w-0">
                <span className="font-mono text-xs text-accent-gold uppercase tracking-[0.22em]">
                    Signature &amp; ongoing
                </span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold text-text-primary tracking-tight mt-2 text-balance">
                    Programmes the board{" "}
                    <span className="font-display-drama gold-text">runs</span>
                </h2>
                <p className="font-mono text-sm text-text-secondary mt-3 max-w-md leading-relaxed">
                    Daily series and flagship work — edited from Admin so the president can post new ones anytime.
                </p>
                <Link
                    href="/initiatives"
                    className="inline-flex items-center gap-1.5 mt-4 font-mono text-xs text-accent-gold hover:text-accent-gold-light transition-colors"
                >
                    All initiatives <ArrowUpRight size={12} />
                </Link>
            </div>

            {list.length === 0 ? (
                <div className="glass-panel rounded-2xl border border-white/5 p-10 text-center font-mono text-sm text-text-secondary">
                    No featured programmes yet. The president can add them under Admin → Initiatives.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {list.map((init: any, index: number) => {
                        const theme = THEMES[index % THEMES.length];
                        const t = themeClasses(theme);
                        const wide = index === 0 || index === 3;
                        const image =
                            init.hero_image_url ||
                            "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800";

                        return (
                            <Link
                                key={init.id || init.slug}
                                href={`/initiatives/${init.slug}`}
                                className={`group relative block overflow-hidden rounded-[2rem] glass-panel border border-white/5 transition-all duration-500 hover:shadow-2xl ${t.border} ${
                                    wide ? "md:col-span-2" : ""
                                }`}
                            >
                                <div className="absolute inset-0 z-0">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={image}
                                        alt={init.title}
                                        className="h-full w-full object-cover opacity-35 group-hover:opacity-55 transition-all duration-700"
                                    />
                                    <div
                                        className={`absolute inset-0 bg-gradient-to-t ${t.gradient} opacity-50`}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-transparent" />
                                </div>

                                <div className="relative z-10 h-full w-full p-8 flex flex-col justify-between min-h-[260px]">
                                    <div>
                                        <span className="font-mono text-[10px] uppercase tracking-widest text-text-secondary">
                                            {init.category}
                                            {(init.impact_stat || "")
                                                .toString()
                                                .toLowerCase()
                                                .includes("daily")
                                                ? " · Daily"
                                                : ""}
                                        </span>
                                        <h3 className="text-2xl sm:text-3xl font-heading font-extrabold text-text-primary mt-1 group-hover:text-accent-gold transition-colors">
                                            {init.title}
                                        </h3>
                                    </div>
                                    <div>
                                        <p className="font-mono text-xs text-text-secondary max-w-md leading-relaxed mb-6 group-hover:text-text-primary transition-colors">
                                            {init.short_description}
                                        </p>
                                        <div className="flex items-end justify-between gap-3">
                                            <div>
                                                {(init.impact_stat || init.impact_label) && (
                                                    <>
                                                        <span className="block font-heading font-extrabold text-2xl sm:text-3xl gold-text">
                                                            {init.impact_stat}
                                                        </span>
                                                        <span className="block font-mono text-[9px] uppercase tracking-wider text-text-secondary mt-1">
                                                            {init.impact_label}
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-1 font-mono text-xs text-text-primary border border-white/10 rounded-full px-4 py-2 bg-black/40 group-hover:bg-accent-gold group-hover:text-primary transition-colors duration-300 shrink-0">
                                                Explore <ArrowUpRight size={12} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}

                    <div className="relative group overflow-hidden rounded-[2rem] glass-panel border border-white/5 p-8 flex flex-col justify-between min-h-[220px] md:col-span-1 bg-gradient-to-br from-white/2 to-transparent">
                        <div className="relative z-10">
                            <span className="font-mono text-[10px] uppercase tracking-widest text-text-secondary">
                                Gallery
                            </span>
                            <h3 className="text-xl font-heading font-extrabold text-text-primary mt-1 flex items-center gap-2">
                                Photos <ImageIcon size={18} className="text-accent-gold" />
                            </h3>
                            <p className="font-mono text-xs text-text-secondary mt-3 leading-relaxed">
                                Moments from service and fellowship.
                            </p>
                            <Link
                                href="/gallery"
                                className="inline-flex mt-5 font-mono text-xs text-accent-gold border border-accent-gold/20 rounded-full px-4 py-2 hover:bg-accent-gold/10"
                            >
                                Open gallery
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
