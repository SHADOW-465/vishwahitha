"use client";

import { usePathname } from "next/navigation";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

export const AuthHeader = () => {
    const pathname = usePathname();
    const isAuthPage = pathname?.startsWith("/sign-in") || pathname?.startsWith("/sign-up");

    if (isAuthPage) return null;

    return (
        <header className="absolute top-4 right-6 z-[60]">
            <SignedOut>
                <div className="flex gap-4">
                    <SignInButton mode="modal">
                        <button className="text-sm font-mono text-text-secondary hover:text-accent-gold transition-colors">
                            Sign in
                        </button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                        <button className="text-sm font-mono text-text-secondary hover:text-accent-gold transition-colors">
                            Sign up
                        </button>
                    </SignUpButton>
                </div>
            </SignedOut>
            <SignedIn>
                <UserButton appearance={{ variables: { colorPrimary: '#FBD300' } }} />
            </SignedIn>
        </header>
    );
};
