"use client";

import { useState } from "react";
import { CMSDrawer } from "./cms-drawer";
import { createAnnouncement, deleteAnnouncement, toggleAnnouncementPin } from "@/lib/server-actions";
import { Plus, Pin, Trash2 } from "lucide-react";
import { AnnouncementCard } from "@/components/announcement-card";
import toast from "react-hot-toast";

interface Props { announcements: any[] }

export const AnnouncementManager = ({ announcements: initial }: Props) => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        const fd = new FormData(e.currentTarget);
        const res = await createAnnouncement(fd);
        setLoading(false);
        if (res.success) {
            toast.success(res.message);
            setDrawerOpen(false);
        } else {
            toast.error(res.message);
        }
    }

    async function handleTogglePin(id: string, currentPin: boolean) {
        const res = await toggleAnnouncementPin(id, currentPin);
        if (res.success) toast.success(res.message);
        else toast.error(res.message);
    }

    async function handleDelete(id: string) {
        if (!confirm("Delete announcement?")) return;
        const res = await deleteAnnouncement(id);
        if (res.success) toast.success(res.message);
        else toast.error(res.message);
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="font-heading text-2xl font-bold text-text-primary">Announcements</h2>
                    <p className="font-mono text-xs text-text-secondary mt-1">{initial.length} total</p>
                </div>
                <button
                    onClick={() => setDrawerOpen(true)}
                    className="flex items-center gap-2 bg-gradient-to-r from-accent-gold to-accent-gold-light text-primary font-bold text-sm px-5 py-2.5 rounded-full hover:scale-[1.03] transition-transform"
                >
                    <Plus size={16} /> New Post
                </button>
            </div>

            <div className="space-y-4">
                {initial.map((a) => (
                    <div key={a.id} className="relative group">
                        <AnnouncementCard announcement={a} index={0} />
                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => handleTogglePin(a.id, a.is_pinned)}
                                className={`p-2 rounded-xl transition-colors ${a.is_pinned ? "bg-accent-gold/20 text-accent-gold" : "bg-white/5 text-text-secondary hover:text-accent-gold"}`}
                            >
                                <Pin size={14} />
                            </button>
                            <button
                                onClick={() => handleDelete(a.id)}
                                className="p-2 rounded-xl bg-accent-red/10 text-accent-red hover:bg-accent-red/20 transition-colors"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <CMSDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title="New Announcement">
                <form onSubmit={handleCreate} className="space-y-5">
                    <div>
                        <label className="block font-mono text-xs text-text-secondary mb-2 uppercase tracking-widest">Title</label>
                        <input name="title" required className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-text-primary focus:outline-none focus:border-accent-gold" />
                    </div>
                    <div>
                        <label className="block font-mono text-xs text-text-secondary mb-2 uppercase tracking-widest">Content</label>
                        <textarea name="content" required rows={5} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-text-primary focus:outline-none focus:border-accent-gold resize-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block font-mono text-xs text-text-secondary mb-2 uppercase tracking-widest">Tag</label>
                            <select name="tag" className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-text-primary focus:outline-none focus:border-accent-gold">
                                <option value="general">General</option>
                                <option value="event">Event</option>
                                <option value="update">Update</option>
                                <option value="urgent">Urgent</option>
                            </select>
                        </div>
                        <div>
                            <label className="block font-mono text-xs text-text-secondary mb-2 uppercase tracking-widest">Visibility</label>
                            <select name="visibility" className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-text-primary focus:outline-none focus:border-accent-gold">
                                <option value="public">Public</option>
                                <option value="members">Members Only</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <input type="checkbox" name="is_pinned" value="true" id="is_pinned" className="accent-accent-gold" />
                        <label htmlFor="is_pinned" className="font-mono text-sm text-text-secondary">Pin to top</label>
                    </div>
                    <button type="submit" disabled={loading} className="w-full py-3.5 bg-gradient-to-r from-accent-gold to-accent-gold-light text-primary font-bold rounded-full hover:scale-[1.02] transition-transform disabled:opacity-50">
                        {loading ? "Publishing..." : "Publish Announcement"}
                    </button>
                </form>
            </CMSDrawer>
        </div>
    );
};
