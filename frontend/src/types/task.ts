export interface Task {
    id: number;
    title: string;
    description?: string | null;
    projectId: number;
    projectName: string;
    assignedUserId: number;
    assignedUserName: string;
    priority: string;
    status: string;
    dueDate?: string | null;
    createdAt: string;
}