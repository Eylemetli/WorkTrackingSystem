"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Sidebar";

export default function ManagerPage() {
    return (
        <ProtectedRoute allowedRoles={["Manager"]}>
            <div className="flex min-h-screen">
                <Sidebar role="Manager" />

                <main className="flex-1 p-8">
                    <h1 className="text-2xl font-bold">
                        Manager Paneli
                    </h1>
                </main>
            </div>
        </ProtectedRoute>
    );
}