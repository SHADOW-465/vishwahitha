"use client";

import { FileText, Download, Briefcase, FileCode } from "lucide-react";

const documents = [
    { id: "1", title: "Club Bylaws 2025", category: "Governance", icon: <Briefcase size={18} /> },
    { id: "2", title: "Q3 Meeting Minutes", category: "Records", icon: <FileText size={18} /> },
    { id: "3", title: "GRM Official PPT", category: "Resources", icon: <FileCode size={18} /> },
];

export const DocumentRepository = () => {
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
                                {doc.icon}
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
