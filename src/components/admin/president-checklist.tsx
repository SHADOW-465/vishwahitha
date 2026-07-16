const ITEMS = [
    {
        title: "Post this week's prompt",
        body: "Admin → Pulse Forms. Deactivates the previous form and publishes one new weekly question set. Members answer under Member → Participate.",
    },
    {
        title: "Add public events",
        body: "Admin → Events. Set Public on for the homepage carousel and /events. Check Online for virtual sessions.",
    },
    {
        title: "Moderate ideas",
        body: "Admin → Ideas. Change status: new → under review → planned → done (or declined).",
    },
    {
        title: "Respond to prospects",
        body: "Admin → Inbox. Membership applications and contact messages land here.",
    },
    {
        title: "Keep one legacy project",
        body: "Admin → Initiatives. Use “Set legacy” on the single flagship programme (homepage spotlight).",
    },
    {
        title: "Edit standing copy",
        body: "Admin → Page Sections. Update hero, mission/vision, standing (charter, sponsor, District).",
    },
];

export function PresidentChecklist() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="font-heading text-2xl font-bold text-text-primary">
                    President checklist
                </h2>
                <p className="font-mono text-xs text-text-secondary mt-1 max-w-xl leading-relaxed">
                    How to run the site without a developer. Full write-up also in{" "}
                    <code className="text-accent-gold">docs/admin-president-checklist.md</code>.
                </p>
            </div>
            <ol className="space-y-4">
                {ITEMS.map((item, i) => (
                    <li
                        key={item.title}
                        className="glass-panel rounded-2xl border border-white/5 p-5 flex gap-4"
                    >
                        <span className="font-heading font-extrabold text-accent-gold text-xl shrink-0">
                            {i + 1}
                        </span>
                        <div>
                            <h3 className="font-heading font-bold text-text-primary">{item.title}</h3>
                            <p className="mt-1 font-mono text-xs text-text-secondary leading-relaxed">
                                {item.body}
                            </p>
                        </div>
                    </li>
                ))}
            </ol>
        </div>
    );
}
