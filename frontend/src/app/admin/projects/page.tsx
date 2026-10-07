"use client";

import { FormEvent, useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Sidebar";
import api from "@/lib/api";
import { Project } from "@/types/project";
import { User } from "@/types/user";

export default function AdminProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [managers, setManagers] = useState<User[]>([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showForm, setShowForm] = useState(false);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [managerId, setManagerId] = useState<number>(0);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const [editingId, setEditingId] = useState<number | null>(null);
    const [editName, setEditName] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editManagerId, setEditManagerId] = useState<number>(0);
    const [editStartDate, setEditStartDate] = useState("");
    const [editEndDate, setEditEndDate] = useState("");
    const [editIsActive, setEditIsActive] = useState(true);

    async function loadProjects() {
        try {
            setLoading(true);
            setError("");

            const [projectsResponse, usersResponse] = await Promise.all([
                api.get("/admin/projects"),
                api.get("/admin/users"),
            ]);

            setProjects(projectsResponse.data);

            const managerUsers = usersResponse.data.filter(
                (user: User) => user.role === "Manager"
            );

            setManagers(managerUsers);
        } catch {
            setError("Projeler alınamadı.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadProjects();
    }, []);

    async function createProject(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        try {
            await api.post("/admin/projects", {
                name,
                description,
                managerId,
                startDate,
                endDate: endDate || null,
            });

            setName("");
            setDescription("");
            setManagerId(0);
            setStartDate("");
            setEndDate("");
            setShowForm(false);

            await loadProjects();
        } catch (err: any) {
            alert(
                err.response?.data?.message ??
                "Proje oluşturulamadı."
            );
        }
    }

    function startEdit(project: Project) {
        setEditingId(project.id);
        setEditName(project.name);
        setEditDescription(project.description ?? "");
        setEditManagerId(project.managerId);
        setEditStartDate(project.startDate.slice(0, 10));
        setEditEndDate(
            project.endDate ? project.endDate.slice(0, 10) : ""
        );
        setEditIsActive(project.isActive);
    }

    async function updateProject(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!editingId) return;

        try {
            await api.put(`/admin/projects/${editingId}`, {
                name: editName,
                description: editDescription,
                managerId: editManagerId,
                startDate: editStartDate,
                endDate: editEndDate || null,
                isActive: editIsActive,
            });

            setEditingId(null);

            await loadProjects();
        } catch (err: any) {
            alert(
                err.response?.data?.message ??
                "Proje güncellenemedi."
            );
        }
    }

    return (
        <ProtectedRoute allowedRoles={["Admin"]}>
            <div className="flex min-h-screen bg-gray-100">
                <Sidebar role="Admin" />

                <main className="flex-1 p-8">
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Proje Yönetimi
                            </h1>

                            <p className="mt-2 text-gray-700">
                                Projeleri ve proje yöneticilerini yönetebilirsiniz.
                            </p>
                        </div>

                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
                        >
                            Yeni Proje Ekle
                        </button>
                    </div>

                    {showForm && (
                        <form
                            onSubmit={createProject}
                            className="mb-8 grid gap-4 rounded-xl bg-white p-6 shadow md:grid-cols-2"
                        >
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Proje adı"
                                className="rounded-lg border border-gray-300 p-3 text-gray-900"
                                required
                            />

                            <select
                                value={managerId}
                                onChange={(e) => setManagerId(Number(e.target.value))}
                                className="rounded-lg border border-gray-300 p-3 text-gray-900"
                                required
                            >
                                <option value={0}>Yönetici seçiniz</option>

                                {managers.map((manager) => (
                                    <option key={manager.id} value={manager.id}>
                                        {manager.firstName} {manager.lastName}
                                    </option>
                                ))}
                            </select>

                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Proje açıklaması"
                                className="rounded-lg border border-gray-300 p-3 text-gray-900 md:col-span-2"
                            />

                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="rounded-lg border border-gray-300 p-3 text-gray-900"
                                required
                            />

                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="rounded-lg border border-gray-300 p-3 text-gray-900"
                            />

                            <button
                                type="submit"
                                className="rounded-lg bg-green-600 px-4 py-3 font-medium text-white md:col-span-2"
                            >
                                Projeyi Kaydet
                            </button>
                        </form>
                    )}

                    {editingId && (
                        <form
                            onSubmit={updateProject}
                            className="mb-8 grid gap-4 rounded-xl bg-white p-6 shadow md:grid-cols-2"
                        >
                            <h2 className="text-xl font-bold text-gray-900 md:col-span-2">
                                Proje Düzenle
                            </h2>

                            <input
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="rounded-lg border border-gray-300 p-3 text-gray-900"
                                required
                            />

                            <select
                                value={editManagerId}
                                onChange={(e) =>
                                    setEditManagerId(Number(e.target.value))
                                }
                                className="rounded-lg border border-gray-300 p-3 text-gray-900"
                            >
                                {managers.map((manager) => (
                                    <option key={manager.id} value={manager.id}>
                                        {manager.firstName} {manager.lastName}
                                    </option>
                                ))}
                            </select>

                            <textarea
                                value={editDescription}
                                onChange={(e) =>
                                    setEditDescription(e.target.value)
                                }
                                className="rounded-lg border border-gray-300 p-3 text-gray-900 md:col-span-2"
                            />

                            <input
                                type="date"
                                value={editStartDate}
                                onChange={(e) => setEditStartDate(e.target.value)}
                                className="rounded-lg border border-gray-300 p-3 text-gray-900"
                            />

                            <input
                                type="date"
                                value={editEndDate}
                                onChange={(e) => setEditEndDate(e.target.value)}
                                className="rounded-lg border border-gray-300 p-3 text-gray-900"
                            />

                            <label className="flex items-center gap-2 text-gray-900">
                                <input
                                    type="checkbox"
                                    checked={editIsActive}
                                    onChange={(e) =>
                                        setEditIsActive(e.target.checked)
                                    }
                                />
                                Aktif
                            </label>

                            <div className="flex gap-3 md:col-span-2">
                                <button
                                    type="submit"
                                    className="rounded-lg bg-green-600 px-4 py-2 text-white"
                                >
                                    Güncelle
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setEditingId(null)}
                                    className="rounded-lg bg-gray-500 px-4 py-2 text-white"
                                >
                                    İptal
                                </button>
                            </div>
                        </form>
                    )}

                    {loading && <p>Projeler yükleniyor...</p>}

                    {error && <p className="text-red-600">{error}</p>}

                    {!loading && !error && (
                        <div className="overflow-x-auto rounded-xl bg-white shadow">
                            <table className="w-full text-left">
                                <thead className="border-b bg-gray-100 text-gray-900">
                                    <tr>
                                        <th className="p-4">Proje</th>
                                        <th className="p-4">Yönetici</th>
                                        <th className="p-4">Başlangıç</th>
                                        <th className="p-4">Bitiş</th>
                                        <th className="p-4">Durum</th>
                                        <th className="p-4">Aktiflik</th>
                                        <th className="p-4">İşlem</th>
                                    </tr>
                                </thead>

                                <tbody className="text-gray-800">
                                    {projects.map((project) => (
                                        <tr
                                            key={project.id}
                                            className="border-b last:border-b-0"
                                        >
                                            <td className="p-4">
                                                <div className="font-medium">
                                                    {project.name}
                                                </div>

                                                <div className="text-sm text-gray-600">
                                                    {project.description}
                                                </div>
                                            </td>

                                            <td className="p-4">
                                                {project.managerName}
                                            </td>

                                            <td className="p-4">
                                                {new Date(
                                                    project.startDate
                                                ).toLocaleDateString("tr-TR")}
                                            </td>

                                            <td className="p-4">
                                                {project.endDate
                                                    ? new Date(
                                                        project.endDate
                                                    ).toLocaleDateString("tr-TR")
                                                    : "-"}
                                            </td>

                                            <td className="p-4">
                                                {project.status}
                                            </td>

                                            <td className="p-4">
                                                {project.isActive ? "Aktif" : "Pasif"}
                                            </td>

                                            <td className="p-4">
                                                <button
                                                    onClick={() => startEdit(project)}
                                                    className="rounded-lg bg-yellow-500 px-3 py-2 text-sm text-white"
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