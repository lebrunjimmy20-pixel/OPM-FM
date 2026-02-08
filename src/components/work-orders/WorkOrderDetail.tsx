import { useState } from 'react';
import type { WorkOrder } from '../../types';
import { X, CheckSquare, MessageSquare, Camera, History, MapPin, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

interface Props {
    order: WorkOrder;
    onClose: () => void;
}

const WorkOrderDetail: React.FC<Props> = ({ order, onClose }) => {
    const [activeTab, setActiveTab] = useState<'overview' | 'checklist' | 'comments' | 'history'>('overview');

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
            <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                {/* Header */}
                <div className="p-6 border-b border-gray-200 flex items-start justify-between bg-gray-50">
                    <div>
                        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-1">
                            <span>{order.id}</span>
                            <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                            <span className="capitalize">{order.status.replace('_', ' ')}</span>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">{order.title}</h2>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200 px-6">
                    {[
                        { id: 'overview', label: 'Overview', icon: AlertCircle },
                        { id: 'checklist', label: 'Checklist', icon: CheckSquare },
                        { id: 'comments', label: 'Comments', icon: MessageSquare },
                        { id: 'history', label: 'History', icon: History },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center py-4 px-4 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        >
                            <tab.icon className="w-4 h-4 mr-2" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {activeTab === 'overview' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase">Priority</label>
                                    <p className="font-medium capitalize">{order.priority}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase">Due Date</label>
                                    <p className="font-medium">{format(order.dueDate, 'MMM d, yyyy h:mm a')}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase">Assigned To</label>
                                    <div className="flex items-center mt-1">
                                        {order.assignedTo ? (
                                            <>
                                                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary mr-2">
                                                    {order.assignedTo.avatar}
                                                </div>
                                                <span className="text-sm font-medium">{order.assignedTo.name}</span>
                                            </>
                                        ) : <span className="text-sm text-gray-400">Unassigned</span>}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase">Location</label>
                                    <div className="flex items-center mt-1 text-sm">
                                        <MapPin className="w-4 h-4 text-gray-400 mr-1" />
                                        {order.location}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase block mb-2">Description</label>
                                <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100">
                                    {order.description}
                                </p>
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase block mb-2">Photos</label>
                                <div className="grid grid-cols-3 gap-2">
                                    <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center border border-dashed border-gray-300">
                                        <Camera className="w-6 h-6 text-gray-400" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'checklist' && (
                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-gray-900">Maintenance Checklist</h3>
                            {order.checklist && order.checklist.map((item) => (
                                <label key={item.id} className="flex items-start p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                                    <input type="checkbox" defaultChecked={item.completed} className="mt-1 h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary" />
                                    <span className="ml-3 text-sm text-gray-700">{item.task}</span>
                                </label>
                            ))}
                        </div>
                    )}

                    {activeTab === 'comments' && (
                        <div className="flex flex-col h-full">
                            <div className="flex-1 space-y-4">
                                <div className="flex items-start">
                                    <div className="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0 mr-3" />
                                    <div className="bg-gray-100 p-3 rounded-tr-lg rounded-br-lg rounded-bl-lg">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs font-bold text-gray-700">John Doe</span>
                                            <span className="text-xs text-gray-400">2 hrs ago</span>
                                        </div>
                                        <p className="text-sm text-gray-600">Please check the wiring diagram before proceeding.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-200">
                                <textarea className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary text-sm" rows={3} placeholder="Add a comment..."></textarea>
                                <div className="flex justify-end mt-2">
                                    <button className="px-3 py-1.5 bg-primary text-white text-sm font-medium rounded-md hover:bg-green-800">Post Comment</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
                    <span className="text-xs text-gray-500">SLA: <span className="font-medium text-green-600">On Track</span></span>
                    <div className="space-x-2">
                        {order.status !== 'completed' && (
                            <button className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-green-800">Mark Completed</button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WorkOrderDetail;
