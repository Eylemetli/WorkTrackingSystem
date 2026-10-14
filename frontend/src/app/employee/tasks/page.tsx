"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Sidebar";
import api from "@/lib/api";
import { Task } from "@/types/task";
import Link from "next/link";

export default function EmployeeTasksPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    async function loadTasks() {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/employee/tasks");

            setTasks(response.data);
        } catch {
            setError("Görevler alınamadı.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadTasks();
    }, []);

    async function updateStatus(taskId: number, status: number) {
        try {
            await api.patch(
                `/employee/tasks/${taskId}/status?status=${status}`
            );

            await loadTasks();
        } catch {
            alert("Görev durumu güncellenemedi.");
        }
    }

    return (
        <ProtectedRoute allowedRoles={["Employee"]}>
            <div className="flex min-h-screen bg-gray-100">
                <Sidebar role="Employee" />

                <main className="flex-1 p-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">
                            Görevlerim
                        </h1>

                        <p className="mt-2 text-gray-700">
                            Size atanmış görevleri görüntüleyebilirsiniz.
                        </p>
                    </div>

                    {loading && (
                        <p className="text-gray-700">
                            Görevler yükleniyor...
                        </p>
                    )}

                    {error && (
                        <p className="text-red-600">
                            {error}
                        </p>
                    )}

                    {!loading && !error && tasks.length === 0 && (
                        <div className="rounded-xl bg-white p-6 shadow">
                            <p className="text-gray-700">
                                Size atanmış görev bulunmamaktadır.
                            </p>
                        </div>
                    )}

                    {!loading && !error && tasks.length > 0 && (
                        <div className="space-y-6">
                            {tasks.map((task) => (
                                <div
                                    key={task.id}
                                    className="rounded-xl bg-white p-6 shadow"
                                >
                                    <h2 className="text-xl font-bold text-gray-900">
                                        {task.title}
                                    </h2>

                                    <p className="mt-2 text-gray-700">
                                        {task.description || "Açıklama bulunmuyor."}
                                    </p>

                                    <div className="mt-5 grid gap-3 md:grid-cols-2">
                                        <p className="text-gray-700">
                                            <span className="font-semibold">
                                                Proje:
                                            </span>{" "}
                                            {task.projectName}
                                        </p>

                                        <p className="text-gray-700">
                                            <span className="font-semibold">
                                                Öncelik:
                                            </span>{" "}
                                            {task.priority}
                                        </p>

                                        <p className="text-gray-700">
                                            <span className="font-semibold">
                                                Durum:
                                            </span>{" "}
                                            {task.status}
                                        </p>

                                        <p className="text-gray-700">
                                            <span className="font-semibold">
                                                Son Tarih:
                                            </span>{" "}
                                            {task.dueDate
                                                ? new Date(
                                                    task.dueDate
                                                ).toLocaleDateString("tr-TR")
                                                : "-"}
                                        </p>
                                    </div>

                                    <div className="mt-6">
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
                                                updateStatus(
                                                    task.id,
                                                    Number(e.target.value)
                                                )
                                            }
                                            className="rounded-lg border border-gray-300 p-3 text-gray-900"
                                        >
                                            <option value={1}>Pending</option>
                                            <option value={2}>In Progress</option>
                                            <option value={3}>In Review</option>
                                            <option value={4}>Completed</option>
                                        </select>
                                    </div>
                                    <Link
                                        href={`/employee/tasks/${task.id}`}
                                        className="mt-5 inline-block rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                                    >
                                        Detayı Gör
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </ProtectedRoute>
    );
}