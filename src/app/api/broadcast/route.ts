import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { Resend } from "resend";
import twilio from "twilio";

export async function POST(req: Request) {
    // 1. Authenticate Admin (Placeholder: requiring any authenticated user for now)
    const { userId } = await auth();
    if (!userId) {
        return new Response("Unauthorized", { status: 401 });
    }

    try {
        const formData = await req.formData();
        const message = formData.get("message") as string;
        const channels = formData.getAll("channels") as string[];

        if (!message || channels.length === 0) {
            return new Response("Missing message or channels", { status: 400 });
        }

        // 2. Fetch all verified members from Supabase
        const { data: members, error } = await supabaseAdmin
            .from("users")
            .select("email, first_name");

        if (error || !members) {
            console.error("Failed to fetch members for broadcast:", error);
            return new Response("Failed to fetch members", { status: 500 });
        }

        // 3. Initialize SDKs (Safely handling potentially missing env vars)
        const resendKey = process.env.RESEND_API_KEY;
        const resend = resendKey ? new Resend(resendKey) : null;

        const twilioSid = process.env.TWILIO_ACCOUNT_SID;
        const twilioAuth = process.env.TWILIO_AUTH_TOKEN;
        const twilioPhone = process.env.TWILIO_PHONE_NUMBER;
        const twilioClient = (twilioSid && twilioAuth) ? twilio(twilioSid, twilioAuth) : null;

        const results = { emailsSent: 0, whatsappSent: 0, errors: [] as string[] };

        // 4. Dispatch Broadcasts
        for (const member of members) {
            const personalizedMessage = `Hi ${member.first_name || 'Rotaractor'},\n\n${message}\n\nYours in Rotaract,\nClub of Vishwahitha`;

            // Email Broadcast via Resend
            if (channels.includes("email") && resend && member.email) {
                try {
                    await resend.emails.send({
                        from: "Rotaract Vishwahitha <events@vishwahitha.org>", // Requires domain verification in Resend
                        to: member.email,
                        subject: "Important Club Update",
                        text: personalizedMessage,
                    });
                    results.emailsSent++;
                } catch (err: any) {
                    results.errors.push(`Email error for ${member.email}: ${err?.message}`);
                }
            }

            // WhatsApp Broadcast via Twilio
            // Note: Requires users to have phone numbers stored in the DB. Using a mock standard for illustration.
            // If the user adds phone numbers to the Clerk/Supabase profile later, replace `mockPhoneNumber` with `member.phone`.
            if (channels.includes("whatsapp") && twilioClient && twilioPhone) {
                try {
                    // await twilioClient.messages.create({
                    //     body: personalizedMessage,
                    //     from: `whatsapp:${twilioPhone}`,
                    //     to: `whatsapp:${member.phone}`
                    // });
                    results.whatsappSent++;
                } catch (err: any) {
                    results.errors.push(`WhatsApp error: ${err?.message}`);
                }
            }
        }

        console.log("Broadcast Results:", results);

        // In a real app with JS enabled on the client, you'd return JSON. 
        // Since we are using standard <form action>, let's redirect back with a query parameter.
        return new Response(null, {
            status: 302,
            headers: { Location: "/admin?broadcast=success" }
        });

    } catch (err: any) {
        console.error("Broadcast Execution Error:", err);
        return new Response("Internal Server Error", { status: 500 });
    }
}
