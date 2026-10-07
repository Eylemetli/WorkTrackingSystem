"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function LoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await api.post("/Auth/login", {
                email,
                password,
            });

            localStorage.setItem("token", response.data.token);
            localStorage.setItem("role", response.data.role);
            localStorage.setItem("userId", response.data.userId.toString());

            if (response.data.role === "Admin") {
                router.push("/admin");
            } else if (response.data.role === "Manager") {
                router.push("/manager");
            } else if (response.data.role === "Employee") {
                router.push("/employee");
            }
        } catch (err: any) {
            setError(
                err.response?.data?.message ||
                "Giriş işlemi sırasında bir hata oluştu."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-md rounded-xl bg-white p-8 shadow">
                <h1 className="mb-6 text-center text-2xl font-bold text-gray-900">
                    İş Takip Sistemi
                </h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-800">
                            E-posta
                        </label>

                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 placeholder:text-gray-400 focus:border-gray-500 focus:outline-none"
                            placeholder="admin@worktracking.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-800">
                            Şifre
                        </label>

                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 placeholder:text-gray-400 focus:border-gray-500 focus:outline-none"
                            placeholder="Şifreniz"
                            required
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-red-600">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-black p-3 text-white disabled:opacity-50"
                    >
                        {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
                    </button>
                </form>
            </div>
        </main>
    );
}