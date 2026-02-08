import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import type { WorkOrder } from '../types';
import WorkOrderTable from '../components/work-orders/WorkOrderTable';
import WorkOrderForm from '../components/work-orders/WorkOrderForm';
import WorkOrderDetail from '../components/work-orders/WorkOrderDetail';
import { Plus, Filter, Download } from 'lucide-react';

const WorkOrders = () => {
    const { workOrders, addWorkOrder, generateInitialData } = useStore();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<WorkOrder | null>(null);

    useEffect(() => {
        if (workOrders.length === 0) {
            generateInitialData();
        }
    }, [workOrders.length, generateInitialData]);

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Work Orders</h1>
                    <p className="text-gray-500 mt-1">Manage and track maintenance tasks.</p>
                </div>
                <div className="flex items-center space-x-3">
                    <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 font-medium">
                        <Filter className="w-4 h-4 mr-2" />
                        Filter
                    </button>
                    <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 font-medium">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                    </button>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-green-800 font-medium shadow-sm transition-colors"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Create New
                    </button>
                </div>
            </div>

            {/* Content */}
            <WorkOrderTable orders={workOrders} onSelect={setSelectedOrder} />

            {/* Modals */}
            {isCreateModalOpen && (
                <WorkOrderForm
                    onClose={() => setIsCreateModalOpen(false)}
                    onSubmit={(data) => {
                        // Needs better form handling logic to match types, but for demo:
                        const newOrder: WorkOrder = {
                            id: `WO-${Date.now()}`,
                            title: data.title || 'New Work Order',
                            description: data.description || '',
                            priority: data.priority || 'medium',
                            status: 'open',
                            category: data.category || 'General',
                            location: 'Main Building',
                            createdAt: new Date(),
                            dueDate: new Date(),
                        };
                        addWorkOrder(newOrder);
                        setIsCreateModalOpen(false);
                    }}
                />
            )}

            {selectedOrder && (
                <WorkOrderDetail
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                />
            )}
        </div>
    );
};

export default WorkOrders;
