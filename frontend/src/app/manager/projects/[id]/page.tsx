"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Sidebar";
import api from "@/lib/api";
import { Project } from "@/types/project";

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

    useEffect(() => {
        async function loadProject() {
            try {
                setLoading(true);
                setError("");

                const response = await api.get(`/manager/projects/${id}`);

                setProject(response.data);

                const membersResponse = await api.get(`/projects/${id}/members`);
                setMembers(membersResponse.data);
            } catch {
                setError("Proje detayı alınamadı.");
            } finally {
                setLoading(false);
            }
        }

        if (id) {
            loadProject();
        }
    }, [id]);

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