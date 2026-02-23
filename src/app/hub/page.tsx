export default function HubPage() {
    return (
        <div className="min-h-screen pt-32 px-6 max-w-7xl mx-auto">
            <div className="glass-panel rounded-3xl p-12 space-y-8">
                <h1 className="font-heading text-4xl font-bold text-text-primary">
                    Member <span className="text-accent-gold italic font-drama font-light text-5xl">Hub</span>
                </h1>
                <p className="font-mono text-text-secondary">
                    Welcome back. This is your protected space for announcements and feedback.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                        <h2 className="font-heading font-medium text-xl mb-4">Live Announcements</h2>
                        <p className="text-sm font-mono text-text-secondary">No new announcements today.</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                        <h2 className="font-heading font-medium text-xl mb-4">Weekly Feedback</h2>
                        <p className="text-sm font-mono text-text-secondary mb-4">Submit your ideas for the upcoming projects.</p>
                        <textarea className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-sm font-mono text-text-primary resize-none h-24 focus:outline-none focus:border-accent-cranberry transition-colors" placeholder="Type here..."></textarea>
                        <button className="mt-4 bg-text-primary text-primary px-5 py-2 rounded-full text-sm font-bold w-full hover:bg-text-secondary transition-colors">Submit Feedback</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
