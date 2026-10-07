"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getRole, getToken } from "@/utils/auth";

type Props = {
    children: ReactNode;
    allowedRoles: string[];
};

export default function ProtectedRoute({
    children,
    allowedRoles,
}: Props) {
    const router = useRouter();

    useEffect(() => {
        const token = getToken();
        const role = getRole();

        if (!token) {
            router.replace("/login");
            return;
        }

        if (!role || !allowedRoles.includes(role)) {
            router.replace("/login");
        }
    }, [allowedRoles, router]);

    return <>{children}</>;
}