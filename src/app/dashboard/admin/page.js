import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminDashboard() {
    const user = await getCurrentUser();

    if (!user) redirect("/login");
    if (user.role !== "admin") redirect("/dashboard/agent");

    return (
        <main className="min-h-screen bg-gray-100 p-8">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="mt-2">Welcome, {user.name}</p>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-xl shadow">
                    <h2 className="font-semibold">Total Leads</h2>
                    <p className="text-3xl font-bold mt-2">0</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow">
                    <h2 className="font-semibold">High Priority</h2>
                    <p className="text-3xl font-bold mt-2">0</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow">
                    <h2 className="font-semibold">Agents</h2>
                    <p className="text-3xl font-bold mt-2">0</p>
                </div>
            </div>
        </main>
    );
}