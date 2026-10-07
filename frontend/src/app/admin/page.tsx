"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Sidebar";
import api from "@/lib/api";
import { AdminDashboardData } from "@/types/dashboard";

export default function AdminPage() {
    const [dashboard, setDashboard] =
        useState<AdminDashboardData | null>(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadDashboard() {
            try {
                const response = await api.get("/admin/dashboard");
                setDashboard(response.data);
            } catch {
                setError("Dashboard verileri alınamadı.");
            } finally {
                setLoading(false);
            }
        }

        loadDashboard();
    }, []);

    const cards = dashboard
        ? [
            {
                title: "Toplam Kullanıcı",
                value: dashboard.totalUsers,
            },
            {
                title: "Aktif Kullanıcı",
                value: dashboard.activeUsers,
            },
            {
                title: "Toplam Proje",
                value: dashboard.totalProjects,
            },
            {
                title: "Aktif Proje",
                value: dashboard.activeProjects,
            },
            {
                title: "Tamamlanan Görev",
                value: dashboard.completedTasks,
            },
            {
                title: "Geciken Görev",
                value: dashboard.overdueTasks,
            },
        ]
        : [];

    return (
        <ProtectedRoute allowedRoles={["Admin"]}>
            <div className="flex min-h-screen bg-gray-100">
                <Sidebar role="Admin" />

                <main className="flex-1 p-8">
                    <h1 className="text-3xl font-bold">
                        Admin Dashboard
                    </h1>

                    <p className="mt-2 text-gray-600">
                        Sistem genelindeki güncel istatistikler.
                    </p>

                    {loading && (
                        <p className="mt-8">Veriler yükleniyor...</p>
                    )}

                    {error && (
                        <p className="mt-8 text-red-600">{error}</p>
                    )}

                    {dashboard && (
                        <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                            {cards.map((card) => (
                                <div
                                    key={card.title}
                                    className="rounded-xl bg-white p-6 shadow"
                                >
                                    <p className="text-sm text-gray-500">
                                        {card.title}
                                    </p>

                                    <p className="mt-2 text-3xl font-bold">
                                        {card.value}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </ProtectedRoute>
    );
}