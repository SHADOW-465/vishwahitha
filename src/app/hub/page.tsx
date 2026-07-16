import { redirect } from "next/navigation";

/** Phase 2: hub → member clubroom */
export default function HubRedirectPage() {
    redirect("/member");
}
