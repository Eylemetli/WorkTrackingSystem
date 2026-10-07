"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Sidebar";
import api from "@/lib/api";
import { User } from "@/types/user";

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showForm, setShowForm] = useState(false);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [roleId, setRoleId] = useState(3);
    const [departmentId, setDepartmentId] = useState(1);

    const [editingUserId, setEditingUserId] = useState<number | null>(null);
    const [editFirstName, setEditFirstName] = useState("");
    const [editLastName, setEditLastName] = useState("");
    const [editRoleId, setEditRoleId] = useState(3);
    const [editDepartmentId, setEditDepartmentId] = useState(1);

    function startEdit(user: User) {
        setEditingUserId(user.id);
        setEditFirstName(user.firstName);
        setEditLastName(user.lastName);

        setEditRoleId(
            user.role === "Admin"
                ? 1
                : user.role === "Manager"
                    ? 2
                    : 3
        );

        setEditDepartmentId(
            user.department === "Software"
                ? 1
                : user.department === "Human Resources"
                    ? 2
                    : user.department === "Accounting"
                        ? 3
                        : 4
        );
    }

    async function updateUser(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!editingUserId) return;

        try {
            await api.put(`/admin/users/${editingUserId}`, {
                firstName: editFirstName,
                lastName: editLastName,
                roleId: editRoleId,
                departmentId: editDepartmentId,
            });

            setEditingUserId(null);

            await loadUsers();
        } catch {
            alert("Kullanıcı güncellenemedi.");
        }
    }


    async function loadUsers() {
        try {
            setLoading(true);

            const response = await api.get("/admin/users");

            setUsers(response.data);
        } catch {
            setError("Kullanıcılar alınamadı.");
        } finally {
            setLoading(false);
        }
    }

    async function createUser(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        try {
            await api.post("/admin/users", {
                firstName,
                lastName,
                email,
                password,
                roleId,
                departmentId,
            });

            setFirstName("");
            setLastName("");
            setEmail("");
            setPassword("");
            setRoleId(3);
            setDepartmentId(1);
            setShowForm(false);

            await loadUsers();
        } catch {
            alert("Kullanıcı oluşturulamadı.");
        }
    }

    useEffect(() => {
        loadUsers();
    }, []);

    return (
        <ProtectedRoute allowedRoles={["Admin"]}>
            <div className="flex min-h-screen bg-gray-100">
                <Sidebar role="Admin" />

                <main className="flex-1 p-8">
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Kullanıcı Yönetimi
                            </h1>

                            <p className="mt-2 text-gray-700">
                                Sistemde kayıtlı kullanıcıları görüntüleyebilirsiniz.
                            </p>
                        </div>

                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
                        >
                            Yeni Kullanıcı Ekle
                        </button>
                    </div>

                    {showForm && (
                        <form
                            onSubmit={createUser}
                            className="mb-8 grid gap-4 rounded-xl bg-white p-6 shadow md:grid-cols-2"
                        >
                            <input
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder="Ad"
                                className="rounded-lg border border-gray-300 p-3 text-gray-900"
                                required
                            />

                            <input
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                placeholder="Soyad"
                                className="rounded-lg border border-gray-300 p-3 text-gray-900"
                                required
                            />

                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="E-posta"
                                className="rounded-lg border border-gray-300 p-3 text-gray-900"
                                required
                            />

                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Şifre"
                                className="rounded-lg border border-gray-300 p-3 text-gray-900"
                                required
                            />

                            <select
                                value={roleId}
                                onChange={(e) => setRoleId(Number(e.target.value))}
                                className="rounded-lg border border-gray-300 p-3 text-gray-900"
                            >
                                <option value={1}>Admin</option>
                                <option value={2}>Manager</option>
                                <option value={3}>Employee</option>
                            </select>

                            <select
                                value={departmentId}
                                onChange={(e) => setDepartmentId(Number(e.target.value))}
                                className="rounded-lg border border-gray-300 p-3 text-gray-900"
                            >
                                <option value={1}>Software</option>
                                <option value={2}>Human Resources</option>
                                <option value={3}>Accounting</option>
                                <option value={4}>Marketing</option>
                            </select>

                            <button
                                type="submit"
                                className="rounded-lg bg-green-600 px-4 py-3 font-medium text-white hover:bg-green-700 md:col-span-2"
                            >
                                Kullanıcıyı Kaydet
                            </button>
                        </form>
                    )}

                    {editingUserId && (
                        <form
                            onSubmit={updateUser}
                            className="mb-8 grid gap-4 rounded-xl bg-white p-6 shadow md:grid-cols-2"
                        >
                            <h2 className="text-xl font-bold text-gray-900 md:col-span-2">
                                Kullanıcı Düzenle
                            </h2>

                            <input
                                value={editFirstName}
                                onChange={(e) => setEditFirstName(e.target.value)}
                                className="rounded-lg border border-gray-300 p-3 text-gray-900"
                                placeholder="Ad"
                                required
                            />

                            <input
                                value={editLastName}
                                onChange={(e) => setEditLastName(e.target.value)}
                                className="rounded-lg border border-gray-300 p-3 text-gray-900"
                                placeholder="Soyad"
                                required
                            />

                            <select
                                value={editRoleId}
                                onChange={(e) => setEditRoleId(Number(e.target.value))}
                                className="rounded-lg border border-gray-300 p-3 text-gray-900"
                            >
                                <option value={1}>Admin</option>
                                <option value={2}>Manager</option>
                                <option value={3}>Employee</option>
                            </select>

                            <select
                                value={editDepartmentId}
                                onChange={(e) =>
                                    setEditDepartmentId(Number(e.target.value))
                                }
                                className="rounded-lg border border-gray-300 p-3 text-gray-900"
                            >
                                <option value={1}>Software</option>
                                <option value={2}>Human Resources</option>
                                <option value={3}>Accounting</option>
                                <option value={4}>Marketing</option>
                            </select>

                            <div className="flex gap-3 md:col-span-2">
                                <button
                                    type="submit"
                                    className="rounded-lg bg-green-600 px-4 py-2 text-white"
                                >
                                    Güncelle
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setEditingUserId(null)}
                                    className="rounded-lg bg-gray-500 px-4 py-2 text-white"
                                >
                                    İptal
                                </button>
                            </div>
                        </form>
                    )}

                    {loading && <p>Kullanıcılar yükleniyor...</p>}

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
                                        <th className="p-4">Ad Soyad</th>
                                        <th className="p-4">E-posta</th>
                                        <th className="p-4">Rol</th>
                                        <th className="p-4">Departman</th>
                                        <th className="p-4">Durum</th>
                                        <th className="p-4">İşlem</th>
                                    </tr>
                                </thead>

                                <tbody className="text-gray-800">
                                    {users.map((user) => (
                                        <tr
                                            key={user.id}
                                            className="border-b last:border-b-0"
                                        >
                                            <td className="p-4">
                                                {user.id}
                                            </td>

                                            <td className="p-4 font-medium">
                                                {user.firstName} {user.lastName}
                                            </td>

                                            <td className="p-4">
                                                {user.email}
                                            </td>

                                            <td className="p-4">
                                                {user.role}
                                            </td>

                                            <td className="p-4">
                                                {user.department ?? "-"}
                                            </td>

                                            <td className="p-4">
                                                {user.isActive ? (
                                                    <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
                                                        Aktif
                                                    </span>
                                                ) : (
                                                    <span className="rounded-full bg-red-100 px-3 py-1 text-sm text-red-700">
                                                        Pasif
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-4">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => startEdit(user)}
                                                        className="rounded-lg bg-yellow-500 px-3 py-2 text-sm text-white hover:bg-yellow-600"
                                                    >
                                                        Düzenle
                                                    </button>

                                                    <button
                                                        onClick={async () => {
                                                            await api.patch(
                                                                `/admin/users/${user.id}/toggle-active`
                                                            );

                                                            await loadUsers();
                                                        }}
                                                        className="rounded-lg bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700"
                                                    >
                                                        {user.isActive ? "Pasif Yap" : "Aktif Yap"}
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