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

interface TaskFile {
    id: number;
    taskId: number;
    fileName: string;
    filePath: string;
    uploadedAt: string;
}

export default function EmployeeTaskDetailPage() {
    const params = useParams();
    const id = params.id;

    const [task, setTask] = useState<Task | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [comments, setComments] = useState<TaskComment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [workLogs, setWorkLogs] = useState<WorkLog[]>([]);
    const [durationHours, setDurationHours] = useState("");
    const [workDescription, setWorkDescription] = useState("");
    const [files, setFiles] = useState<TaskFile[]>([]);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

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
            const commentsResponse = await api.get(`/tasks/${id}/comments`);
            setComments(commentsResponse.data);

            const workLogsResponse = await api.get(`/tasks/${id}/worklogs`);
            setWorkLogs(workLogsResponse.data);

            const filesResponse = await api.get(`/tasks/${id}/files`);
            setFiles(filesResponse.data);
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

    async function addComment(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!newComment.trim()) return;

        try {
            await api.post(`/tasks/${id}/comments`, {
                comment: newComment,
            });

            setNewComment("");

            const response = await api.get(`/tasks/${id}/comments`);
            setComments(response.data);
        } catch {
            alert("Yorum eklenemedi.");
        }
    }

    async function addWorkLog(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        try {
            await api.post(`/tasks/${id}/worklogs`, {
                durationHours: Number(durationHours),
                description: workDescription,
            });

            setDurationHours("");
            setWorkDescription("");

            const response = await api.get(`/tasks/${id}/worklogs`);
            setWorkLogs(response.data);
        } catch {
            alert("Çalışma kaydı eklenemedi.");
        }
    }

    async function uploadFile(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!selectedFile) {
            alert("Lütfen bir dosya seçin.");
            return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
            await api.post(`/tasks/${id}/files`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            setSelectedFile(null);

            const response = await api.get(`/tasks/${id}/files`);
            setFiles(response.data);
        } catch {
            alert("Dosya yüklenemedi.");
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
                            <div className="mt-10">
                                <h2 className="mb-4 text-2xl font-bold text-gray-900">
                                    Yorumlar
                                </h2>

                                {comments.length === 0 ? (
                                    <p className="text-gray-700">
                                        Bu görev için henüz yorum bulunmuyor.
                                    </p>
                                ) : (
                                    <div className="space-y-4">
                                        {comments.map((comment) => (
                                            <div
                                                key={comment.id}
                                                className="rounded-lg border border-gray-200 p-4"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="font-semibold text-gray-900">
                                                        {comment.userName}
                                                    </span>

                                                    <span className="text-sm text-gray-500">
                                                        {new Date(comment.createdAt).toLocaleString("tr-TR")}
                                                    </span>
                                                </div>

                                                <p className="mt-2 text-gray-700">
                                                    {comment.comment}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <form onSubmit={addComment} className="mt-6">
                                    <textarea
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        placeholder="Yorumunuzu yazın..."
                                        className="w-full rounded-lg border border-gray-300 p-3 text-gray-900"
                                        rows={4}
                                        required
                                    />

                                    <button
                                        type="submit"
                                        className="mt-3 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                                    >
                                        Yorum Ekle
                                    </button>
                                </form>
                                <div className="mt-10">
                                    <h2 className="mb-4 text-2xl font-bold text-gray-900">
                                        Çalışma Kayıtları
                                    </h2>

                                    {workLogs.length === 0 ? (
                                        <p className="text-gray-700">
                                            Henüz çalışma kaydı bulunmuyor.
                                        </p>
                                    ) : (
                                        <div className="space-y-4">
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

                                    <form onSubmit={addWorkLog} className="mt-6 space-y-4">
                                        <input
                                            type="number"
                                            min="0.5"
                                            step="0.5"
                                            value={durationHours}
                                            onChange={(e) => setDurationHours(e.target.value)}
                                            placeholder="Çalışma süresi (saat)"
                                            className="w-full rounded-lg border border-gray-300 p-3 text-gray-900"
                                            required
                                        />

                                        <textarea
                                            value={workDescription}
                                            onChange={(e) => setWorkDescription(e.target.value)}
                                            placeholder="Yapılan çalışmayı açıklayın..."
                                            className="w-full rounded-lg border border-gray-300 p-3 text-gray-900"
                                            rows={3}
                                            required
                                        />

                                        <button
                                            type="submit"
                                            className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                                        >
                                            Çalışma Kaydı Ekle
                                        </button>
                                    </form>
                                </div>
                                <div className="mt-10">
                                    <h2 className="mb-4 text-2xl font-bold text-gray-900">
                                        Dosyalar
                                    </h2>

                                    {files.length === 0 ? (
                                        <p className="text-gray-700">
                                            Henüz dosya yüklenmemiş.
                                        </p>
                                    ) : (
                                        <div className="space-y-3">
                                            {files.map((file) => (
                                                <div
                                                    key={file.id}
                                                    className="rounded-lg border border-gray-200 p-4"
                                                >
                                                    <p className="font-medium text-gray-900">
                                                        {file.fileName}
                                                    </p>

                                                    <p className="mt-1 text-sm text-gray-500">
                                                        {new Date(file.uploadedAt).toLocaleString("tr-TR")}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <form onSubmit={uploadFile} className="mt-6">
                                        <input
                                            type="file"
                                            onChange={(e) =>
                                                setSelectedFile(e.target.files?.[0] ?? null)
                                            }
                                            className="block w-full rounded-lg border border-gray-300 p-3 text-gray-900"
                                        />

                                        <button
                                            type="submit"
                                            className="mt-3 rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
                                        >
                                            Dosya Yükle
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </ProtectedRoute>
    );
}