"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Sidebar";
import api from "@/lib/api";
import { Project } from "@/types/project";
import Link from "next/link";

export default function ManagerProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    async function loadProjects() {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/manager/projects");

            setProjects(response.data);
        } catch {
            setError("Projeler alınamadı.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadProjects();
    }, []);

    return (
        <ProtectedRoute allowedRoles={["Manager"]}>
            <div className="flex min-h-screen bg-gray-100">
                <Sidebar role="Manager" />

                <main className="flex-1 p-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">
                            Projelerim
                        </h1>

                        <p className="mt-2 text-gray-700">
                            Yöneticisi olduğunuz projeleri görüntüleyebilirsiniz.
                        </p>
                    </div>

                    {loading && (
                        <p className="text-gray-700">
                            Projeler yükleniyor...
                        </p>
                    )}

                    {error && (
                        <p className="text-red-600">
                            {error}
                        </p>
                    )}

                    {!loading && !error && projects.length === 0 && (
                        <div className="rounded-xl bg-white p-6 shadow">
                            <p className="text-gray-700">
                                Size atanmış bir proje bulunmamaktadır.
                            </p>
                        </div>
                    )}

                    {!loading && !error && projects.length > 0 && (
                        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                            {projects.map((project) => (
                                <Link
                                    key={project.id}
                                    href={`/manager/projects/${project.id}`}
                                    className="block rounded-xl bg-white p-6 shadow transition hover:shadow-lg"
                                >
                                    <h2 className="text-xl font-bold text-gray-900">
                                        {project.name}
                                    </h2>

                                    <p className="mt-2 text-gray-700">
                                        {project.description || "Açıklama bulunmuyor."}
                                    </p>

                                    <div className="mt-5 space-y-2 text-sm text-gray-700">
                                        <p>
                                            <span className="font-semibold">
                                                Başlangıç:
                                            </span>{" "}
                                            {new Date(
                                                project.startDate
                                            ).toLocaleDateString("tr-TR")}
                                        </p>

                                        <p>
                                            <span className="font-semibold">
                                                Bitiş:
                                            </span>{" "}
                                            {project.endDate
                                                ? new Date(
                                                    project.endDate
                                                ).toLocaleDateString("tr-TR")
                                                : "-"}
                                        </p>

                                        <p>
                                            <span className="font-semibold">
                                                Durum:
                                            </span>{" "}
                                            {project.status}
                                        </p>

                                        <p>
                                            <span className="font-semibold">
                                                Aktiflik:
                                            </span>{" "}
                                            {project.isActive ? "Aktif" : "Pasif"}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </ProtectedRoute>
    );
}