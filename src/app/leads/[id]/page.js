"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function LeadDetailPage() {
    const { id } = useParams();
    const [lead, setLead] = useState(null);
    const [activities, setActivities] = useState([]);
    const [message, setMessage] = useState("");
    const [followUpDate, setFollowUpDate] = useState("");

    async function fetchLead() {
        const res = await fetch(`/api/leads/${id}`, {
            cache: "no-store",
            credentials: "include",
        });

        const data = await res.json();
        setLead(data.lead);
        setActivities(data.activities || []);

        if (data.lead?.followUpDate) {
            setFollowUpDate(data.lead.followUpDate.slice(0, 10));
        }
    }

    useEffect(() => {
        fetchLead();
    }, []);

    async function updateFollowUp(e) {
        e.preventDefault();

        const res = await fetch(`/api/leads/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
                followUpDate,
            }),
        });

        const data = await res.json();

        if (res.ok) {
            setMessage("Follow-up date updated successfully");
            fetchLead();
        } else {
            setMessage(data.message || "Failed to update follow-up date");
        }
    }

    if (!lead) {
        return (
            <main className="min-h-screen bg-slate-100 p-6 text-gray-900">
                Loading lead...
            </main>
        );
    }

    const isOverdue =
        lead.followUpDate && new Date(lead.followUpDate) < new Date();

    return (
        <main className="min-h-screen bg-slate-100 p-6 text-gray-900">
            <h1 className="text-3xl font-bold mb-6">Lead Details</h1>

            {message && (
                <div className="mb-4 bg-blue-100 text-blue-800 p-3 rounded-lg">
                    {message}
                </div>
            )}

            <div className="bg-white p-6 rounded-xl shadow mb-6">
                <h2 className="text-2xl font-bold">{lead.name}</h2>
                <p>Email: {lead.email || "-"}</p>
                <p>Phone: {lead.phone}</p>
                <p>Interest: {lead.propertyInterest}</p>
                <p>Budget: {lead.budget}</p>
                <p>Status: {lead.status}</p>
                <p className="font-bold">Priority: {lead.score}</p>
                <p>
                    Assigned To:{" "}
                    {lead.assignedTo ? lead.assignedTo.name : "Unassigned"}
                </p>

                <p className={isOverdue ? "font-bold text-red-600 mt-3" : "mt-3"}>
                    Follow-up Date:{" "}
                    {lead.followUpDate
                        ? new Date(lead.followUpDate).toLocaleDateString()
                        : "Not set"}
                    {isOverdue && " — Overdue"}
                </p>
            </div>

            <form
                onSubmit={updateFollowUp}
                className="bg-white p-6 rounded-xl shadow mb-6"
            >
                <h2 className="text-2xl font-bold mb-4">Set Follow-up Reminder</h2>

                <input
                    type="date"
                    className="border border-gray-300 p-3 rounded text-gray-900 mr-3"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                />

                <button className="bg-black text-white px-5 py-3 rounded">
                    Save Follow-up
                </button>
            </form>

            <div className="bg-white p-6 rounded-xl shadow">
                <h2 className="text-2xl font-bold mb-4">Activity Timeline</h2>

                {activities.length === 0 ? (
                    <p>No activity recorded yet.</p>
                ) : (
                    <div className="space-y-4">
                        {activities.map((activity) => (
                            <div
                                key={activity._id}
                                className="border-l-4 border-black pl-4 py-2"
                            >
                                <p className="font-bold">{activity.action}</p>
                                <p>{activity.details}</p>
                                <p className="text-sm text-gray-500">
                                    By: {activity.user ? activity.user.name : "System"}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {new Date(activity.createdAt).toLocaleString()}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}