import { supabase } from "@/lib/supabase";
import { User, Users, Award, TrendingUp, Target, Calendar } from "lucide-react";

export const revalidate = 60;

export default async function AboutPage() {
    const [{ data: boardMembers }, { data: storySection }] = await Promise.all([
        supabase.from("board_members").select("*").order("display_order"),
        supabase.from("page_sections").select("content").eq("section_key", "about_story").single(),
    ]);

    const story = storySection?.content as { paragraphs?: string[] } | null;
    const paragraphs = story?.paragraphs ?? [
        "The Rotaract Club of Vishwahitha is a community-based organization dedicated to fostering leadership, professional development, and impactful service projects.",
        "Sponsored by Rotary Club of Madras Industrial City, we operate under the guiding principle of Service Above Self — executing high-quality, sustainable programs that address local needs while building a network of global citizens.",
    ];

    const fallbackBoardMembers = [
        {
            id: "fb-1",
            name: "Rtr. Mahalakshmi",
            role: "Club President",
            email: "president.vishwahita@gmail.com",
            image_url: null,
        },
        {
            id: "fb-2",
            name: "Rtr. Nandhini",
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
        }
    ];

    const displayBoardMembers = boardMembers && boardMembers.length > 0 ? boardMembers : fallbackBoardMembers;

    return (
        <div className="min-h-screen pt-24 pb-16 px-5 md:pt-32 md:pb-24 md:px-6 max-w-7xl mx-auto space-y-16 md:space-y-24">
            {/* Story Section */}
            <section className="glass-panel rounded-[2rem] md:rounded-[2.5rem] p-5 sm:p-8 md:p-16 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 md:w-64 md:h-64 rounded-full bg-accent-gold/5 blur-[80px]" />
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent-gold mb-4">Who We Are</p>
                <h1 className="font-heading text-4xl md:text-6xl font-bold text-text-primary mb-8">
                    Our <span className="font-drama italic gold-text font-light">Story</span>
                </h1>
                <div className="space-y-6 max-w-3xl font-mono text-text-secondary leading-relaxed">
                    {paragraphs.map((p: string, i: number) => <p key={i}>{p}</p>)}
                </div>
            </section>

            {/* Demographics / Stats Section */}
            <section className="space-y-8">
                <div>
                    <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent-gold mb-3">Club Metrics</p>
                    <h2 className="font-heading text-3xl font-bold text-text-primary">
                        Club <span className="font-drama italic gold-text font-light">Demographics</span> & Profile
                    </h2>
                    <p className="font-mono text-xs text-text-secondary mt-2">A data-driven breakdown of our active leadership profile in District 3234 Group 01.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Stat Card 1: Active Membership */}
                    <div className="glass-panel p-8 rounded-[2rem] border border-white/5 relative overflow-hidden bg-black/10 flex flex-col justify-between h-[280px]">
                        <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full bg-accent-teal/5 blur-[30px]" />
                        <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
                            <h3 className="font-heading text-lg font-bold text-text-primary">Active Profile</h3>
                            <Users size={20} className="text-accent-teal" />
                        </div>
                        <div className="space-y-3 font-mono text-xs text-text-secondary flex-grow flex flex-col justify-center">
                            <div className="flex justify-between border-b border-white/5 pb-1">
                                <span>Total Members:</span>
                                <span className="text-text-primary font-bold">35 Leaders</span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-1">
                                <span>Gender Profile:</span>
                                <span className="text-text-primary font-bold">15 Female / 20 Male</span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-1">
                                <span>Retention Rate:</span>
                                <span className="text-text-primary font-bold">85%</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Age Profile:</span>
                                <span className="text-text-primary font-bold">20–35 Years</span>
                            </div>
                        </div>
                    </div>

                    {/* Stat Card 2: Professional Profile */}
                    <div className="glass-panel p-8 rounded-[2rem] border border-white/5 relative overflow-hidden bg-black/10 flex flex-col justify-between h-[280px]">
                        <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full bg-accent-gold/5 blur-[30px]" />
                        <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
                            <h3 className="font-heading text-lg font-bold text-text-primary">Professional Split</h3>
                            <TrendingUp size={20} className="text-accent-gold" />
                        </div>
                        <div className="space-y-3 font-mono text-xs text-text-secondary flex-grow flex flex-col justify-center">
                            <div className="flex justify-between border-b border-white/5 pb-1">
                                <span>IT & Tech:</span>
                                <span className="text-text-primary font-bold">25%</span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-1">
                                <span>Media & Events:</span>
                                <span className="text-text-primary font-bold">25%</span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-1">
                                <span>Business:</span>
                                <span className="text-text-primary font-bold">25%</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Students:</span>
                                <span className="text-text-primary font-bold">25%</span>
                            </div>
                        </div>
                    </div>

                    {/* Stat Card 3: Membership Growth */}
                    <div className="glass-panel p-8 rounded-[2rem] border border-white/5 relative overflow-hidden bg-black/10 flex flex-col justify-between h-[280px]">
                        <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full bg-accent-red/5 blur-[30px]" />
                        <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
                            <h3 className="font-heading text-lg font-bold text-text-primary">Growth & Foundation</h3>
                            <Award size={20} className="text-accent-red" />
                        </div>
                        <div className="space-y-3 font-mono text-xs text-text-secondary flex-grow flex flex-col justify-center">
                            <div className="flex justify-between border-b border-white/5 pb-1">
                                <span>Term 2023:</span>
                                <span className="text-text-primary font-bold">~22 Members</span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-1">
                                <span>Term 2024:</span>
                                <span className="text-text-primary font-bold">25 Members</span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-1">
                                <span>Term 2025:</span>
                                <span className="text-text-primary font-bold text-accent-gold">35 Members</span>
                            </div>
                            <div className="flex justify-between">
                                <span>TRF Contribution Target:</span>
                                <span className="text-text-primary font-bold">$100 minimum</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Leadership Section */}
            <section id="board">
                <div className="mb-12">
                    <h2 className="font-heading text-3xl font-bold text-text-primary">
                        Leadership <span className="font-display-drama gold-text font-light">Board</span>
                    </h2>
                    <p className="font-mono text-xs text-text-secondary mt-2">The dedicated team driving Vishwahita forward.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                    {displayBoardMembers.map((member: any) => (
                        <div key={member.id} className="glass-panel p-6 rounded-[2rem] group hover:border-accent-gold/30 transition-all duration-300 bg-black/10">
                            <div className="w-full aspect-square rounded-2xl bg-white/5 mb-6 overflow-hidden flex items-center justify-center border border-white/5 group-hover:bg-accent-gold/5 transition-colors">
                                {member.image_url
                                    ? <img src={member.image_url} alt={member.name} className="w-full h-full object-cover" />
                                    : <User size={48} className="text-white/20" />}
                            </div>
                            <h3 className="font-heading text-lg font-bold text-text-primary">{member.name}</h3>
                            <p className="text-[10px] font-mono gold-text uppercase tracking-widest mt-1 mb-3">{member.role}</p>
                            {member.email && <p className="text-xs font-mono text-text-secondary truncate">{member.email}</p>}
                        </div>
                    ))}
                </div>
            </section>

            {/* Roadmap & Priorities */}
            <section className="space-y-8 border-t border-white/5 pt-16">
                <div>
                    <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent-gold mb-3">Future Roadmap</p>
                    <h2 className="font-heading text-3xl font-bold text-text-primary">
                        Strategic Priorities <span className="font-drama italic gold-text font-light"> & Actions</span>
                    </h2>
                    <p className="font-mono text-xs text-text-secondary mt-2">Proposed action plan and strategic milestones for the remainder of the 2025-2026 term.</p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Timeline (Proposed Projects) - 7 cols */}
                    <div className="lg:col-span-7 glass-panel p-8 rounded-[2rem] border border-white/5 bg-black/10 space-y-6">
                        <h3 className="font-heading text-xl font-bold text-text-primary border-b border-white/5 pb-4 flex items-center gap-2">
                            <Calendar size={18} className="text-accent-gold" /> Term Milestones
                        </h3>
                        <div className="space-y-4 font-mono text-xs text-text-secondary">
                            {[
                                { month: "Jan 2026", actions: ["Vawez Initiative", "Bundle of Joy Project"] },
                                { month: "Feb 2026", actions: ["Meet & Greet Assembly", "Vaanangal Service Run"] },
                                { month: "Mar 2026", actions: ["27th Charter Day Celebration", "Visil Signature Project"] },
                                { month: "Apr 2026", actions: ["Study Abroad Workshop", "Meet & Greet Networking"] },
                                { month: "May 2026", actions: ["Lake Restoration Environmental Drive"] },
                                { month: "Jun 2026", actions: ["Year-End Review Meet", "DRR Visit"] }
                            ].map((item, idx) => (
                                <div key={idx} className="flex gap-4 items-start border-b border-white/5 last:border-b-0 pb-3 last:pb-0">
                                    <span className="text-accent-gold font-bold w-24 shrink-0">{item.month}</span>
                                    <div className="flex flex-wrap gap-1.5">
                                        {item.actions.map((act, aIdx) => (
                                            <span key={aIdx} className="bg-white/5 border border-white/5 px-2 py-0.5 rounded text-[10px]">
                                                {act}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Key Strategic Goals - 5 cols */}
                    <div className="lg:col-span-5 glass-panel p-8 rounded-[2rem] border border-white/5 bg-black/10 flex flex-col justify-between h-full min-h-[350px]">
                        <div>
                            <h3 className="font-heading text-xl font-bold text-text-primary border-b border-white/5 pb-4 mb-6 flex items-center gap-2">
                                <Target size={18} className="text-accent-teal" /> Key Term Goals
                            </h3>
                            <ul className="space-y-4 font-mono text-xs text-text-secondary">
                                <li className="flex items-start gap-3">
                                    <span className="text-accent-teal font-bold bg-accent-teal/10 border border-accent-teal/20 px-1.5 py-0.5 rounded text-[9px]">GOAL 1</span>
                                    <span>Scale the club's active social media audience to more than 1,000+ followers.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-accent-gold font-bold bg-accent-gold/10 border border-accent-gold/20 px-1.5 py-0.5 rounded text-[9px]">GOAL 2</span>
                                    <span>Double the current total active membership base (2X Growth).</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-accent-red font-bold bg-accent-red/10 border border-accent-red/20 px-1.5 py-0.5 rounded text-[9px]">GOAL 3</span>
                                    <span>Execute structured projects to directly impact 1,000+ beneficiaries.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-text-primary font-bold bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-[9px]">GOAL 4</span>
                                    <span>Deliver leadership election announcement on or before Charter Day.</span>
                                </li>
                            </ul>
                        </div>
                        
                        <div className="border-t border-white/5 pt-6 mt-8 font-mono text-[10px] text-text-secondary flex justify-between items-center">
                            <span>Status: Operational</span>
                            <span className="flex items-center gap-1">
                                <span className="h-1.5 w-1.5 rounded-full bg-accent-teal animate-pulse" /> Active
                            </span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
