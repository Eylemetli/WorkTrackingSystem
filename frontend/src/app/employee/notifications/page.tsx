"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Sidebar";
import api from "@/lib/api";
import { Notification } from "@/types/notification";

export default function EmployeeNotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    async function loadNotifications() {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/notifications");
            setNotifications(response.data);
        } catch {
            setError("Bildirimler alınamadı.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadNotifications();
    }, []);

    async function markAsRead(id: number) {
        try {
            await api.patch(`/notifications/${id}/read`);
            await loadNotifications();
        } catch {
            alert("Bildirim güncellenemedi.");
        }
    }

    return (
        <ProtectedRoute allowedRoles={["Employee"]}>
            <div className="flex min-h-screen bg-gray-100">
                <Sidebar role="Employee" />

                <main className="flex-1 p-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">
                            Bildirimler
                        </h1>

                        <p className="mt-2 text-gray-700">
                            Size gönderilen bildirimleri görüntüleyebilirsiniz.
                        </p>
                    </div>

                    {loading && (
                        <p className="text-gray-700">
                            Bildirimler yükleniyor...
                        </p>
                    )}

                    {error && (
                        <p className="text-red-600">
                            {error}
                        </p>
                    )}

                    {!loading && !error && notifications.length === 0 && (
                        <div className="rounded-xl bg-white p-6 shadow">
                            <p className="text-gray-700">
                                Bildiriminiz bulunmamaktadır.
                            </p>
                        </div>
                    )}

                    {!loading && !error && notifications.length > 0 && (
                        <div className="space-y-4">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`rounded-xl border p-5 shadow-sm ${notification.isRead
                                            ? "bg-white"
                                            : "bg-blue-50"
                                        }`}
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <h2 className="text-lg font-bold text-gray-900">
                                                {notification.title}
                                            </h2>

                                            <p className="mt-2 text-gray-700">
                                                {notification.message}
                                            </p>

                                            <p className="mt-2 text-sm text-gray-500">
                                                {new Date(
                                                    notification.createdAt
                                                ).toLocaleString("tr-TR")}
                                            </p>
                                        </div>

                                        {!notification.isRead && (
                                            <button
                                                onClick={() =>
                                                    markAsRead(notification.id)
                                                }
                                                className="rounded-lg bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700"
                                            >
                                                Okundu İşaretle
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </ProtectedRoute>
    );
}