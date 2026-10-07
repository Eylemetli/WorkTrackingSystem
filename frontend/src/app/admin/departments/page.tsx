"use client";

import { FormEvent, useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Sidebar";
import api from "@/lib/api";
import { Department } from "@/types/department";

export default function AdminDepartmentsPage() {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const [editingId, setEditingId] = useState<number | null>(null);
    const [editName, setEditName] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editIsActive, setEditIsActive] = useState(true);

    async function loadDepartments() {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/admin/departments");
            setDepartments(response.data);
        } catch {
            setError("Departmanlar alınamadı.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadDepartments();
    }, []);

    async function createDepartment(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        try {
            await api.post("/admin/departments", {
                name,
                description,
            });

            setName("");
            setDescription("");
            setShowForm(false);

            await loadDepartments();
        } catch {
            alert("Departman oluşturulamadı.");
        }
    }

    function startEdit(department: Department) {
        setEditingId(department.id);
        setEditName(department.name);
        setEditDescription(department.description ?? "");
        setEditIsActive(department.isActive);
    }

    async function updateDepartment(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!editingId) return;

        try {
            await api.put(`/admin/departments/${editingId}`, {
                name: editName,
                description: editDescription,
                isActive: editIsActive,
            });

            setEditingId(null);
            await loadDepartments();
        } catch {
            alert("Departman güncellenemedi.");
        }
    }

    async function deleteDepartment(id: number) {
        const confirmed = window.confirm(
            "Bu departmanı silmek istediğinize emin misiniz?"
        );

        if (!confirmed) return;

        try {
            await api.delete(`/admin/departments/${id}`);
            await loadDepartments();
        } catch (err: any) {
            alert(
                err.response?.data?.message ??
                "Departman silinemedi."
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
                                Departman Yönetimi
                            </h1>

                            <p className="mt-2 text-gray-700">
                                Departmanları görüntüleyebilir ve yönetebilirsiniz.
                            </p>
                        </div>

                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
                        >
                            Yeni Departman Ekle
                        </button>
                    </div>

                    {showForm && (
                        <form
                            onSubmit={createDepartment}
                            className="mb-8 grid gap-4 rounded-xl bg-white p-6 shadow"
                        >
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Departman adı"
                                className="rounded-lg border border-gray-300 p-3 text-gray-900"
                                required
                            />

                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Açıklama"
                                className="rounded-lg border border-gray-300 p-3 text-gray-900"
                            />

                            <button
                                type="submit"
                                className="rounded-lg bg-green-600 px-4 py-3 font-medium text-white hover:bg-green-700"
                            >
                                Departmanı Kaydet
                            </button>
                        </form>
                    )}

                    {editingId && (
                        <form
                            onSubmit={updateDepartment}
                            className="mb-8 grid gap-4 rounded-xl bg-white p-6 shadow"
                        >
                            <h2 className="text-xl font-bold text-gray-900">
                                Departman Düzenle
                            </h2>

                            <input
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="rounded-lg border border-gray-300 p-3 text-gray-900"
                                required
                            />

                            <textarea
                                value={editDescription}
                                onChange={(e) => setEditDescription(e.target.value)}
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

                            <div className="flex gap-3">
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

                    {loading && <p>Departmanlar yükleniyor...</p>}

                    {error && (
                        <p className="text-red-600">
                            {error}
                        </p>
                    )}

                    {!loading && !error && (
                        <div className="overflow-x-auto rounded-xl bg-white shadow">
                            <table className="w-full text-left">
                                <thead className="border-b bg-gray-100 text-gray-900">
                                    <tr>
                                        <th className="p-4">ID</th>
                                        <th className="p-4">Departman</th>
                                        <th className="p-4">Açıklama</th>
                                        <th className="p-4">Durum</th>
                                        <th className="p-4">İşlem</th>
                                    </tr>
                                </thead>

                                <tbody className="text-gray-800">
                                    {departments.map((department) => (
                                        <tr
                                            key={department.id}
                                            className="border-b last:border-b-0"
                                        >
                                            <td className="p-4">{department.id}</td>

                                            <td className="p-4 font-medium">
                                                {department.name}
                                            </td>

                                            <td className="p-4">
                                                {department.description ?? "-"}
                                            </td>

                                            <td className="p-4">
                                                {department.isActive ? "Aktif" : "Pasif"}
                                            </td>

                                            <td className="p-4">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => startEdit(department)}
                                                        className="rounded-lg bg-yellow-500 px-3 py-2 text-sm text-white"
                                                    >
                                                        Düzenle
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            deleteDepartment(department.id)
                                                        }
                                                        className="rounded-lg bg-red-600 px-3 py-2 text-sm text-white"
                                                    >
                                                        Sil
                                                    </button>
                                                </div>
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