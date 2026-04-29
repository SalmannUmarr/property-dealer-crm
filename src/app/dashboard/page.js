import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardRedirect() {
    const user = await getCurrentUser();

    if (!user) redirect("/login");

    if (user.role === "admin") {
        redirect("/dashboard/admin");
    }

    redirect("/dashboard/agent");
}