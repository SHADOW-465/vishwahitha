import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ClerkProvider } from "@clerk/nextjs";
import { BackgroundWrapper } from "@/components/ui/background-wrapper";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "react-hot-toast";

const plusJakartaSans = Plus_Jakarta_Sans({
    subsets: ["latin"],
    variable: "--font-heading",
    weight: ["400", "500", "600", "700", "800"],
});

const cormorantGaramond = Cormorant_Garamond({
    subsets: ["latin"],
    variable: "--font-drama",
    weight: ["300", "400", "600"],
    style: ["normal", "italic"],
});

const jetbrainsMono = JetBrains_Mono({
    subsets: ["latin"],
    variable: "--font-mono",
    weight: ["400", "500"],
});

export const metadata: Metadata = {
    title: "Rotaract Club of Vishwahita",
    description: "Community Luxe. A bridge between a high-end creative agency and a dedicated NGO.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <ClerkProvider>
            <html lang="en">
                <body className={`${plusJakartaSans.variable} ${cormorantGaramond.variable} ${jetbrainsMono.variable} antialiased`}>
                    <ThemeProvider>
                        <BackgroundWrapper />
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
