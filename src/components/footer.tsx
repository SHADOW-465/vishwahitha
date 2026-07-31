import { Mail, Instagram, MapPin, ExternalLink } from "lucide-react";
import { getPageSection } from "@/lib/actions";

export const Footer = async () => {
    const taglineObj = await getPageSection("footer_tagline");
    const tagline =
        taglineObj?.text ??
        "Unite for Good · Rise Above — Rotaract Club of Vishwahita, RI District 3234.";

    return (
        <footer
            id="site-footer"
            className="w-full bg-primary border-t border-white/5 pt-12 pb-8 px-5 mt-16 md:pt-20 md:pb-10 md:px-6 md:mt-24 relative overflow-hidden"
        >
            <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-12 md:mb-16">
                <div className="md:col-span-2 space-y-6">
                    <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src="/club-logo.png"
                            alt=""
                            className="w-12 h-12 object-contain bg-transparent"
                        />
                        <h2 className="font-heading text-3xl font-bold tracking-tighter text-text-primary">
                            VISHWAHITA
                        </h2>
                    </div>
                    <p className="text-sm text-text-secondary max-w-sm leading-relaxed">
                        {tagline}
                    </p>
                    <div className="flex items-center gap-4 text-text-secondary">
                        <a
                            href="https://www.instagram.com/racvishwahita/"
                            target="_blank"
                            rel="noreferrer"
                            className="hover:text-accent-gold transition-colors p-2 bg-white/5 rounded-full hover:bg-white/10"
                            aria-label="Instagram @racvishwahita"
                        >
                            <Instagram size={20} />
                        </a>
                    </div>
                </div>

                <div className="space-y-6">
                    <h3 className="font-heading text-lg font-bold text-text-primary">Contact</h3>
                    <ul className="space-y-4 font-mono text-sm text-text-secondary">
                        <li className="flex items-center gap-3">
                            <Mail size={16} className="text-accent-gold" />
                            <a
                                href="mailto:rcvishwahita@gmail.com"
                                className="hover:text-white transition-colors"
                            >
                                rcvishwahita@gmail.com
                            </a>
                        </li>
                        <li className="flex items-start gap-3">
                            <MapPin size={16} className="text-accent-gold shrink-0 mt-1" />
                            <span>Chennai · RI District 3234 · Group 01</span>
                        </li>
                        <li>
                            <a href="/contact" className="hover:text-accent-gold transition-colors">
                                Contact form →
                            </a>
                        </li>
                        <li>
                            <a href="/#join" className="hover:text-accent-gold transition-colors">
                                Apply to join →
                            </a>
                        </li>
                    </ul>
                </div>

                <div className="space-y-6">
                    <h3 className="font-heading text-lg font-bold text-text-primary">
                        Rotary International
                    </h3>
                    <ul className="space-y-4 font-mono text-sm text-text-secondary">
                        <li>
                            <a
                                href="https://www.rotary.org/en/get-involved/rotaract-clubs"
                                target="_blank"
                                rel="noreferrer"
                                className="hover:text-accent-gold transition-colors flex items-center gap-2"
                            >
                                What is Rotaract? <ExternalLink size={14} />
                            </a>
                        </li>
                        <li>
                            <span>Sponsored by Rotary Club of Madras Industrial City</span>
                        </li>
                        <li>
                            <span>District 3234 · Group 01</span>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-white/10 font-mono text-xs text-text-secondary/50">
                <p>
                    &copy; {new Date().getFullYear()} Rotaract Club of Vishwahita. All rights
                    reserved.
                </p>
                <p className="text-text-secondary/40">
                    Official digital home · RI District 3234
                </p>
            </div>
        </footer>
    );
};
