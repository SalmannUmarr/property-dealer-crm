"use client";

import { useEffect, useState } from "react";

export default function LeadsPage() {
    const [leads, setLeads] = useState([]);
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        propertyInterest: "",
        budget: "",
    });

    async function fetchLeads() {
        const res = await fetch("/api/leads", {
            cache: "no-store",
            credentials: "include",
        });

        const data = await res.json();
        console.log("Fetched leads:", data);

        setLeads(data.leads || []);
    }

    useEffect(() => {
        fetchLeads();
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();

        const res = await fetch("/api/leads", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(form),
        });

        const data = await res.json();
        console.log("Create lead response:", data);

        if (res.ok) {
            alert("Lead created successfully");

            setForm({
                name: "",
                email: "",
                phone: "",
                propertyInterest: "",
                budget: "",
            });

            fetchLeads();
        } else {
            alert(data.message || "Failed to create lead");
        }
    }

    return (
        <main className="min-h-screen bg-slate-100 p-6">
            <h1 className="text-3xl font-bold mb-6">Leads</h1>

            {/* Create Lead */}
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-xl shadow mb-6 grid grid-cols-1 md:grid-cols-2 gap-4"
            >
                <input
                    className="border p-3 rounded"
                    placeholder="Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                />

                <input
                    className="border p-3 rounded"
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                />

                <input
                    className="border p-3 rounded"
                    placeholder="Phone"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />

                <input
                    className="border p-3 rounded"
                    placeholder="Property Interest"
                    value={form.propertyInterest}
                    onChange={(e) =>
                        setForm({ ...form, propertyInterest: e.target.value })
                    }
                />

                <input
                    className="border p-3 rounded"
                    placeholder="Budget"
                    value={form.budget}
                    onChange={(e) => setForm({ ...form, budget: e.target.value })}
                />

                <button className="bg-black text-white p-3 rounded col-span-full">
                    Create Lead
                </button>
            </form>

            {/* Leads List */}
            <div className="grid gap-4">
                {leads.map((lead) => (
                    <div
                        key={lead._id}
                        className="bg-white p-4 rounded-xl shadow border"
                    >
                        <h2 className="text-xl font-semibold">{lead.name}</h2>
                        <p>Email: {lead.email}</p>
                        <p>Phone: {lead.phone}</p>
                        <p>Interest: {lead.propertyInterest}</p>
                        <p>Budget: {lead.budget}</p>
                        <p className="font-bold">Priority: {lead.score}</p>
                    </div>
                ))}
            </div>
        </main>
    );
}