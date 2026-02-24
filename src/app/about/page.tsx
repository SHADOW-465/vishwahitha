import { supabase } from "@/lib/supabase";
import { User } from "lucide-react";

export default async function AboutPage() {
    // Fetch live board members
    const { data: boardMembers } = await supabase
        .from("board_members")
        .select("*")
        .order("role"); // Simple order for now

    return (
        <div className="min-h-screen pt-32 pb-24 px-6 max-w-7xl mx-auto space-y-24">

            {/* Mission Section */}
            <section className="glass-panel rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden">

                <h1 className="font-heading text-4xl md:text-5xl font-bold text-text-primary mb-6">
                    Our <span className="text-accent-gold italic font-drama font-light">Story</span>
                </h1>
                <div className="space-y-6 max-w-3xl font-mono text-text-secondary leading-relaxed">
                    <p>
                        The Rotaract Club of Vishwahitha is a community-based organization dedicated to fostering leadership, professional development, and impactful service projects. Sponsored by Rotary International, we bring together young adults to exchange ideas with leaders in the community and develop leadership and professional skills.
                    </p>
                    <p>
                        We operate under the guiding principles of "Service Above Self", executing high-quality, sustainable programs that address local needs while building a network of global citizens. Our approach combines the execution standard of a premium enterprise with the heart of a grassroots NGO.
                    </p>
                </div>
            </section>

            {/* Board Members Section */}
            <section>
                <div className="mb-12">
                    <h2 className="font-heading text-3xl font-bold text-text-primary">
                        Leadership <span className="text-accent-gold italic font-drama font-light">Board</span>
                    </h2>
                    <p className="font-mono text-sm text-text-secondary mt-2">The dedicated team driving Vishwahitha forward.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {boardMembers && boardMembers.length > 0 ? (
                        boardMembers.map((member) => (
                            <div key={member.id} className="glass-panel p-6 rounded-[2rem] group hover:border-accent-gold/30 transition-all duration-300">
                                <div className="w-full aspect-square rounded-2xl bg-white/5 mb-6 overflow-hidden flex items-center justify-center border border-white/5 group-hover:bg-accent-gold/5 transition-colors">
                                    {member.image_url ? (
                                        <img src={member.image_url} alt={member.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <User size={48} className="text-white/20" />
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-heading text-lg font-bold text-text-primary">{member.name}</h3>
                                    <p className="text-xs font-mono text-accent-gold uppercase tracking-widest mt-1 mb-3">{member.role}</p>
                                    {member.email && (
                                        <p className="text-xs font-mono text-text-secondary truncate">{member.email}</p>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-12 text-center text-text-secondary font-mono text-sm glass-panel rounded-[2rem]">
                            Board members for the current year will be updated soon.
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
