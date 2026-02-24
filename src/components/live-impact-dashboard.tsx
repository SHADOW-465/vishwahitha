"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useSpring, motion } from "framer-motion";
import { Clock, IndianRupee, Activity } from "lucide-react";

interface ImpactStats {
    volunteerHours: number;
    fundsRaised: number;
    activeProjects: number;
}

const Counter = ({ value }: { value: number }) => {
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true, margin: "-50px" });
    const spring = useSpring(0, { stiffness: 40, damping: 15, mass: 1 });

    useEffect(() => {
        if (inView) {
            spring.set(value);
        }
    }, [inView, spring, value]);

    useEffect(() => {
        return spring.on("change", (latest) => {
            if (ref.current) {
                ref.current.textContent = Intl.NumberFormat("en-US").format(Math.floor(latest));
            }
        });
    }, [spring]);

    return <span ref={ref} className="tabular-nums">0</span>;
};

export const LiveImpactDashboard = () => {
    const [stats, setStats] = useState<ImpactStats | null>(null);

    useEffect(() => {
        // Simulate Supabase server action fetch
        const fetchStats = async () => {
            // Mocking a network delay for the server action
            await new Promise((resolve) => setTimeout(resolve, 800));
            setStats({
                volunteerHours: 12450,
                fundsRaised: 850000,
                activeProjects: 14
            });
        };
        fetchStats();
    }, []);

    return (
        <section className="relative w-full py-24 md:py-32 bg-primary overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 bg-gradient-to-b from-primary via-surface to-primary z-0" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent-gold/5 rounded-full blur-3xl z-0 pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto px-6">
                <div className="text-center mb-16 md:mb-24 space-y-4">
                    <h2 className="text-3xl md:text-5xl font-heading font-bold text-text-primary tracking-tight">
                        Our Live <span className="text-accent-gold italic font-drama drop-shadow-glow-gold">Impact</span>
                    </h2>
                    <p className="text-text-secondary font-mono max-w-2xl mx-auto">
                        Real-time metrics tracking our community service and outreach efforts across all initiatives.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                    {/* Stat Item 1 */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="flex flex-col items-center text-center p-8 rounded-3xl bg-surface border border-white/5 backdrop-blur-sm shadow-xl"
                    >
                        <div className="w-16 h-16 rounded-full bg-accent-gold/10 flex items-center justify-center mb-6 border border-accent-gold/20">
                            <Clock className="w-8 h-8 text-accent-gold" />
                        </div>
                        <h3 className="text-5xl md:text-6xl font-bold font-heading text-text-primary mb-2 flex items-center">
                            {stats ? <Counter value={stats.volunteerHours} /> : "0"}
                            <span className="text-accent-gold ml-1 text-4xl">+</span>
                        </h3>
                        <p className="text-text-secondary font-mono uppercase tracking-widest text-sm">Active Volunteer Hours</p>
                    </motion.div>

                    {/* Stat Item 2 */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="flex flex-col items-center text-center p-8 rounded-3xl bg-surface border border-white/5 backdrop-blur-sm shadow-xl relative overflow-hidden"
                    >
                        {/* Glow effect for the center stat */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-accent-cranberry/10 to-transparent opacity-50 z-0" />

                        <div className="relative z-10 flex flex-col items-center">
                            <div className="w-16 h-16 rounded-full bg-accent-cranberry/10 flex items-center justify-center mb-6 border border-accent-cranberry/20">
                                <IndianRupee className="w-8 h-8 text-accent-cranberry" />
                            </div>
                            <h3 className="text-5xl md:text-6xl font-bold font-heading text-text-primary mb-2 flex items-center">
                                {stats ? <Counter value={stats.fundsRaised} /> : "0"}
                                <span className="text-accent-cranberry ml-1 text-4xl">+</span>
                            </h3>
                            <p className="text-text-secondary font-mono uppercase tracking-widest text-sm">Funds Raised</p>
                        </div>
                    </motion.div>

                    {/* Stat Item 3 */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="flex flex-col items-center text-center p-8 rounded-3xl bg-surface border border-white/5 backdrop-blur-sm shadow-xl"
                    >
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6 border border-white/10">
                            <Activity className="w-8 h-8 text-white/60" />
                        </div>
                        <h3 className="text-5xl md:text-6xl font-bold font-heading text-text-primary mb-2 flex items-center">
                            {stats ? <Counter value={stats.activeProjects} /> : "0"}
                        </h3>
                        <p className="text-text-secondary font-mono uppercase tracking-widest text-sm">Active Projects</p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};
