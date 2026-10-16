"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Sidebar";
import api from "@/lib/api";
import { EmployeeDashboard } from "@/types/employee-dashboard";

export default function EmployeePage() {
    const [dashboard, setDashboard] =
        useState<EmployeeDashboard | null>(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    async function loadDashboard() {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/employee/dashboard");

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
        <ProtectedRoute allowedRoles={["Employee"]}>
            <div className="flex min-h-screen bg-gray-100">
                <Sidebar role="Employee" />

                <main className="flex-1 p-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">
                            Employee Dashboard
                        </h1>

                        <p className="mt-2 text-gray-700">
                            Size atanmış görevlerin durumlarını görüntüleyebilirsiniz.
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
                                title="Toplam Görev"
                                value={dashboard.totalTasks}
                            />

                            <DashboardCard
                                title="Bekleyen Görev"
                                value={dashboard.pendingTasks}
                            />

                            <DashboardCard
                                title="Devam Eden Görev"
                                value={dashboard.inProgressTasks}
                            />

                            <DashboardCard
                                title="İncelemede"
                                value={dashboard.inReviewTasks}
                            />

                            <DashboardCard
                                title="Tamamlanan Görev"
                                value={dashboard.completedTasks}
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