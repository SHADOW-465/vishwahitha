"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/components/theme-provider";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ThemedSectionProps {
    theme: "dark" | "light";
    children: React.ReactNode;
    className?: string;
    id?: string;
}

export const ThemedSection = ({ theme, children, className = "", id }: ThemedSectionProps) => {
    const ref = useRef<HTMLElement>(null);
    const { setTheme } = useTheme();

    useEffect(() => {
        if (!ref.current) return;

        const trigger = ScrollTrigger.create({
            trigger: ref.current,
            start: "top 60%",
            end: "bottom 40%",
            onEnter: () => setTheme(theme),
            onEnterBack: () => setTheme(theme),
        });

        return () => trigger.kill();
    }, [theme, setTheme]);

    return (
        <section ref={ref} id={id} className={className}>
            {children}
        </section>
    );
};
