import type { WorkOrder, Priority, Status, User, Asset } from '../types';
import { addDays, subDays } from 'date-fns';

export const mockUsers: User[] = [
    { id: 'u1', name: 'John Doe', role: 'manager', avatar: 'JD' },
    { id: 'u2', name: 'Mike Smith', role: 'technician', avatar: 'MS' },
    { id: 'u3', name: 'Sarah Connor', role: 'technician', avatar: 'SC' },
    { id: 'u4', name: 'Alex Murphy', role: 'admin', avatar: 'AM' },
];

export const mockAssets: Asset[] = [
    { id: 'a1', name: 'HVAC Unit 3', category: 'HVAC', location: 'Roof', status: 'active' },
    { id: 'a2', name: 'Main Elevator', category: 'Elevator', location: 'Lobby', status: 'maintenance' },
    { id: 'a3', name: 'Server Rack A', category: 'IT', location: 'Server Room', status: 'active' },
    { id: 'a4', name: 'Water Pump 2', category: 'Plumbing', location: 'Basement', status: 'down' },
];

export const generateWorkOrders = (count: number): WorkOrder[] => {
    const priorities: Priority[] = ['low', 'medium', 'high', 'critical'];
    const statuses: Status[] = ['open', 'assigned', 'in_progress', 'completed', 'overdue'];
    const categories = ['HVAC', 'Plumbing', 'Electrical', 'General', 'Safety'];

    return Array.from({ length: count }).map((_, i) => ({
        id: `WO-${1000 + i}`,
        title: `Maintenance Request ${1000 + i}`,
        description: 'Routine maintenance check and inspection required for proper operation.',
        priority: priorities[Math.floor(Math.random() * priorities.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        category: categories[Math.floor(Math.random() * categories.length)],
        location: `Building ${Math.floor(Math.random() * 3) + 1}, Floor ${Math.floor(Math.random() * 5)}`,
        assignedTo: Math.random() > 0.3 ? mockUsers[Math.floor(Math.random() * mockUsers.length)] : undefined,
        asset: Math.random() > 0.2 ? mockAssets[Math.floor(Math.random() * mockAssets.length)] : undefined,
        createdAt: subDays(new Date(), Math.floor(Math.random() * 30)),
        dueDate: addDays(new Date(), Math.floor(Math.random() * 10)),
        checklist: [
            { id: 1, task: 'Inspect initial condition', completed: true },
            { id: 2, task: 'Check safety guards', completed: false },
            { id: 3, task: 'Clean and lubricate', completed: false },
        ],
    }));
};
