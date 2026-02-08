import { create } from 'zustand';
import type { WorkOrder } from '../types';
import { generateWorkOrders } from '../mock/workOrders';

interface DashboardMetrics {
    workOrders: {
        total: number;
        open: number;
        inProgress: number;
        completed: number;
        overdue: number;
    };
    mttr: { value: number; trend: number; };
    plannedVsReactive: { planned: number; reactive: number; };
    backlog: number;
    assets: { hvac: number; elevators: number; plumbing: number; electrical: number; };
    compliance: { statutory: number; incidents: number; };
    occupancy: { utilization: number; visitorsToday: number; };
}

interface AppState {
    workOrders: WorkOrder[];
    metrics: DashboardMetrics;

    // Actions
    addWorkOrder: (wo: WorkOrder) => void;
    updateWorkOrder: (id: string, updates: Partial<WorkOrder>) => void;
    setMetrics: (metrics: Partial<DashboardMetrics> | ((prev: DashboardMetrics) => Partial<DashboardMetrics>)) => void;
    generateInitialData: () => void;
}

const initialMetrics: DashboardMetrics = {
    workOrders: { total: 142, open: 45, inProgress: 28, completed: 62, overdue: 7 },
    mttr: { value: 4.2, trend: -0.3 },
    plannedVsReactive: { planned: 65, reactive: 35 },
    backlog: 18,
    assets: { hvac: 99.2, elevators: 98.5, plumbing: 99.8, electrical: 99.9 },
    compliance: { statutory: 94, incidents: 127 },
    occupancy: { utilization: 76, visitorsToday: 142 },
};

export const useStore = create<AppState>((set) => ({
    workOrders: [],
    metrics: initialMetrics,

    generateInitialData: () => {
        set({ workOrders: generateWorkOrders(20) });
    },

    addWorkOrder: (wo) => set((state) => {
        const newMetrics = { ...state.metrics };
        newMetrics.workOrders.total += 1;
        newMetrics.workOrders[wo.status === 'in_progress' ? 'inProgress' : wo.status as keyof typeof newMetrics.workOrders] += 1;
        newMetrics.backlog += 1;

        return {
            workOrders: [wo, ...state.workOrders],
            metrics: newMetrics
        };
    }),

    updateWorkOrder: (id, updates) => set((state) => {
        const updatedOrders = state.workOrders.map(o => o.id === id ? { ...o, ...updates } : o);
        // Recalculate metrics (simplified)
        // Ideally we would do smart diffing, but for mock demo this is fine.
        return { workOrders: updatedOrders };
    }),

    setMetrics: (updater) => set((state) => {
        const newMetrics = typeof updater === 'function' ? updater(state.metrics) : updater;
        return { metrics: { ...state.metrics, ...newMetrics } };
    }),
}));
