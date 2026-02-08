export type Priority = 'low' | 'medium' | 'high' | 'critical';
export type Status = 'open' | 'assigned' | 'in_progress' | 'completed' | 'overdue';

export interface User {
    id: string;
    name: string;
    role: 'admin' | 'manager' | 'technician';
    avatar?: string;
    email?: string;
}

export interface Asset {
    id: string;
    name: string;
    category: string;
    location: string;
    qrCode?: string;
    status: 'active' | 'down' | 'maintenance';
}

export interface WorkOrder {
    id: string;
    title: string;
    description: string;
    priority: Priority;
    status: Status;
    category: string;
    asset?: Asset;
    location: string;
    assignedTo?: User;
    dueDate: Date;
    createdAt: Date;
    checklist?: { id: number; task: string; completed: boolean }[];
    comments?: { id: number; user: string; text: string; timestamp: Date }[];
}
