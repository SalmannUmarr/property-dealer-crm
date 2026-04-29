"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
    const router = useRouter();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "agent",
    });

    const [message, setMessage] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();

        const res = await fetch("/api/auth/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(form),
        });

        const data = await res.json();

        if (res.ok) {
            setMessage("Signup successful. Redirecting to login...");
            setTimeout(() => router.push("/login"), 1000);
        } else {
            setMessage(data.message);
        }
    }

    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-4"
            >
                <h1 className="text-2xl font-bold">Create Account</h1>

                <input
                    className="w-full border p-3 rounded"
                    placeholder="Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                />

                <input
                    className="w-full border p-3 rounded"
                    placeholder="Email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                />

                <input
                    className="w-full border p-3 rounded"
                    placeholder="Password"
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                />

                <select
                    className="w-full border p-3 rounded"
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                >
                    <option value="agent">Agent</option>
                    <option value="admin">Admin</option>
                </select>

                <button className="w-full bg-black text-white p-3 rounded">
                    Signup
                </button>

                {message && <p className="text-sm text-center">{message}</p>}
            </form>
        </main>
    );
}