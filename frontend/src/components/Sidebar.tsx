"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { logout } from "@/utils/auth";

type Props = {
    role: "Admin" | "Manager" | "Employee";
};

export default function Sidebar({ role }: Props) {
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push("/login");
    };

    return (
        <aside className="flex min-h-screen w-64 flex-col bg-gray-900 p-6 text-white">
            <h2 className="mb-8 text-xl font-bold">
                Work Tracking
            </h2>

            <nav className="flex flex-1 flex-col gap-3">
                {role === "Admin" && (
                    <>
                        <Link href="/admin">Dashboard</Link>
                        <Link href="/admin/users">Kullanıcılar</Link>
                        <Link href="/admin/departments">Departmanlar</Link>
                        <Link href="/admin/projects">Projeler</Link>
                        <Link href="/admin/audit-logs">Sistem Logları</Link>
                    </>
                )}

                {role === "Manager" && (
                    <>
                        <Link href="/manager">Dashboard</Link>
                        <Link href="/manager/projects">Projelerim</Link>
                        <Link href="/manager/tasks">Görevler</Link>
                    </>
                )}

                {role === "Employee" && (
                    <>
                        <Link href="/employee">Dashboard</Link>
                        <Link href="/employee/tasks">Görevlerim</Link>
                        <Link href="/employee/notifications">Bildirimler</Link>
                    </>
                )}
            </nav>

            <button
                onClick={handleLogout}
                className="mt-8 rounded-lg bg-red-600 px-4 py-2"
            >
                Çıkış Yap
            </button>
        </aside>
    );
}