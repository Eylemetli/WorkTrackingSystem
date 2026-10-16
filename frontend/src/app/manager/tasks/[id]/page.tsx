"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Sidebar";
import api from "@/lib/api";
import { Task } from "@/types/task";

interface TaskComment {
    id: number;
    taskId: number;
    userId: number;
    userName: string;
    comment: string;
    createdAt: string;
}

interface WorkLog {
    id: number;
    taskId: number;
    userId: number;
    durationHours: number;
    description: string;
    createdAt: string;
}

export default function ManagerTaskDetailPage() {
    const params = useParams();
    const id = params.id;

    const [task, setTask] = useState<Task | null>(null);
    const [comments, setComments] = useState<TaskComment[]>([]);
    const [workLogs, setWorkLogs] = useState<WorkLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    async function loadTaskDetail() {
        try {
            setLoading(true);
            setError("");

            const [tasksResponse, commentsResponse, workLogsResponse] =
                await Promise.all([
                    api.get("/tasks"),
                    api.get(`/tasks/${id}/comments`),
                    api.get(`/tasks/${id}/worklogs`),
                ]);

            const foundTask = tasksResponse.data.find(
                (item: Task) => item.id === Number(id)
            );

            if (!foundTask) {
                setError("Görev bulunamadı.");
                return;
            }

            setTask(foundTask);
            setComments(commentsResponse.data);
            setWorkLogs(workLogsResponse.data);
        } catch {
            setError("Görev detayları alınamadı.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (id) {
            loadTaskDetail();
        }
    }, [id]);

    return (
        <ProtectedRoute allowedRoles={["Manager"]}>
            <div className="flex min-h-screen bg-gray-100">
                <Sidebar role="Manager" />

                <main className="flex-1 p-8">
                    {loading && (
                        <p className="text-gray-700">
                            Görev detayları yükleniyor...
                        </p>
                    )}

                    {error && (
                        <p className="text-red-600">
                            {error}
                        </p>
                    )}

                    {!loading && !error && task && (
                        <>
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
                                        <span className="font-semibold">Çalışan:</span>{" "}
                                        {task.assignedUserName}
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
                            </div>

                            <div className="mt-8 rounded-xl bg-white p-6 shadow">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    Yorumlar
                                </h2>

                                {comments.length === 0 ? (
                                    <p className="mt-4 text-gray-700">
                                        Bu görev için yorum bulunmuyor.
                                    </p>
                                ) : (
                                    <div className="mt-4 space-y-4">
                                        {comments.map((comment) => (
                                            <div
                                                key={comment.id}
                                                className="rounded-lg border border-gray-200 p-4"
                                            >
                                                <div className="flex justify-between">
                                                    <span className="font-semibold text-gray-900">
                                                        {comment.userName}
                                                    </span>

                                                    <span className="text-sm text-gray-500">
                                                        {new Date(
                                                            comment.createdAt
                                                        ).toLocaleString("tr-TR")}
                                                    </span>
                                                </div>

                                                <p className="mt-2 text-gray-700">
                                                    {comment.comment}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="mt-8 rounded-xl bg-white p-6 shadow">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    Çalışma Kayıtları
                                </h2>

                                {workLogs.length === 0 ? (
                                    <p className="mt-4 text-gray-700">
                                        Çalışma kaydı bulunmuyor.
                                    </p>
                                ) : (
                                    <div className="mt-4 space-y-4">
                                        {workLogs.map((log) => (
                                            <div
                                                key={log.id}
                                                className="rounded-lg border border-gray-200 p-4"
                                            >
                                                <p className="font-semibold text-gray-900">
                                                    {log.durationHours} saat
                                                </p>

                                                <p className="mt-1 text-gray-700">
                                                    {log.description}
                                                </p>

                                                <p className="mt-1 text-sm text-gray-500">
                                                    {new Date(log.createdAt).toLocaleString("tr-TR")}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </main>
            </div>
        </ProtectedRoute>
    );
}