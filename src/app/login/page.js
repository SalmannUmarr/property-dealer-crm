"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [message, setMessage] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();

        const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(form),
        });

        const data = await res.json();

        if (res.ok) {
            if (data.user.role === "admin") {
                router.push("/dashboard/admin");
            } else {
                router.push("/dashboard/agent");
            }
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
                    <h1 className="text-3xl font-bold text-gray-900">Login</h1>
                    <p className="text-gray-600 mt-1">Access your CRM dashboard</p>
                </div>

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

                <button className="w-full bg-black hover:bg-gray-800 text-white p-3 rounded-lg font-semibold">
                    Login
                </button>

                {message && (
                    <p className="text-sm text-center text-red-600 font-medium">
                        {message}
                    </p>
                )}

                <p className="text-center text-sm text-gray-600">
                    Don&apos;t have an account?{" "}
                    <a href="/signup" className="font-semibold text-black underline">
                        Signup
                    </a>
                </p>
            </form>
        </main>
    );
}