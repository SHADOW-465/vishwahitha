import { getInitiatives } from "@/lib/actions";
import { InitiativesClient } from "@/components/initiatives-client";

export default async function InitiativesPage() {
    const initiatives = await getInitiatives();

    return (
        <div className="min-h-screen pt-32 pb-24 px-6 max-w-7xl mx-auto">
            <div className="mb-12 max-w-2xl space-y-3">
                <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-text-primary tracking-tight text-balance">
                    Projects
                </h1>
                <p className="text-text-secondary leading-relaxed">
                    Signature and ongoing programmes of the Rotaract Club of Vishwahita. Content is
                    edited by the board in Admin.
                </p>
            </div>

            <InitiativesClient initiatives={initiatives} />
        </div>
    );
}
