"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Sidebar";

export default function EmployeePage() {
    return (
        <ProtectedRoute allowedRoles={["Employee"]}>
            <div className="flex min-h-screen">
                <Sidebar role="Employee" />

                <main className="flex-1 p-8">
                    <h1 className="text-2xl font-bold">
                        Employee Paneli
                    </h1>
                </main>
            </div>
        </ProtectedRoute>
    );
}