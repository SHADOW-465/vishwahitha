import type { Metadata } from "next";
import { Inter, Playfair_Display, JetBrains_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ClubLogoWatermark } from "@/components/club-logo";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "react-hot-toast";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-heading",
    weight: ["300", "400", "500", "600", "700", "800"],
});

const playfairDisplay = Playfair_Display({
    subsets: ["latin"],
    variable: "--font-drama",
    weight: ["400", "500", "600", "700"],
    style: ["normal", "italic"],
});

const instrumentSerif = Instrument_Serif({
    subsets: ["latin"],
    variable: "--font-serif-italic",
    weight: ["400"],
    style: ["italic"],
});

const jetbrainsMono = JetBrains_Mono({
    subsets: ["latin"],
    variable: "--font-mono",
    weight: ["400", "500"],
});

export const metadata: Metadata = {
    title: "Rotaract Club of Vishwahita | Youth Leadership, Chennai",
    description: "Chartered in 1999, Rotaract Club of Vishwahita has delivered 500+ projects reaching 2,000+ people across District 3234. Chennai's youth-led service club.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <ClerkProvider>
            <html lang="en">
                <body className={`${inter.variable} ${playfairDisplay.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} antialiased`}>
                    <ThemeProvider>
                        {/* Solid paper + dim official mark (not particles) */}
                        <div
                            className="fixed inset-0 -z-50 pointer-events-none bg-primary"
                            aria-hidden
                        />
                        <ClubLogoWatermark />
                        <Navbar />
                        {children}
                        <Toaster position="bottom-right" toastOptions={{ style: { background: '#111', color: '#fff', border: '1px solid #333' } }} />
                        <Footer />
                    </ThemeProvider>
                </body>
            </html>
        </ClerkProvider>
    );
}
