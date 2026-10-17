export interface AuditLog {
    id: number;
    userId?: number | null;
    action: string;
    entityName: string;
    entityId?: number | null;
    description: string;
    createdAt: string;
}