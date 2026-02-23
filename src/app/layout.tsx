import type { Metadata } from "next";
import localFont from "next/font/local";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const plusJakartaSans = Plus_Jakarta_Sans({
    subsets: ["latin"],
    variable: "--font-heading",
});

const jetbrainsMono = JetBrains_Mono({
    subsets: ["latin"],
    variable: "--font-mono",
});

// We would add Instrument Serif here statically or locally for drama serif
// Using standard local/google imports for now as stubs

export const metadata: Metadata = {
    title: "Rotaract Club of Vishwahita",
    description: "Community Luxe. A bridge between a high-end creative agency and a dedicated NGO.",
};

import { ClerkProvider, SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ClerkProvider>
            <html lang="en">
                <body
                    className={`${plusJakartaSans.variable} ${jetbrainsMono.variable} antialiased`}
                >
                    <header className="absolute top-4 right-6 z-[60]">
                        <SignedOut>
                            <SignInButton />
                            <SignUpButton />
                        </SignedOut>
                        <SignedIn>
                            <UserButton appearance={{ variables: { colorPrimary: '#FBD300' } }} />
                        </SignedIn>
                    </header>
                    <div className="noise-overlay" />
                    <Navbar />
                    {children}
                    <Footer />
                </body>
            </html>
        </ClerkProvider>
    );
}
