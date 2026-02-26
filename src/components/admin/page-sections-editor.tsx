"use client";

import { useState } from "react";
import { updatePageSection } from "@/lib/server-actions";
import { Save } from "lucide-react";
import toast from "react-hot-toast";

interface Props { sections: Record<string, any> }

const SECTION_DEFS = [
    { key: "hero_headline", label: "Hero Headline", fields: [{ name: "line1", label: "Line 1" }, { name: "line2", label: "Line 2 (gold drama serif)" }] },
    { key: "hero_subtext", label: "Hero Subtext", fields: [{ name: "text", label: "Paragraph" }] },
    { key: "about_story", label: "About — Story", fields: [{ name: "paragraphs[0]", label: "Paragraph 1" }, { name: "paragraphs[1]", label: "Paragraph 2" }] },
    { key: "footer_tagline", label: "Footer Tagline", fields: [{ name: "text", label: "Tagline text" }] },
];

export const PageSectionsEditor = ({ sections }: Props) => {
    const [saving, setSaving] = useState<string | null>(null);
    const [values, setValues] = useState<Record<string, Record<string, string>>>(
        Object.fromEntries(SECTION_DEFS.map((s) => [s.key, sections[s.key]?.content || {}]))
    );

    async function handleSave(sectionKey: string) {
        setSaving(sectionKey);
        const res = await updatePageSection(sectionKey, values[sectionKey]);
        setSaving(null);
        if (res.success) toast.success(res.message);
        else toast.error(res.message);
    }

    return (
        <div className="space-y-8">
            <h2 className="font-heading text-2xl font-bold text-text-primary">Page Sections</h2>
            {SECTION_DEFS.map((section) => (
                <div key={section.key} className="glass-panel rounded-2xl p-6 space-y-4">
                    <h3 className="font-mono text-sm text-accent-gold uppercase tracking-widest">{section.label}</h3>
                    {section.fields.map((field) => (
                        <div key={field.name}>
                            <label className="block font-mono text-xs text-text-secondary mb-2">{field.label}</label>
                            <textarea
                                value={values[section.key]?.[field.name.replace(/\[\d+\]/, "")] || ""}
                                onChange={(e) => setValues(prev => ({
                                    ...prev,
                                    [section.key]: { ...prev[section.key], [field.name.replace(/\[\d+\]/, "")]: e.target.value }
                                }))}
                                rows={2}
                                className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-text-primary focus:outline-none focus:border-accent-gold resize-none font-mono text-sm"
                            />
                        </div>
                    ))}
                    <button
                        onClick={() => handleSave(section.key)}
                        disabled={saving === section.key}
                        className="flex items-center gap-2 font-mono text-sm border border-accent-gold/30 text-accent-gold rounded-full px-5 py-2 hover:bg-accent-gold/10 transition-colors disabled:opacity-50"
                    >
                        <Save size={14} />
                        {saving === section.key ? "Saving..." : "Save Section"}
                    </button>
                </div>
            ))}
        </div>
    );
};
