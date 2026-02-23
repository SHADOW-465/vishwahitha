"use client";

import { FileText, Download, Briefcase, FileCode } from "lucide-react";

type Document = {
    id: string;
    title: string;
    category: string;
    file_url: string;
};

const getIconForCategory = (category: string) => {
    switch (category.toLowerCase()) {
        case "governance": return <Briefcase size={18} />;
        case "resources": return <FileCode size={18} />;
        default: return <FileText size={18} />;
    }
};

export const DocumentRepository = ({ documents }: { documents: Document[] }) => {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-heading font-bold text-text-primary">Repository</h2>
                <p className="font-mono text-xs text-text-secondary mt-1">Download official club assets and documents.</p>
            </div>

            <div className="space-y-3">
                {documents.map((doc) => (
                    <div key={doc.id} className="glass-panel group flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 transition-all duration-300">
                        <div className="flex items-center gap-4">
                            <div className="bg-white/10 p-3 rounded-xl text-text-secondary group-hover:text-text-primary transition-colors">
                                {getIconForCategory(doc.category)}
                            </div>
                            <div>
                                <h4 className="font-heading font-medium text-text-primary">{doc.title}</h4>
                                <span className="text-[10px] font-mono uppercase tracking-widest text-text-secondary opacity-50">{doc.category}</span>
                            </div>
                        </div>
                        <button className="p-3 text-text-secondary hover:text-accent-gold transition-colors" title="Download">
                            <Download size={18} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};
