"use client";

import { useState, useMemo } from "react";
import { Filter, ArrowUpDown } from "lucide-react";

type Feedback = {
    id: string;
    created_at: string;
    member_id: string;
    content: string;
    category: string;
};

export const WeeklyPulseAggregator = ({ initialData }: { initialData: Feedback[] }) => {
    const [filter, setFilter] = useState<string>("All");
    const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

    const categories = ["All", ...Array.from(new Set(initialData.map((d) => d.category || "General")))];

    const filteredAndSortedData = useMemo(() => {
        let result = [...initialData];

        if (filter !== "All") {
            result = result.filter(item => (item.category || "General") === filter);
        }

        result.sort((a, b) => {
            const dateA = new Date(a.created_at).getTime();
            const dateB = new Date(b.created_at).getTime();
            return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
        });

        return result;
    }, [initialData, filter, sortOrder]);

    return (
        <div className="glass-panel p-8 rounded-[2rem]">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-2xl font-heading font-bold text-text-primary">Weekly Pulse Aggregator</h2>
                    <p className="font-mono text-sm text-text-secondary mt-1">Review member feedback and submissions.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <select
                            className="appearance-none bg-black/50 border border-white/10 rounded-full pl-4 pr-10 py-2 text-sm font-mono focus:outline-none focus:border-accent-gold transition-colors"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        >
                            {categories.map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                        <Filter size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" />
                    </div>

                    <button
                        onClick={() => setSortOrder(prev => prev === "desc" ? "asc" : "desc")}
                        className="bg-black/50 border border-white/10 rounded-full p-2 hover:bg-white/10 transition-colors flex items-center justify-center"
                        title="Toggle Sort Order"
                    >
                        <ArrowUpDown size={18} className="text-text-secondary" />
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-sm">
                    <thead>
                        <tr className="border-b border-white/10 text-text-secondary">
                            <th className="pb-3 font-medium px-4">Date</th>
                            <th className="pb-3 font-medium px-4">Category</th>
                            <th className="pb-3 font-medium px-4 w-1/2">Content</th>
                            <th className="pb-3 font-medium px-4 text-right">Member ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAndSortedData.length > 0 ? (
                            filteredAndSortedData.map((item) => (
                                <tr key={item.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                                    <td className="py-4 px-4 text-text-primary whitespace-nowrap">
                                        {new Date(item.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className="bg-white/10 px-3 py-1 rounded-full text-xs truncate max-w-[120px] inline-block">
                                            {item.category || "General"}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 text-text-secondary group-hover:text-text-primary transition-colors pr-8">
                                        {item.content}
                                    </td>
                                    <td className="py-4 px-4 text-right font-mono text-xs text-text-secondary/50 truncate max-w-[100px]">
                                        ...{item.member_id?.substring(item.member_id.length - 6) || "N/A"}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="text-center py-12 text-text-secondary">
                                    No feedback found matching the current filters.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
