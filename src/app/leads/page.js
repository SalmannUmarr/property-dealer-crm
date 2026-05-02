"use client";

import { useEffect, useState } from "react";

export default function LeadsPage() {
    const [currentUser, setCurrentUser] = useState(null);
    const [leads, setLeads] = useState([]);
    const [agents, setAgents] = useState([]);
    const [message, setMessage] = useState("");

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        propertyInterest: "",
        budget: "",
    });

    async function fetchCurrentUser() {
        const res = await fetch("/api/auth/me", {
            credentials: "include",
            cache: "no-store",
        });

        const data = await res.json();
        setCurrentUser(data.user || null);
    }

    async function fetchLeads() {
        const res = await fetch("/api/leads", {
            cache: "no-store",
            credentials: "include",
        });

        const data = await res.json();
        setLeads(data.leads || []);
    }

    async function fetchAgents() {
        const res = await fetch("/api/users/agents", {
            cache: "no-store",
            credentials: "include",
        });

        const data = await res.json();
        setAgents(data.agents || []);
    }

    useEffect(() => {
        fetchCurrentUser();
        fetchLeads();
        fetchAgents();

        const interval = setInterval(() => {
            fetchLeads();
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();

        const res = await fetch("/api/leads", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(form),
        });

        const data = await res.json();

        if (res.ok) {
            setMessage("Lead created successfully");

            setForm({
                name: "",
                email: "",
                phone: "",
                propertyInterest: "",
                budget: "",
            });

            fetchLeads();
        } else {
            setMessage(data.message || "Failed to create lead");
        }
    }

    async function assignLead(leadId, agentId) {
        const res = await fetch(`/api/leads/${leadId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
                assignedTo: agentId,
                status: "Assigned",
            }),
        });

        const data = await res.json();

        if (res.ok) {
            setMessage("Lead assigned successfully");
            fetchLeads();
        } else {
            setMessage(data.message || "Failed to assign lead");
        }
    }

    async function updateStatus(leadId, status) {
        const res = await fetch(`/api/leads/${leadId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ status }),
        });

        const data = await res.json();

        if (res.ok) {
            setMessage("Lead status updated successfully");
            fetchLeads();
        } else {
            setMessage(data.message || "Failed to update status");
        }
    }

    async function deleteLead(leadId) {
        const confirmed = confirm("Are you sure you want to delete this lead?");

        if (!confirmed) return;

        const res = await fetch(`/api/leads/${leadId}`, {
            method: "DELETE",
            credentials: "include",
        });

        const data = await res.json();

        if (res.ok) {
            setMessage("Lead deleted successfully");
            fetchLeads();
        } else {
            setMessage(data.message || "Failed to delete lead");
        }
    }

    return (
        <main className="min-h-screen bg-slate-100 p-6 text-gray-900">
            <h1 className="text-3xl font-bold mb-6">Leads Management</h1>

            <p className="mb-4 text-sm text-gray-600">
                Live updates enabled: leads refresh automatically every 5 seconds.
            </p>

            {message && (
                <div className="mb-4 bg-blue-100 text-blue-800 p-3 rounded-lg">
                    {message}
                </div>
            )}

            {currentUser?.role === "admin" && (
                <form
                    onSubmit={handleSubmit}
                    className="bg-white p-6 rounded-xl shadow mb-6 grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                    <input
                        className="border border-gray-300 p-3 rounded"
                        placeholder="Name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />

                    <input
                        className="border border-gray-300 p-3 rounded"
                        placeholder="Email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />

                    <input
                        className="border border-gray-300 p-3 rounded"
                        placeholder="Phone e.g. 923001234567"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />

                    <input
                        className="border border-gray-300 p-3 rounded"
                        placeholder="Property Interest"
                        value={form.propertyInterest}
                        onChange={(e) =>
                            setForm({ ...form, propertyInterest: e.target.value })
                        }
                    />

                    <input
                        className="border border-gray-300 p-3 rounded"
                        placeholder="Budget"
                        value={form.budget}
                        onChange={(e) => setForm({ ...form, budget: e.target.value })}
                    />

                    <button className="bg-black text-white p-3 rounded col-span-full">
                        Create Lead
                    </button>
                </form>
            )}

            <p className="mb-4 font-semibold">Total Leads: {leads.length}</p>

            <div className="grid gap-4">
                {leads.length === 0 ? (
                    <p>No leads found.</p>
                ) : (
                    leads.map((lead) => {
                        const isOverdue =
                            lead.followUpDate && new Date(lead.followUpDate) < new Date();

                        return (
                            <div
                                key={lead._id}
                                className={`p-5 rounded-xl shadow border ${
                                    isOverdue ? "bg-red-50 border-red-400" : "bg-white"
                                }`}
                            >
                                <div className="flex justify-between gap-4 flex-wrap">
                                    <div>
                                        <h2 className="text-xl font-bold">{lead.name}</h2>
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
                                        <p>
                                            Follow-up:{" "}
                                            {lead.followUpDate
                                                ? new Date(lead.followUpDate).toLocaleDateString()
                                                : "Not set"}
                                            {isOverdue && (
                                                <span className="text-red-600 font-bold">
                          {" "}
                                                    (Overdue)
                        </span>
                                            )}
                                        </p>
                                    </div>

                                    <div className="min-w-64">
                                        {currentUser?.role === "admin" && (
                                            <>
                                                <label className="block font-semibold mb-2">
                                                    Assign to Agent
                                                </label>

                                                <select
                                                    className="border border-gray-300 p-3 rounded w-full bg-white"
                                                    value={lead.assignedTo?._id || ""}
                                                    onChange={(e) => assignLead(lead._id, e.target.value)}
                                                >
                                                    <option value="">Select Agent</option>
                                                    {agents.map((agent) => (
                                                        <option key={agent._id} value={agent._id}>
                                                            {agent.name} - {agent.email}
                                                        </option>
                                                    ))}
                                                </select>
                                            </>
                                        )}

                                        <label className="block font-semibold mt-3 mb-2">
                                            Update Status
                                        </label>

                                        <select
                                            className="border border-gray-300 p-3 rounded w-full bg-white"
                                            value={lead.status}
                                            onChange={(e) => updateStatus(lead._id, e.target.value)}
                                        >
                                            <option value="New">New</option>
                                            <option value="Assigned">Assigned</option>
                                            <option value="Contacted">Contacted</option>
                                            <option value="In Progress">In Progress</option>
                                            <option value="Closed">Closed</option>
                                            <option value="Lost">Lost</option>
                                        </select>

                                        <a
                                            className="block mt-3 bg-green-600 text-white text-center p-2 rounded"
                                            href={`https://wa.me/${lead.phone}`}
                                            target="_blank"
                                        >
                                            WhatsApp Lead
                                        </a>

                                        <a
                                            className="block mt-3 bg-black text-white text-center p-2 rounded"
                                            href={`/leads/${lead._id}`}
                                        >
                                            View Timeline
                                        </a>

                                        {currentUser?.role === "admin" && (
                                            <button
                                                onClick={() => deleteLead(lead._id)}
                                                className="block mt-3 bg-red-600 text-white text-center p-2 rounded w-full"
                                            >
                                                Delete Lead
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </main>
    );
}