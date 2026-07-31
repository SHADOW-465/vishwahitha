"use client";

import { useState } from "react";
import { Plus, Trash2, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

type QuestionType = "rating" | "pill-select" | "text";

interface Question {
    id: string;
    question: string;
    type: QuestionType;
    options?: string;
}

export const PulseFormBuilder = () => {
    const [weekLabel, setWeekLabel] = useState(`Week of ${new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}`);
    const [questions, setQuestions] = useState<Question[]>([
        { id: "1", question: "How was your week overall?", type: "rating" }
    ]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const addQuestion = () => {
        setQuestions(prev => [...prev, { id: Date.now().toString(), question: "", type: "rating" }]);
    };

    const removeQuestion = (id: string) => {
        setQuestions(prev => prev.filter(q => q.id !== id));
    };

    const updateQuestion = (id: string, field: keyof Question, value: string) => {
        setQuestions(prev => prev.map(q => q.id === id ? { ...q, [field]: value } : q));
    };

    const handlePublish = async () => {
        setLoading(true);
        const { createPulseForm } = await import("@/lib/server-actions");
        const fd = new FormData();
        fd.append("week_label", weekLabel);
        fd.append("questions", JSON.stringify(questions.map(q => ({
            id: q.id,
            question: q.question,
            type: q.type,
            options: q.options ? q.options.split(",").map(s => s.trim()) : undefined,
        }))));
        const result = await createPulseForm(fd);
        setLoading(false);
        if (result.success) {
            toast.success(result.message);
            setSuccess(true);
        } else {
            toast.error(result.message);
        }
    };

    if (success) return (
        <div className="py-24 text-center space-y-4">
            <CheckCircle size={48} className="text-accent-teal mx-auto" />
            <h3 className="font-heading text-2xl font-bold text-text-primary">Pulse Form Published</h3>
            <p className="font-mono text-sm text-text-secondary">Members will see it in their Hub.</p>
        </div>
    );

    return (
        <div className="space-y-8">
            <div>
                <h2 className="font-heading text-2xl font-bold text-text-primary">Pulse Form Builder</h2>
                <p className="font-mono text-xs text-text-secondary mt-1">Build this week&apos;s member pulse survey.</p>
            </div>

            <div>
                <label className="block font-mono text-xs text-text-secondary mb-2 uppercase tracking-widest">Week Label</label>
                <input value={weekLabel} onChange={(e) => setWeekLabel(e.target.value)} className="w-full max-w-md bg-black/50 border border-white/10 rounded-xl p-3 text-text-primary focus:outline-none focus:border-accent-gold" />
            </div>

            <div className="space-y-4">
                {questions.map((q, i) => (
                    <div key={q.id} className="glass-panel rounded-2xl p-5 space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="font-mono text-xs text-text-secondary">Q{i + 1}</span>
                            <button onClick={() => removeQuestion(q.id)} className="p-1.5 text-accent-red hover:bg-accent-red/10 rounded-lg transition-colors">
                                <Trash2 size={14} />
                            </button>
                        </div>
                        <input
                            value={q.question}
                            onChange={(e) => updateQuestion(q.id, "question", e.target.value)}
                            placeholder="Question text..."
                            className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-text-primary focus:outline-none focus:border-accent-gold"
                        />
                        <div className="flex gap-3">
                            {(["rating", "pill-select", "text"] as QuestionType[]).map((type) => (
                                <button
                                    key={type}
                                    onClick={() => updateQuestion(q.id, "type", type)}
                                    className={`font-mono text-xs border rounded-full px-4 py-1.5 transition-colors ${q.type === type ? "bg-accent-gold/10 border-accent-gold/30 text-accent-gold" : "border-white/10 text-text-secondary hover:border-white/20"}`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                        {q.type === "pill-select" && (
                            <input
                                value={q.options || ""}
                                onChange={(e) => updateQuestion(q.id, "options", e.target.value)}
                                placeholder="Options (comma-separated): Excellent, Good, Needs Work"
                                className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-sm text-text-primary focus:outline-none focus:border-accent-gold"
                            />
                        )}
                    </div>
                ))}

                <button onClick={addQuestion} className="flex items-center gap-2 font-mono text-sm text-text-secondary border border-dashed border-white/15 rounded-2xl px-5 py-4 w-full justify-center hover:border-accent-gold/30 hover:text-text-primary transition-colors">
                    <Plus size={16} /> Add Question
                </button>
            </div>

            <button onClick={handlePublish} disabled={loading} className="w-full py-4 bg-gradient-to-r from-accent-gold to-accent-gold-light text-primary font-bold rounded-full hover:scale-[1.02] transition-transform disabled:opacity-50">
                {loading ? "Publishing..." : "Publish & Activate Form"}
            </button>
        </div>
    );
};
