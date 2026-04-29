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
        <main className="min-h-screen flex items-center justify-center bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-4"
            >
                <h1 className="text-2xl font-bold">Login</h1>

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

                <button className="w-full bg-black text-white p-3 rounded">
                    Login
                </button>

                {message && <p className="text-sm text-center">{message}</p>}
            </form>
        </main>
    );
}