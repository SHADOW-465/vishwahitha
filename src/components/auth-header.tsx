"use client";

import { usePathname } from "next/navigation";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { LogOut, UserPlus } from "lucide-react";

export const AuthHeader = () => {
    const pathname = usePathname();
    const isAuthPage = pathname?.startsWith("/sign-in") || pathname?.startsWith("/sign-up");

    if (isAuthPage) return null;

    return (
        <header className="absolute top-4 right-6 z-[60]">
            <SignedOut>
                <div className="flex gap-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-full p-2">
                    <SignInButton mode="modal">
                        <button className="flex items-center justify-center p-2 rounded-full text-text-secondary hover:text-accent-gold hover:bg-white/10 transition-all rounded-full group" title="Sign In">
                            <LogOut size={16} className="rotate-180 group-hover:scale-110 transition-transform" />
                        </button>
                    </SignInButton>
                    <div className="w-[1px] h-6 bg-white/10 self-center" />
                    <SignUpButton mode="modal">
                        <button className="flex items-center justify-center p-2 rounded-full text-text-secondary hover:text-accent-gold hover:bg-white/10 transition-all rounded-full group" title="Sign Up">
                            <UserPlus size={16} className="group-hover:scale-110 transition-transform" />
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
