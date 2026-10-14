"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Sidebar";
import api from "@/lib/api";
import { Task } from "@/types/task";

export default function EmployeeTaskDetailPage() {
    const params = useParams();
    const id = params.id;

    const [task, setTask] = useState<Task | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    async function loadTask() {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/employee/tasks");
            const foundTask = response.data.find(
                (item: Task) => item.id === Number(id)
            );

            if (!foundTask) {
                setError("Görev bulunamadı.");
                return;
            }

            setTask(foundTask);
        } catch {
            setError("Görev detayı alınamadı.");
        } finally {
            setLoading(false);
        }
    }

    async function updateStatus(status: number) {
        try {
            await api.patch(
                `/employee/tasks/${id}/status?status=${status}`
            );

            await loadTask();
        } catch {
            alert("Görev durumu güncellenemedi.");
        }
    }

    useEffect(() => {
        if (id) {
            loadTask();
        }
    }, [id]);

    return (
        <ProtectedRoute allowedRoles={["Employee"]}>
            <div className="flex min-h-screen bg-gray-100">
                <Sidebar role="Employee" />

                <main className="flex-1 p-8">
                    {loading && (
                        <p className="text-gray-700">
                            Görev yükleniyor...
                        </p>
                    )}

                    {error && (
                        <p className="text-red-600">
                            {error}
                        </p>
                    )}

                    {!loading && !error && task && (
                        <div className="rounded-xl bg-white p-8 shadow">
                            <h1 className="text-3xl font-bold text-gray-900">
                                {task.title}
                            </h1>

                            <p className="mt-3 text-gray-700">
                                {task.description || "Açıklama bulunmuyor."}
                            </p>

                            <div className="mt-8 grid gap-4 md:grid-cols-2">
                                <p className="text-gray-700">
                                    <span className="font-semibold">Proje:</span>{" "}
                                    {task.projectName}
                                </p>

                                <p className="text-gray-700">
                                    <span className="font-semibold">Öncelik:</span>{" "}
                                    {task.priority}
                                </p>

                                <p className="text-gray-700">
                                    <span className="font-semibold">Durum:</span>{" "}
                                    {task.status}
                                </p>

                                <p className="text-gray-700">
                                    <span className="font-semibold">Son Tarih:</span>{" "}
                                    {task.dueDate
                                        ? new Date(task.dueDate).toLocaleDateString("tr-TR")
                                        : "-"}
                                </p>
                            </div>

                            <div className="mt-8">
                                <label className="mb-2 block font-medium text-gray-900">
                                    Görev Durumunu Güncelle
                                </label>

                                <select
                                    value={
                                        task.status === "Pending"
                                            ? 1
                                            : task.status === "InProgress"
                                                ? 2
                                                : task.status === "InReview"
                                                    ? 3
                                                    : 4
                                    }
                                    onChange={(e) =>
                                        updateStatus(Number(e.target.value))
                                    }
                                    className="rounded-lg border border-gray-300 p-3 text-gray-900"
                                >
                                    <option value={1}>Pending</option>
                                    <option value={2}>In Progress</option>
                                    <option value={3}>In Review</option>
                                    <option value={4}>Completed</option>
                                </select>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </ProtectedRoute>
    );
}