"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Sidebar";
import api from "@/lib/api";
import { Task } from "@/types/task";

export default function ManagerTasksPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showForm, setShowForm] = useState(false);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [projectId, setProjectId] = useState(0);
    const [assignedUserId, setAssignedUserId] = useState(0);
    const [priority, setPriority] = useState(2);
    const [dueDate, setDueDate] = useState("");

    const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editProjectId, setEditProjectId] = useState(0);
    const [editAssignedUserId, setEditAssignedUserId] = useState(0);
    const [editPriority, setEditPriority] = useState(2);
    const [editDueDate, setEditDueDate] = useState("");
    const [editMembers, setEditMembers] = useState<MemberOption[]>([]);
    const [editStatus, setEditStatus] = useState(1);

    interface ProjectOption {
        id: number;
        name: string;
    }

    interface MemberOption {
        userId: number;
        fullName: string;
    }

    const [projects, setProjects] = useState<ProjectOption[]>([]);
    const [members, setMembers] = useState<MemberOption[]>([]);

    async function loadTasks() {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/tasks");

            setTasks(response.data);
        } catch {
            setError("Görevler alınamadı.");
        } finally {
            setLoading(false);
        }
    }

    async function loadProjects() {
        const response = await api.get("/manager/projects");
        setProjects(response.data);
    }

    useEffect(() => {
        loadTasks();
        loadProjects();
    }, []);

    async function handleProjectChange(id: number) {
        setProjectId(id);
        setAssignedUserId(0);

        if (id === 0) {
            setMembers([]);
            return;
        }

        const response = await api.get(`/projects/${id}/members`);
        setMembers(response.data);
    }

    async function createTask(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        try {
            await api.post("/tasks", {
                title,
                description,
                projectId,
                assignedUserId,
                priority,
                dueDate,
            });

            setTitle("");
            setDescription("");
            setProjectId(0);
            setAssignedUserId(0);
            setPriority(2);
            setDueDate("");
            setMembers([]);
            setShowForm(false);

            await loadTasks();
        } catch (err: any) {
            alert(
                err.response?.data?.message ??
                "Görev oluşturulamadı."
            );
        }
    }

    async function startEdit(task: Task) {
        setEditingTaskId(task.id);
        setEditTitle(task.title);
        setEditDescription(task.description ?? "");
        setEditProjectId(task.projectId);
        setEditAssignedUserId(task.assignedUserId);

        setEditPriority(
            task.priority === "Low"
                ? 1
                : task.priority === "Medium"
                    ? 2
                    : task.priority === "High"
                        ? 3
                        : 4
        );

        setEditStatus(
            task.status === "Pending"
                ? 1
                : task.status === "InProgress"
                    ? 2
                    : task.status === "InReview"
                        ? 3
                        : 4
        );

        setEditDueDate(
            task.dueDate ? task.dueDate.slice(0, 10) : ""
        );

        const response = await api.get(
            `/projects/${task.projectId}/members`
        );

        setEditMembers(response.data);
    }

    async function handleEditProjectChange(id: number) {
        setEditProjectId(id);
        setEditAssignedUserId(0);

        if (id === 0) {
            setEditMembers([]);
            return;
        }

        const response = await api.get(`/projects/${id}/members`);
        setEditMembers(response.data);
    }

    async function updateTask(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!editingTaskId) return;

        try {
            await api.put(`/tasks/${editingTaskId}`, {
                title: editTitle,
                description: editDescription,
                projectId: editProjectId,
                assignedUserId: editAssignedUserId,
                priority: editPriority,
                status: editStatus,
                dueDate: editDueDate,
            });

            setEditingTaskId(null);

            await loadTasks();
        } catch (err: any) {
            alert(
                err.response?.data?.message ??
                "Görev güncellenemedi."
            );
        }
    }

    return (
        <ProtectedRoute allowedRoles={["Manager"]}>
            <div className="flex min-h-screen bg-gray-100">
                <Sidebar role="Manager" />

                <main className="flex-1 p-8">
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Görevler
                            </h1>

                            <p className="mt-2 text-gray-700">
                                Projelerdeki görevleri görüntüleyebilirsiniz.
                            </p>
                        </div>

                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-white"
                        >
                            Yeni Görev Ekle
                        </button>
                    </div>

                    {showForm && (
                        <form
                            onSubmit={createTask}
                            className="mb-8 grid gap-4 rounded-xl bg-white p-6 shadow md:grid-cols-2"
                        >
                            <input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Görev başlığı"
                                className="rounded-lg border p-3 text-gray-900"
                                required
                            />

                            <select
                                value={projectId}
                                onChange={(e) =>
                                    handleProjectChange(Number(e.target.value))
                                }
                                className="rounded-lg border p-3 text-gray-900"
                                required
                            >
                                <option value={0}>Proje seçiniz</option>

                                {projects.map((project) => (
                                    <option key={project.id} value={project.id}>
                                        {project.name}
                                    </option>
                                ))}
                            </select>

                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Görev açıklaması"
                                className="rounded-lg border p-3 text-gray-900 md:col-span-2"
                            />

                            <select
                                value={assignedUserId}
                                onChange={(e) =>
                                    setAssignedUserId(Number(e.target.value))
                                }
                                className="rounded-lg border p-3 text-gray-900"
                                required
                            >
                                <option value={0}>Çalışan seçiniz</option>

                                {members.map((member) => (
                                    <option key={member.userId} value={member.userId}>
                                        {member.fullName}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={priority}
                                onChange={(e) => setPriority(Number(e.target.value))}
                                className="rounded-lg border p-3 text-gray-900"
                            >
                                <option value={1}>Low</option>
                                <option value={2}>Medium</option>
                                <option value={3}>High</option>
                                <option value={4}>Critical</option>
                            </select>

                            <input
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                className="rounded-lg border p-3 text-gray-900"
                                required
                            />

                            <button
                                type="submit"
                                className="rounded-lg bg-green-600 px-4 py-3 text-white md:col-span-2"
                            >
                                Görevi Kaydet
                            </button>
                        </form>
                    )}

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
                                Görev bulunamadı.
                            </p>
                        </div>
                    )}

                    {editingTaskId && (
                        <form
                            onSubmit={updateTask}
                            className="mb-8 grid gap-4 rounded-xl bg-white p-6 shadow md:grid-cols-2"
                        >
                            <h2 className="text-xl font-bold text-gray-900 md:col-span-2">
                                Görev Düzenle
                            </h2>

                            <input
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                className="rounded-lg border p-3 text-gray-900"
                                required
                            />

                            <select
                                value={editProjectId}
                                onChange={(e) =>
                                    handleEditProjectChange(Number(e.target.value))
                                }
                                className="rounded-lg border p-3 text-gray-900"
                            >
                                {projects.map((project) => (
                                    <option key={project.id} value={project.id}>
                                        {project.name}
                                    </option>
                                ))}
                            </select>

                            <textarea
                                value={editDescription}
                                onChange={(e) => setEditDescription(e.target.value)}
                                className="rounded-lg border p-3 text-gray-900 md:col-span-2"
                            />

                            <select
                                value={editAssignedUserId}
                                onChange={(e) =>
                                    setEditAssignedUserId(Number(e.target.value))
                                }
                                className="rounded-lg border p-3 text-gray-900"
                            >
                                {editMembers.map((member) => (
                                    <option key={member.userId} value={member.userId}>
                                        {member.fullName}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={editPriority}
                                onChange={(e) =>
                                    setEditPriority(Number(e.target.value))
                                }
                                className="rounded-lg border p-3 text-gray-900"
                            >
                                <option value={1}>Low</option>
                                <option value={2}>Medium</option>
                                <option value={3}>High</option>
                                <option value={4}>Critical</option>
                            </select>

                            <select
                                value={editStatus}
                                onChange={(e) => setEditStatus(Number(e.target.value))}
                                className="rounded-lg border p-3 text-gray-900"
                            >
                                <option value={1}>Pending</option>
                                <option value={2}>In Progress</option>
                                <option value={3}>In Review</option>
                                <option value={4}>Completed</option>
                            </select>

                            <input
                                type="date"
                                value={editDueDate}
                                onChange={(e) => setEditDueDate(e.target.value)}
                                className="rounded-lg border p-3 text-gray-900"
                                required
                            />

                            <div className="flex gap-3 md:col-span-2">
                                <button
                                    type="submit"
                                    className="rounded-lg bg-green-600 px-4 py-2 text-white"
                                >
                                    Güncelle
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setEditingTaskId(null)}
                                    className="rounded-lg bg-gray-500 px-4 py-2 text-white"
                                >
                                    İptal
                                </button>
                            </div>
                        </form>
                    )}
                    {!loading && !error && tasks.length > 0 && (
                        <div className="overflow-x-auto rounded-xl bg-white shadow">
                            <table className="w-full text-left">
                                <thead className="border-b bg-gray-100 text-gray-900">
                                    <tr>
                                        <th className="p-4">Görev</th>
                                        <th className="p-4">Proje</th>
                                        <th className="p-4">Çalışan</th>
                                        <th className="p-4">Öncelik</th>
                                        <th className="p-4">Durum</th>
                                        <th className="p-4">Son Tarih</th>
                                        <th className="p-4">İşlem</th>
                                    </tr>
                                </thead>

                                <tbody className="text-gray-800">
                                    {tasks.map((task) => (
                                        <tr
                                            key={task.id}
                                            className="border-b last:border-b-0"
                                        >
                                            <td className="p-4">
                                                <div className="font-medium">
                                                    {task.title}
                                                </div>

                                                <div className="text-sm text-gray-600">
                                                    {task.description}
                                                </div>
                                            </td>

                                            <td className="p-4">
                                                {task.projectName}
                                            </td>

                                            <td className="p-4">
                                                {task.assignedUserName}
                                            </td>

                                            <td className="p-4">
                                                {task.priority}
                                            </td>

                                            <td className="p-4">
                                                {task.status}
                                            </td>

                                            <td className="p-4">
                                                {task.dueDate
                                                    ? new Date(
                                                        task.dueDate
                                                    ).toLocaleDateString("tr-TR")
                                                    : "-"}
                                            </td>
                                            <td className="p-4">
                                                <button
                                                    onClick={() => startEdit(task)}
                                                    className="rounded-lg bg-yellow-500 px-3 py-2 text-sm text-white hover:bg-yellow-600"
                                                >
                                                    Düzenle
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </main>
            </div>
        </ProtectedRoute>
    );
}