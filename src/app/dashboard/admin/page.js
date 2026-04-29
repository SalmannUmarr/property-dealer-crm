import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

async function getAnalytics() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const res = await fetch(`${baseUrl}/api/analytics`, {
        cache: "no-store",
    });

    if (!res.ok) {
        return null;
    }

    return res.json();
}

export default async function AdminDashboard() {
    const user = await getCurrentUser();

    if (!user) redirect("/login");
    if (user.role !== "admin") redirect("/dashboard/agent");

    const analytics = await getAnalytics();

    const totalLeads = analytics?.totalLeads || 0;
    const priorityCounts = analytics?.priorityCounts || {
        High: 0,
        Medium: 0,
        Low: 0,
    };

    const statusCounts = analytics?.statusCounts || {};
    const agentPerformance = analytics?.agentPerformance || [];

    return (
        <main className="min-h-screen bg-slate-100 p-6 text-gray-900">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                    <p className="text-gray-600 mt-1">Welcome, {user.name}</p>
                </div>

                <Link
                    href="/leads"
                    className="bg-black text-white px-5 py-3 rounded-lg"
                >
                    Manage Leads
                </Link>
            </div>

            <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-6 rounded-xl shadow border">
                    <h2 className="font-semibold text-gray-600">Total Leads</h2>
                    <p className="text-4xl font-bold mt-2">{totalLeads}</p>
                </div>

                <div className="bg-red-50 p-6 rounded-xl shadow border border-red-200">
                    <h2 className="font-semibold text-red-700">High Priority</h2>
                    <p className="text-4xl font-bold mt-2">{priorityCounts.High}</p>
                </div>

                <div className="bg-yellow-50 p-6 rounded-xl shadow border border-yellow-200">
                    <h2 className="font-semibold text-yellow-700">Medium Priority</h2>
                    <p className="text-4xl font-bold mt-2">{priorityCounts.Medium}</p>
                </div>

                <div className="bg-green-50 p-6 rounded-xl shadow border border-green-200">
                    <h2 className="font-semibold text-green-700">Low Priority</h2>
                    <p className="text-4xl font-bold mt-2">{priorityCounts.Low}</p>
                </div>
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow border">
                    <h2 className="text-2xl font-bold mb-4">Lead Status Distribution</h2>

                    <div className="space-y-3">
                        {Object.entries(statusCounts).map(([status, count]) => (
                            <div
                                key={status}
                                className="flex justify-between border-b pb-2"
                            >
                                <span>{status}</span>
                                <span className="font-bold">{count}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow border">
                    <h2 className="text-2xl font-bold mb-4">Priority Distribution</h2>

                    <div className="space-y-3">
                        {Object.entries(priorityCounts).map(([priority, count]) => (
                            <div
                                key={priority}
                                className="flex justify-between border-b pb-2"
                            >
                                <span>{priority}</span>
                                <span className="font-bold">{count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-white p-6 rounded-xl shadow border mt-6">
                <h2 className="text-2xl font-bold mb-4">Agent Performance Overview</h2>

                {agentPerformance.length === 0 ? (
                    <p>No agents found.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                            <tr className="bg-slate-100 text-left">
                                <th className="p-3 border">Agent</th>
                                <th className="p-3 border">Email</th>
                                <th className="p-3 border">Assigned Leads</th>
                                <th className="p-3 border">In Progress</th>
                                <th className="p-3 border">Closed</th>
                            </tr>
                            </thead>

                            <tbody>
                            {agentPerformance.map((agent) => (
                                <tr key={agent.id}>
                                    <td className="p-3 border font-semibold">{agent.name}</td>
                                    <td className="p-3 border">{agent.email}</td>
                                    <td className="p-3 border">{agent.totalAssigned}</td>
                                    <td className="p-3 border">{agent.inProgress}</td>
                                    <td className="p-3 border">{agent.closed}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </main>
    );
}