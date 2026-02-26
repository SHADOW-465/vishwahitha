import { Mail, Instagram, Twitter, Linkedin, MapPin, ExternalLink } from "lucide-react";
import { getPageSection } from "@/lib/actions";

export const Footer = async () => {
    const tagline = await getPageSection("footer_tagline")
        ?? "A community of young leaders taking action to build a better world. Sponsored by Rotary, driven by passion.";

    return (
        <footer className="w-full bg-primary border-t border-white/5 pt-20 pb-10 px-6 mt-32 relative overflow-hidden">


            <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                <div className="md:col-span-2 space-y-6">
                    <h2 className="font-heading text-3xl font-bold tracking-tighter text-text-primary">
                        VISHWAHITA
                    </h2>
                    <p className="font-mono text-sm text-text-secondary max-w-sm leading-relaxed">
                        {tagline}
                    </p>
                    <div className="flex items-center gap-4 text-text-secondary">
                        <a href="https://instagram.com/rotaract" target="_blank" rel="noreferrer" className="hover:text-accent-gold transition-colors p-2 bg-white/5 rounded-full hover:bg-white/10">
                            <Instagram size={20} />
                        </a>
                        <a href="https://twitter.com/rotaract" target="_blank" rel="noreferrer" className="hover:text-accent-gold transition-colors p-2 bg-white/5 rounded-full hover:bg-white/10">
                            <Twitter size={20} />
                        </a>
                        <a href="https://linkedin.com/company/rotaract" target="_blank" rel="noreferrer" className="hover:text-accent-gold transition-colors p-2 bg-white/5 rounded-full hover:bg-white/10">
                            <Linkedin size={20} />
                        </a>
                    </div>
                </div>

                <div className="space-y-6">
                    <h3 className="font-heading text-lg font-bold text-text-primary">Contact</h3>
                    <ul className="space-y-4 font-mono text-sm text-text-secondary">
                        <li className="flex items-center gap-3">
                            <Mail size={16} className="text-accent-gold" />
                            <a href="mailto:contact@vishwahitha.org" className="hover:text-white transition-colors">contact@vishwahitha.org</a>
                        </li>
                        <li className="flex items-start gap-3">
                            <MapPin size={16} className="text-accent-gold shrink-0 mt-1" />
                            <span>123 Club Venue Street,<br />Rotary District Building</span>
                        </li>
                    </ul>
                </div>

                <div className="space-y-6">
                    <h3 className="font-heading text-lg font-bold text-text-primary">Rotary International</h3>
                    <ul className="space-y-4 font-mono text-sm text-text-secondary">
                        <li>
                            <a href="https://www.rotary.org/en/get-involved/rotaract-clubs" target="_blank" rel="noreferrer" className="hover:text-accent-gold transition-colors flex items-center gap-2">
                                What is Rotaract? <ExternalLink size={14} />
                            </a>
                        </li>
                        <li>
                            <a href="https://www.rotary.org" target="_blank" rel="noreferrer" className="hover:text-accent-gold transition-colors flex items-center gap-2">
                                Sponsor Rotary Club <ExternalLink size={14} />
                            </a>
                        </li>
                        <li>
                            <span>District 3232</span>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-white/10 font-mono text-xs text-text-secondary/50">
                <p>&copy; {new Date().getFullYear()} Rotaract Club of Vishwahitha. All rights reserved.</p>
                <div className="flex items-center gap-6">
                    <a href="#" className="hover:text-text-primary transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-text-primary transition-colors">Terms of Service</a>
                </div>
            </div>
        </footer>
    );
};
