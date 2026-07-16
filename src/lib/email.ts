import { Resend } from "resend";

const FROM =
    process.env.RESEND_FROM ||
    "Rotaract Vishwahita <onboarding@resend.dev>";

export function getResend() {
    const key = process.env.RESEND_API_KEY;
    if (!key) return null;
    return new Resend(key);
}

export async function sendMemberEmails(params: {
    subject: string;
    text: string;
    recipients: { email: string; first_name?: string | null }[];
}) {
    const resend = getResend();
    if (!resend) {
        return {
            ok: false as const,
            sent: 0,
            message: "RESEND_API_KEY is not set. Add it to .env.local to enable email.",
            errors: [] as string[],
        };
    }

    let sent = 0;
    const errors: string[] = [];

    for (const member of params.recipients) {
        if (!member.email) continue;
        const body = `Hi ${member.first_name || "Rotaractor"},\n\n${params.text}\n\n— Rotaract Club of Vishwahita\nRI District 3234`;
        try {
            await resend.emails.send({
                from: FROM,
                to: member.email,
                subject: params.subject,
                text: body,
            });
            sent++;
        } catch (err: any) {
            errors.push(`${member.email}: ${err?.message || "send failed"}`);
        }
    }

    return {
        ok: sent > 0,
        sent,
        message:
            sent > 0
                ? `Sent ${sent} email(s).${errors.length ? ` ${errors.length} failed.` : ""}`
                : errors[0] || "No emails sent.",
        errors,
    };
}
