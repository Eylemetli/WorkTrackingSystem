export interface AdminReport {
    totalProjects: number;
    activeProjects: number;
    completedProjects: number;

    totalTasks: number;
    pendingTasks: number;
    inProgressTasks: number;
    inReviewTasks: number;
    completedTasks: number;
    overdueTasks: number;

    completionRate: number;
}