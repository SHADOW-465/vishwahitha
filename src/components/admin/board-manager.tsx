"use client";

import { useState } from "react";
import { CMSDrawer } from "./cms-drawer";
import { createBoardMember, deleteBoardMember } from "@/lib/server-actions";
import { Plus, Trash2, User } from "lucide-react";
import toast from "react-hot-toast";

interface Props { members: any[] }

export const BoardManager = ({ members: initial }: Props) => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        const res = await createBoardMember(new FormData(e.currentTarget));
        setLoading(false);
        if (res.success) {
            toast.success(res.message);
            setDrawerOpen(false);
        } else {
            toast.error(res.message);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm("Delete board member?")) return;
        const res = await deleteBoardMember(id);
        if (res.success) toast.success(res.message);
        else toast.error(res.message);
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="font-heading text-2xl font-bold text-text-primary">Board Members</h2>
                <button onClick={() => setDrawerOpen(true)} className="flex items-center gap-2 bg-gradient-to-r from-accent-gold to-accent-gold-light text-primary font-bold text-sm px-5 py-2.5 rounded-full hover:scale-[1.03] transition-transform">
                    <Plus size={16} /> Add Member
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {initial.map((m) => (
                    <div key={m.id} className="glass-panel rounded-2xl p-5 flex items-center gap-4 group">
                        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center overflow-hidden flex-shrink-0">
                            {m.image_url ? <img src={m.image_url} alt={m.name} className="w-full h-full object-cover" /> : <User size={20} className="text-white/20" />}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-heading font-bold text-text-primary truncate">{m.name}</p>
                            <p className="font-mono text-xs text-accent-gold">{m.role}</p>
                        </div>
                        <button onClick={() => handleDelete(m.id)} className="p-2 rounded-xl bg-accent-red/10 text-accent-red opacity-0 group-hover:opacity-100 transition-all">
                            <Trash2 size={14} />
                        </button>
                    </div>
                ))}
            </div>

            <CMSDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title="Add Board Member">
                <form onSubmit={handleCreate} className="space-y-5">
                    {[
                        { name: "name", label: "Full Name", required: true },
                        { name: "role", label: "Role / Position", required: true },
                        { name: "email", label: "Email" },
                        { name: "image_url", label: "Profile Photo URL" },
                    ].map((f) => (
                        <div key={f.name}>
                            <label className="block font-mono text-xs text-text-secondary mb-2 uppercase tracking-widest">{f.label}</label>
                            <input name={f.name} required={f.required} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-text-primary focus:outline-none focus:border-accent-gold" />
                        </div>
                    ))}
                    <button type="submit" disabled={loading} className="w-full py-3.5 bg-gradient-to-r from-accent-gold to-accent-gold-light text-primary font-bold rounded-full disabled:opacity-50">
                        {loading ? "Adding..." : "Add to Board"}
                    </button>
                </form>
            </CMSDrawer>
        </div>
    );
};
