"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Sidebar";
import api from "@/lib/api";
import { Project } from "@/types/project";
import { User } from "@/types/user";

interface ProjectMember {
    id: number;
    projectId: number;
    userId: number;
    fullName: string;
    email: string;
    joinedAt: string;
}
export default function ManagerProjectDetailPage() {
    const params = useParams();
    const id = params.id;

    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [members, setMembers] = useState<ProjectMember[]>([]);
    const [employees, setEmployees] = useState<User[]>([]);
    const [selectedUserId, setSelectedUserId] = useState(0);

    useEffect(() => {
        if (!id) return;

        async function loadProject() {
            setLoading(true);
            setError("");

            // 1. Proje detayını getir
            try {
                const response = await api.get(`/manager/projects/${id}`);
                console.log("Proje:", response.data);
                setProject(response.data);
            } catch (err) {
                console.error("Proje detayı hatası:", err);
                setError("Proje detayı alınamadı.");
            } finally {
                setLoading(false);
            }

            // 2. Proje üyelerini getir
            try {
                const membersResponse = await api.get(
                    `/projects/${id}/members`
                );

                console.log("Üyeler:", membersResponse.data);
                setMembers(membersResponse.data);
            } catch (err) {
                console.error("Üyeler alınamadı:", err);
            }

            // 3. Çalışanları getir
            try {
                const usersResponse = await api.get("/manager/employees");

                console.log("Çalışanlar:", usersResponse.data);
                setEmployees(usersResponse.data);
            } catch (err) {
                console.error("Çalışanlar alınamadı:", err);
            }
        }

        loadProject();
    }, [id]);

    // useEffect dışında
    async function addMember() {
        if (selectedUserId === 0) return;

        try {
            await api.post(`/projects/${id}/members`, {
                userId: selectedUserId,
            });

            setSelectedUserId(0);

            const membersResponse = await api.get(`/projects/${id}/members`);
            setMembers(membersResponse.data);

            const employeesResponse = await api.get("/manager/employees");
            setEmployees(employeesResponse.data);

        } catch (err: unknown) {
            alert("Çalışan projeye eklenemedi.");
            console.error(err);
        }
    }

    async function removeMember(userId: number) {
        const confirmed = window.confirm(
            "Bu çalışanı projeden çıkarmak istediğinize emin misiniz?"
        );

        if (!confirmed) return;

        try {
            await api.delete(`/projects/${id}/members/${userId}`);

            // Proje üyelerini güncelle
            setMembers((prevMembers) =>
                prevMembers.filter((member) => member.userId !== userId)
            );

            setSelectedUserId(0);

        } catch (err: unknown) {
            alert("Çalışan projeden çıkarılamadı.");
            console.error(err);
        }
    }

    const availableEmployees = employees.filter(
        (employee) =>
            !members.some((member) => member.userId === employee.id)
    );

    return (
        <ProtectedRoute allowedRoles={["Manager"]}>
            <div className="flex min-h-screen bg-gray-100">
                <Sidebar role="Manager" />

                <main className="flex-1 p-8">
                    {loading && (
                        <p className="text-gray-700">
                            Proje yükleniyor...
                        </p>
                    )}

                    {error && (
                        <p className="text-red-600">
                            {error}
                        </p>
                    )}

                    {!loading && !error && project && (
                        <>
                            <div className="rounded-xl bg-white p-8 shadow">

                                <h1 className="text-3xl font-bold text-gray-900">
                                    {project.name}
                                </h1>

                                <p className="mt-3 text-gray-700">
                                    {project.description || "Açıklama bulunmuyor."}
                                </p>

                                <div className="mt-8 grid gap-4 md:grid-cols-2">
                                    <div>
                                        <p className="font-semibold text-gray-900">
                                            Proje Yöneticisi
                                        </p>
                                        <p className="text-gray-700">
                                            {project.managerName}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="font-semibold text-gray-900">
                                            Durum
                                        </p>
                                        <p className="text-gray-700">
                                            {project.status}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="font-semibold text-gray-900">
                                            Başlangıç Tarihi
                                        </p>
                                        <p className="text-gray-700">
                                            {new Date(project.startDate).toLocaleDateString("tr-TR")}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="font-semibold text-gray-900">
                                            Bitiş Tarihi
                                        </p>
                                        <p className="text-gray-700">
                                            {project.endDate
                                                ? new Date(project.endDate).toLocaleDateString("tr-TR")
                                                : "-"}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="font-semibold text-gray-900">
                                            Aktiflik
                                        </p>
                                        <p className="text-gray-700">
                                            {project.isActive ? "Aktif" : "Pasif"}
                                        </p>
                                    </div>
                                </div>

                            </div>

                            <div className="mt-10">
                                <div className="mb-6 rounded-xl bg-white p-6 shadow">
                                    <h2 className="mb-4 text-xl font-bold text-gray-900">
                                        Projeye Çalışan Ekle
                                    </h2>

                                    <div className="flex gap-3">
                                        <select
                                            value={selectedUserId}
                                            onChange={(e) => setSelectedUserId(Number(e.target.value))}
                                            className="flex-1 rounded-lg border border-gray-300 p-3 text-gray-900"
                                        >
                                            <option value={0}>Çalışan seçiniz</option>

                                            {availableEmployees.map((employee) => (
                                                <option key={employee.id} value={employee.id}>
                                                    {employee.firstName} {employee.lastName}
                                                </option>
                                            ))}
                                        </select>

                                        <button
                                            onClick={addMember}
                                            className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                                        >
                                            Projeye Ekle
                                        </button>
                                    </div>
                                </div>
                                <h2 className="mb-4 text-2xl font-bold text-gray-900">
                                    Proje Üyeleri
                                </h2>

                                {members.length === 0 ? (
                                    <p className="text-gray-700">
                                        Bu projede henüz çalışan bulunmuyor.
                                    </p>
                                ) : (
                                    <div className="overflow-x-auto rounded-xl border">
                                        <table className="w-full text-left">
                                            <thead className="bg-gray-100 text-gray-900">
                                                <tr>
                                                    <th className="p-4">Ad Soyad</th>
                                                    <th className="p-4">E-posta</th>
                                                    <th className="p-4">Katılma Tarihi</th>
                                                    <th className="p-4">İşlem</th>
                                                </tr>
                                            </thead>

                                            <tbody className="text-gray-800">
                                                {members.map((member) => (
                                                    <tr
                                                        key={member.id}
                                                        className="border-t"
                                                    >
                                                        <td className="p-4">
                                                            {member.fullName}
                                                        </td>

                                                        <td className="p-4">
                                                            {member.email}
                                                        </td>
                                                        <td className="p-4">
                                                            {new Date(member.joinedAt).toLocaleDateString("tr-TR")}
                                                        </td>
                                                        <td className="p-4">
                                                            <button
                                                                onClick={() => removeMember(member.userId)}
                                                                className="rounded-lg bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700"
                                                            >
                                                                Projeden Çıkar
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
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