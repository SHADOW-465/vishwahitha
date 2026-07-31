import Link from "next/link";
import { Mail, MapPin } from "lucide-react";
import { ContactForm } from "@/components/contact-form";

export const revalidate = 60;

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-primary pt-28 md:pt-32 pb-20 px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
                <div className="lg:col-span-5 space-y-8 min-w-0">
                    <div>
                        <h1 className="font-heading font-extrabold text-4xl sm:text-5xl text-text-primary tracking-tight text-balance">
                            Contact
                        </h1>
                        <p className="mt-3 text-sm text-text-secondary leading-relaxed">
                            Rotaract Club of Vishwahita · RI District 3234 · Chennai.
                            Sponsored by the Rotary Club of Madras Industrial City.
                        </p>
                    </div>

                    <ul className="space-y-4 font-mono text-sm text-text-secondary">
                        <li className="flex items-center gap-3">
                            <Mail size={16} className="text-accent-gold shrink-0" />
                            <a
                                href="mailto:rcvishwahita@gmail.com"
                                className="hover:text-text-primary transition-colors break-all"
                            >
                                rcvishwahita@gmail.com
                            </a>
                        </li>
                        <li className="flex items-start gap-3">
                            <MapPin size={16} className="text-accent-gold shrink-0 mt-0.5" />
                            <span>Chennai · District 3234 · Group 01</span>
                        </li>
                    </ul>

                    <p className="font-mono text-xs text-text-secondary leading-relaxed">
                        Want to join? Use the{" "}
                        <Link href="/#join" className="text-accent-gold hover:underline">
                            membership form on the home page
                        </Link>
                        .
                    </p>
                </div>

                <div className="lg:col-span-7 rounded-[2rem] border border-white/8 bg-white/[0.03] p-6 sm:p-8 min-w-0">
                    <h2 className="font-heading font-bold text-xl text-text-primary mb-6">
                        Send a message
                    </h2>
                    <ContactForm />
                </div>
            </div>
        </main>
    );
}
