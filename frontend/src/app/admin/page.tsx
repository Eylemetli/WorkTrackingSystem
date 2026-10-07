"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Sidebar";

export default function AdminPage() {
    return (
        <ProtectedRoute allowedRoles={["Admin"]}>
            <div className="flex min-h-screen">
                <Sidebar role="Admin" />

                <main className="flex-1 p-8">
                    <h1 className="text-2xl font-bold">
                        Admin Paneli
                    </h1>

                    <p className="mt-2 text-gray-600">
                        Sistem yönetim ekranına hoş geldiniz.
                    </p>
                </main>
            </div>
        </ProtectedRoute>
    );
}