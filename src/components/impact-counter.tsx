"use client";

import { useEffect, useRef } from "react";
import { useInView, animate } from "framer-motion";

interface Props { value: string; label: string }

export const ImpactCounter = ({ value, label }: Props) => {
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true });
    const numericValue = parseInt(value.replace(/\D/g, ""), 10);
    const suffix = value.replace(/[0-9]/g, "");

    useEffect(() => {
        if (!isInView || !ref.current || isNaN(numericValue)) return;

        const node = ref.current;
        const controls = animate(0, numericValue, {
            duration: 2,
            ease: "easeOut",
            onUpdate(val) {
                node.textContent = Math.round(val) + suffix;
            },
        });

        return () => controls.stop();
    }, [isInView, numericValue, suffix]);

    return (
        <div className="text-center">
            <p className="font-heading text-4xl md:text-5xl font-bold gold-text">
                <span ref={ref}>0{suffix}</span>
            </p>
            <p className="font-mono text-xs text-text-secondary uppercase tracking-widest mt-2">{label}</p>
        </div>
    );
};
