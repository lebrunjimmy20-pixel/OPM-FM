import { useEffect } from 'react';
import { useStore } from '../store/useStore';

export const useDashboardData = () => {
    const metrics = useStore((state) => state.metrics);
    const setMetrics = useStore((state) => state.setMetrics);

    useEffect(() => {
        const interval = setInterval(() => {
            setMetrics((prev) => {
                // Subtle randomization to simulate live updates
                const randomChange = (val: number, range: number = 2) => {
                    const change = Math.floor(Math.random() * range * 2 + 1) - range;
                    return Math.max(0, val + change);
                };

                return {
                    workOrders: {
                        ...prev.workOrders,
                        open: randomChange(prev.workOrders.open, 1),
                        inProgress: randomChange(prev.workOrders.inProgress, 1),
                        completed: prev.workOrders.completed + (Math.random() > 0.8 ? 1 : 0),
                    },
                    occupancy: {
                        ...prev.occupancy,
                        visitorsToday: prev.occupancy.visitorsToday + (Math.random() > 0.7 ? 1 : 0),
                    },
                };
            });
        }, 10000); // Live updates

        return () => clearInterval(interval);
    }, [setMetrics]);

    return metrics;
};
