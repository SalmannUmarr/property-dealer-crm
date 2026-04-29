import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AgentDashboard() {
    const user = await getCurrentUser();

    if (!user) redirect("/login");
    if (user.role !== "agent") redirect("/dashboard/admin");

    return (
        <main className="min-h-screen bg-gray-100 p-8">
            <h1 className="text-3xl font-bold">Agent Dashboard</h1>
            <p className="mt-2">Welcome, {user.name}</p>

            <div className="mt-6 bg-white p-6 rounded-xl shadow">
                <h2 className="font-semibold">Assigned Leads</h2>
                <p className="text-3xl font-bold mt-2">0</p>
            </div>
        </main>
    );
}