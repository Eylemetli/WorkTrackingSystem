export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    department?: string | null;
    isActive: boolean;
    createdAt: string;
}