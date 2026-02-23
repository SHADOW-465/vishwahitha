import { BroadcastCenter } from "@/components/broadcast-center";
import { WeeklyPulseAggregator } from "@/components/weekly-pulse-aggregator";
import { getFeedback } from "@/lib/actions";

export default async function AdminPage() {
    const initialFeedback = await getFeedback();

    // Stub data if db isn't wired up correctly yet
    const feedbackData = initialFeedback && initialFeedback.length > 0 ? initialFeedback : [
        {
            id: "FB-001",
            created_at: new Date(Date.now() - 86400000).toISOString(),
            member_id: "USR-A-44321",
            content: "Can we start a web development bootcamp for the NGO children?",
            category: "Ideas"
        },
        {
            id: "FB-002",
            created_at: new Date(Date.now() - 172800000).toISOString(),
            member_id: "USR-B-99882",
            content: "The INDRU team needs more logistical support next week.",
            category: "Grievances"
        },
        {
            id: "FB-003",
            created_at: new Date(Date.now() - 259200000).toISOString(),
            member_id: "USR-C-11234",
            content: "Nominating Rtr. Yogi for going above and beyond on WishFit!",
            category: "Kandupidi Nominations"
        }
    ];

    return (
        <div className="min-h-screen pt-32 px-6 max-w-7xl mx-auto pb-32">
            <div className="mb-12">
                <h1 className="font-heading text-4xl font-bold text-text-primary">
                    Control <span className="text-accent-cranberry italic font-drama font-light text-5xl">Panel</span>
                </h1>
                <p className="font-mono text-text-secondary mt-2">
                    Restricted access. Role: Admin. Manage community artifacts and broadcasts.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4 max-h-[600px] flex flex-col">
                    <BroadcastCenter />
                </div>

                <div className="lg:col-span-8">
                    <WeeklyPulseAggregator initialData={feedbackData} />
                </div>
            </div>
        </div>
    );
}
