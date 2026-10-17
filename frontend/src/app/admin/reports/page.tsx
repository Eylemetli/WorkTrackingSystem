"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Sidebar";
import api from "@/lib/api";
import { AdminReport } from "@/types/admin-report";

export default function AdminReportsPage() {
    const [report, setReport] = useState<AdminReport | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    async function loadReport() {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/admin/reports");

            setReport(response.data);
        } catch {
            setError("Rapor bilgileri alınamadı.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadReport();
    }, []);

    return (
        <ProtectedRoute allowedRoles={["Admin"]}>
            <div className="flex min-h-screen bg-gray-100">
                <Sidebar role="Admin" />

                <main className="flex-1 p-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">
                            Raporlar
                        </h1>

                        <p className="mt-2 text-gray-700">
                            Proje ve görev durumlarının genel özetini görüntüleyebilirsiniz.
                        </p>
                    </div>

                    {loading && (
                        <p className="text-gray-700">
                            Rapor yükleniyor...
                        </p>
                    )}

                    {error && (
                        <p className="text-red-600">
                            {error}
                        </p>
                    )}

                    {!loading && !error && report && (
                        <>
                            <div className="mb-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                                <ReportCard
                                    title="Toplam Proje"
                                    value={report.totalProjects}
                                />

                                <ReportCard
                                    title="Aktif Proje"
                                    value={report.activeProjects}
                                />

                                <ReportCard
                                    title="Tamamlanan Proje"
                                    value={report.completedProjects}
                                />

                                <ReportCard
                                    title="Toplam Görev"
                                    value={report.totalTasks}
                                />

                                <ReportCard
                                    title="Tamamlanan Görev"
                                    value={report.completedTasks}
                                />

                                <ReportCard
                                    title="Geciken Görev"
                                    value={report.overdueTasks}
                                />
                            </div>

                            <div className="rounded-xl bg-white p-6 shadow">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    Görev Durum Özeti
                                </h2>

                                <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                                    <StatusItem
                                        title="Bekleyen"
                                        value={report.pendingTasks}
                                    />

                                    <StatusItem
                                        title="Devam Eden"
                                        value={report.inProgressTasks}
                                    />

                                    <StatusItem
                                        title="İncelemede"
                                        value={report.inReviewTasks}
                                    />

                                    <StatusItem
                                        title="Tamamlanan"
                                        value={report.completedTasks}
                                    />
                                </div>

                                <div className="mt-8">
                                    <p className="text-sm font-medium text-gray-700">
                                        Görev Tamamlanma Oranı
                                    </p>

                                    <p className="mt-2 text-4xl font-bold text-gray-900">
                                        %{report.completionRate}
                                    </p>
                                </div>
                            </div>
                        </>
                    )}
                </main>
            </div>
        </ProtectedRoute>
    );
}

function ReportCard({
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

function StatusItem({
    title,
    value,
}: {
    title: string;
    value: number;
}) {
    return (
        <div className="rounded-lg border border-gray-200 p-4">
            <p className="text-sm text-gray-600">
                {title}
            </p>

            <p className="mt-2 text-2xl font-bold text-gray-900">
                {value}
            </p>
        </div>
    );
}