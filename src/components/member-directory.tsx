"use client";

import { useState } from "react";
import { Search, Mail, User } from "lucide-react";

type Member = {
    id: string;
    name: string;
    role: string;
    contact: string;
};

export const MemberDirectory = ({ members }: { members: Member[] }) => {
    const [search, setSearch] = useState("");

    const filteredMembers = members.filter(m =>
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.role.toLowerCase().includes(search.toLowerCase())
    );


    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-2xl font-heading font-bold text-text-primary">Member Directory</h2>
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary h-4 w-4" />
                    <input
                        type="text"
                        placeholder="Search members..."
                        className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm font-mono text-text-primary focus:outline-none focus:border-accent-gold transition-colors"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredMembers.map((member) => (
                    <div key={member.id} className="glass-panel rounded-[2rem] p-6 group hover:border-accent-gold/20 transition-all duration-300">
                        <div className="flex items-start gap-4">
                            <div className="bg-white/10 p-3 rounded-2xl text-accent-gold group-hover:bg-accent-gold/10 transition-colors">
                                <User size={20} />
                            </div>
                            <div className="overflow-hidden">
                                <h3 className="text-lg font-heading font-bold text-text-primary truncate">{member.name}</h3>
                                <p className="text-xs font-mono text-accent-gold uppercase tracking-widest mb-3">{member.role}</p>
                                <div className="flex items-center gap-2 text-text-secondary">
                                    <Mail size={12} className="shrink-0" />
                                    <span className="text-xs font-mono truncate">{member.contact}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredMembers.length === 0 && (
                <div className="text-center py-12 text-text-secondary font-mono text-sm opacity-50">
                    No members found matching your search.
                </div>
            )}
        </div>
    );
};
