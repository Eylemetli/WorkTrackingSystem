export interface Project {
    id: number;
    name: string;
    description?: string | null;
    managerId: number;
    managerName: string;
    startDate: string;
    endDate?: string | null;
    status: string;
    isActive: boolean;
}