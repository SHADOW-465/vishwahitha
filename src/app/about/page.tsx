import { supabase } from "@/lib/supabase";
import { User } from "lucide-react";

export const revalidate = 60;

export default async function AboutPage() {
    const [{ data: boardMembers }, { data: storySection }] = await Promise.all([
        supabase.from("board_members").select("*").order("display_order"),
        supabase.from("page_sections").select("content").eq("section_key", "about_story").single(),
    ]);

    const story = storySection?.content as { paragraphs?: string[] } | null;
    const paragraphs = story?.paragraphs ?? [
        "The Rotaract Club of Vishwahitha is a community-based organization dedicated to fostering leadership, professional development, and impactful service projects.",
        "Sponsored by Rotary International, we operate under the guiding principle of Service Above Self — executing high-quality, sustainable programs that address local needs while building a network of global citizens.",
    ];

    return (
        <div className="min-h-screen pt-32 pb-24 px-6 max-w-7xl mx-auto space-y-24">
            <section className="glass-panel rounded-[2.5rem] p-8 md:p-16 relative overflow-hidden">
                <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-accent-gold/5 blur-[80px]" />
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent-gold mb-4">Who We Are</p>
                <h1 className="font-heading text-4xl md:text-6xl font-bold text-text-primary mb-8">
                    Our <span className="font-drama italic gold-text font-light">Story</span>
                </h1>
                <div className="space-y-6 max-w-3xl font-mono text-text-secondary leading-relaxed">
                    {paragraphs.map((p: string, i: number) => <p key={i}>{p}</p>)}
                </div>
            </section>

            <section>
                <div className="mb-12">
                    <h2 className="font-heading text-3xl font-bold text-text-primary">
                        Leadership <span className="font-drama italic gold-text font-light">Board</span>
                    </h2>
                    <p className="font-mono text-sm text-text-secondary mt-2">The dedicated team driving Vishwahita forward.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {boardMembers && boardMembers.length > 0 ? (
                        boardMembers.map((member: any) => (
                            <div key={member.id} className="glass-panel p-6 rounded-[2rem] group hover:border-accent-gold/30 transition-all duration-300">
                                <div className="w-full aspect-square rounded-2xl bg-white/5 mb-6 overflow-hidden flex items-center justify-center border border-white/5 group-hover:bg-accent-gold/5 transition-colors">
                                    {member.image_url
                                        ? <img src={member.image_url} alt={member.name} className="w-full h-full object-cover" />
                                        : <User size={48} className="text-white/20" />}
                                </div>
                                <h3 className="font-heading text-lg font-bold text-text-primary">{member.name}</h3>
                                <p className="text-xs font-mono gold-text uppercase tracking-widest mt-1 mb-3">{member.role}</p>
                                {member.email && <p className="text-xs font-mono text-text-secondary truncate">{member.email}</p>}
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-12 text-center text-text-secondary font-mono text-sm glass-panel rounded-[2rem]">
                            Board members for this year will be updated soon.
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
