import { DonorRegistrationForm } from "@/components/blood-connect/registration-form";
import { EmergencyRequestForm } from "@/components/blood-connect/emergency-request";
import { ShortageDashboard } from "@/components/blood-connect/shortage-dashboard";
import { Droplets, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function BloodConnectPage() {
    return (
        <main className="min-h-screen pt-32 pb-24 bg-primary relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-accent-cranberry/10 rounded-[100%] blur-[120px] pointer-events-none z-0" />

            <div className="relative z-10 max-w-7xl mx-auto px-6">
                <div className="mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 text-text-secondary hover:text-white transition-colors font-mono text-sm group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Home
                    </Link>
                </div>

                <header className="text-center max-w-3xl mx-auto mb-16 md:mb-24 space-y-6">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-surface border border-white/5 backdrop-blur-md shadow-2xl mb-4 relative flex-shrink-0">
                        <div className="absolute inset-0 bg-accent-cranberry/20 rounded-3xl blur-xl" />
                        <Droplets className="w-10 h-10 text-accent-cranberry relative z-10" />
                    </div>
                    <h1 className="text-5xl md:text-7xl font-heading font-bold text-text-primary tracking-tighter leading-tight">
                        Blood <span className="text-accent-cranberry italic font-drama font-light drop-shadow-[0_0_15px_rgba(217,27,92,0.4)]">Connect</span>
                    </h1>
                    <p className="text-lg text-text-secondary font-mono">
                        A digital community service initiative dedicated to eliminating blood shortages. Register as a donor, request emergency supplies, and track real-time real-world impact.
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                    {/* Left Column: Actions */}
                    <div className="lg:col-span-7 space-y-8 flex flex-col">
                        <EmergencyRequestForm />
                        <DonorRegistrationForm />
                    </div>

                    {/* Right Column: Dashboard */}
                    <div className="lg:col-span-5 relative">
                        {/* Sticky container for larger screens */}
                        <div className="lg:sticky lg:top-32 h-full">
                            <ShortageDashboard />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
