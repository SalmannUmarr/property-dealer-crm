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
        <main className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md space-y-5 border border-gray-200"
            >
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
                    <p className="text-gray-600 mt-1">Register a CRM user</p>
                </div>

                <input
                    className="w-full border border-gray-300 p-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Full name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                />

                <input
                    className="w-full border border-gray-300 p-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Email address"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                />

                <input
                    className="w-full border border-gray-300 p-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Password"
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                />

                <select
                    className="w-full border border-gray-300 p-3 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-black"
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                >
                    <option value="agent">Agent</option>
                    <option value="admin">Admin</option>
                </select>

                <button className="w-full bg-black hover:bg-gray-800 text-white p-3 rounded-lg font-semibold">
                    Signup
                </button>

                {message && (
                    <p className="text-sm text-center text-blue-700 font-medium">
                        {message}
                    </p>
                )}

                <p className="text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <a href="/login" className="font-semibold text-black underline">
                        Login
                    </a>
                </p>
            </form>
        </main>
    );
}