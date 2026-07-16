"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
    { href: "/member", label: "Home", exact: true },
    { href: "/member/events", label: "Events" },
    { href: "/member/participate", label: "Participate" },
    { href: "/member/learn", label: "Learn" },
    { href: "/member/ops", label: "Ops" },
];

export function MemberNav() {
    const pathname = usePathname();

    return (
        <nav className="flex gap-1 overflow-x-auto pb-1 mb-8 -mx-1 px-1">
            {LINKS.map((link) => {
                const active = link.exact
                    ? pathname === link.href
                    : pathname === link.href || pathname.startsWith(link.href + "/");
                return (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`shrink-0 font-mono text-xs px-4 py-2 rounded-full border transition-colors ${
                            active
                                ? "border-accent-gold/40 bg-accent-gold/10 text-accent-gold"
                                : "border-white/10 text-text-secondary hover:text-text-primary"
                        }`}
                    >
                        {link.label}
                    </Link>
                );
            })}
        </nav>
    );
}
