"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Sidebar";
import api from "@/lib/api";
import { ManagerDashboard } from "@/types/manager-dashboard";

export default function ManagerPage() {
    const [dashboard, setDashboard] =
        useState<ManagerDashboard | null>(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    async function loadDashboard() {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/manager/dashboard");

            setDashboard(response.data);
        } catch {
            setError("Dashboard bilgileri alınamadı.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadDashboard();
    }, []);

    return (
        <ProtectedRoute allowedRoles={["Manager"]}>
            <div className="flex min-h-screen bg-gray-100">
                <Sidebar role="Manager" />

                <main className="flex-1 p-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">
                            Manager Dashboard
                        </h1>

                        <p className="mt-2 text-gray-700">
                            Proje ve görev durumlarını özet olarak görüntüleyebilirsiniz.
                        </p>
                    </div>

                    {loading && (
                        <p className="text-gray-700">
                            Dashboard yükleniyor...
                        </p>
                    )}

                    {error && (
                        <p className="text-red-600">
                            {error}
                        </p>
                    )}

                    {!loading && !error && dashboard && (
                        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                            <DashboardCard
                                title="Toplam Proje"
                                value={dashboard.totalProjects}
                            />

                            <DashboardCard
                                title="Aktif Proje"
                                value={dashboard.activeProjects}
                            />

                            <DashboardCard
                                title="Toplam Görev"
                                value={dashboard.totalTasks}
                            />

                            <DashboardCard
                                title="Tamamlanan Görev"
                                value={dashboard.completedTasks}
                            />

                            <DashboardCard
                                title="Devam Eden Görev"
                                value={dashboard.inProgressTasks}
                            />

                            <DashboardCard
                                title="Geciken Görev"
                                value={dashboard.overdueTasks}
                            />
                        </div>
                    )}
                </main>
            </div>
        </ProtectedRoute>
    );
}

function DashboardCard({
    title,
    value,
}: {
    title: string;
    value: number;
}) {
    return (
        <div className="rounded-xl bg-white p-6 shadow">
            <p className="text-sm font-medium text-gray-600">
                {title}
            </p>

            <p className="mt-3 text-4xl font-bold text-gray-900">
                {value}
            </p>
        </div>
    );
}