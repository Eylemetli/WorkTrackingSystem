"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Sidebar";
import api from "@/lib/api";
import { AuditLog } from "@/types/audit-log";

export default function AdminAuditLogsPage() {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    async function loadLogs() {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/admin/audit-logs");
            setLogs(response.data);
        } catch {
            setError("Audit log kayıtları alınamadı.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadLogs();
    }, []);

    return (
        <ProtectedRoute allowedRoles={["Admin"]}>
            <div className="flex min-h-screen bg-gray-100">
                <Sidebar role="Admin" />

                <main className="flex-1 p-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">
                            Audit Log
                        </h1>

                        <p className="mt-2 text-gray-700">
                            Sistem üzerinde gerçekleştirilen önemli işlemleri görüntüleyebilirsiniz.
                        </p>
                    </div>

                    {loading && (
                        <p className="text-gray-700">
                            Kayıtlar yükleniyor...
                        </p>
                    )}

                    {error && (
                        <p className="text-red-600">
                            {error}
                        </p>
                    )}

                    {!loading && !error && logs.length === 0 && (
                        <div className="rounded-xl bg-white p-6 shadow">
                            <p className="text-gray-700">
                                Audit log kaydı bulunmamaktadır.
                            </p>
                        </div>
                    )}

                    {!loading && !error && logs.length > 0 && (
                        <div className="overflow-x-auto rounded-xl bg-white shadow">
                            <table className="w-full text-left">
                                <thead className="border-b bg-gray-100 text-gray-900">
                                    <tr>
                                        <th className="p-4">ID</th>
                                        <th className="p-4">İşlem</th>
                                        <th className="p-4">Entity</th>
                                        <th className="p-4">Entity ID</th>
                                        <th className="p-4">Açıklama</th>
                                        <th className="p-4">Kullanıcı ID</th>
                                        <th className="p-4">Tarih</th>
                                    </tr>
                                </thead>

                                <tbody className="text-gray-800">
                                    {logs.map((log) => (
                                        <tr
                                            key={log.id}
                                            className="border-b last:border-b-0"
                                        >
                                            <td className="p-4">
                                                {log.id}
                                            </td>

                                            <td className="p-4 font-medium">
                                                {log.action}
                                            </td>

                                            <td className="p-4">
                                                {log.entityName}
                                            </td>

                                            <td className="p-4">
                                                {log.entityId ?? "-"}
                                            </td>

                                            <td className="p-4">
                                                {log.description}
                                            </td>

                                            <td className="p-4">
                                                {log.userId ?? "-"}
                                            </td>

                                            <td className="p-4">
                                                {new Date(log.createdAt).toLocaleString("tr-TR")}
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