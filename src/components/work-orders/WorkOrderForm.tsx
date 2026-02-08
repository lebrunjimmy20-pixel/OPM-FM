import { useMemo, useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import { mockAssets, mockUsers } from '../../mock/workOrders';

interface Props {
    onClose: () => void;
    onSubmit: (data: any) => void;
}

const WorkOrderForm = ({ onClose, onSubmit }: Props) => {
    const [showAISuggestion, setShowAISuggestion] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState('');
    const [suggestedTech, setSuggestedTech] = useState<string | null>(null);

    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('HVAC');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
    const [assignedTo, setAssignedTo] = useState('');

    const recommendedTech = useMemo(
        () => (suggestedTech ? mockUsers.find((u) => u.id === suggestedTech) : undefined),
        [suggestedTech]
    );

    const handleAssetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedAsset(e.target.value);
        // Mock AI suggestion trigger if needed, or manual
    };

    const handleAISuggest = () => {
        setShowAISuggestion(true);
        setTimeout(() => {
            setSuggestedTech(mockUsers.find(u => u.role === 'technician')?.id || null);
        }, 1500);
    };

    const handleCreate = () => {
        onSubmit({
            title,
            category,
            description,
            priority,
            assetId: selectedAsset || undefined,
            assignedToId: assignedTo || undefined,
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">Create Work Order</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Issue Title *</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary"
                            placeholder="e.g. HVAC Unit 3 Making Noise"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Asset</label>
                            <select
                                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary"
                                value={selectedAsset}
                                onChange={handleAssetChange}
                            >
                                <option value="">Select Asset...</option>
                                {mockAssets.map(a => <option key={a.id} value={a.id}>{a.name} ({a.location})</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <select
                                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option value="HVAC">HVAC</option>
                                <option value="Plumbing">Plumbing</option>
                                <option value="Electrical">Electrical</option>
                                <option value="General">General</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                        <textarea
                            className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary h-24"
                            placeholder="Describe the issue in detail..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                        <div className="flex space-x-4">
                            {['low', 'medium', 'high', 'critical'].map(p => (
                                <label key={p} className="flex items-center">
                                    <input
                                        type="radio"
                                        name="priority"
                                        value={p}
                                        checked={priority === p}
                                        onChange={() => setPriority(p as typeof priority)}
                                        className="text-primary focus:ring-primary"
                                    />
                                    <span className="ml-2 capitalize text-sm text-gray-700">{p}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <label className="block text-sm font-medium text-gray-700">Assign Technician</label>
                            <button
                                type="button"
                                onClick={handleAISuggest}
                                className="text-xs flex items-center text-primary font-medium hover:text-green-700"
                            >
                                <Sparkles className="w-3 h-3 mr-1" />
                                AI Suggest
                            </button>
                        </div>

                        {showAISuggestion && !suggestedTech && (
                            <div className="mb-2 p-3 bg-blue-50 text-blue-700 text-sm rounded-lg flex items-center animate-pulse">
                                <Sparkles className="w-4 h-4 mr-2" />
                                Analyzing asset history and technician availability...
                            </div>
                        )}

                        {suggestedTech && (
                            <div className="mb-2 p-3 bg-green-50 border border-green-100 rounded-lg">
                                <div className="flex items-start">
                                    <Sparkles className="w-4 h-4 text-green-600 mt-0.5 mr-2" />
                                    <div>
                                        <p className="text-sm font-medium text-green-800">
                                            Recommendation: {recommendedTech?.name ?? 'Technician'}
                                        </p>
                                        <p className="text-xs text-green-600 mt-1">
                                            Reason: Similar job history + current availability (demo).
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => setAssignedTo(suggestedTech)}
                                            className="mt-2 text-xs bg-white border border-green-200 text-green-700 px-2 py-1 rounded shadow-sm hover:bg-green-50"
                                        >
                                            Accept Recommendation
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        <select
                            className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary"
                            value={assignedTo}
                            onChange={(e) => setAssignedTo(e.target.value)}
                        >
                            <option value="">Unassigned</option>
                            {mockUsers.map(u => <option key={u.id} value={u.id}>{u.name} ({u.role})</option>)}
                        </select>
                    </div>
                </div>

                <div className="p-6 border-t border-gray-100 flex justify-end space-x-3">
                    <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium">Cancel</button>
                    <button
                        type="button"
                        onClick={handleCreate}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-green-800 font-medium"
                    >
                        Create Work Order
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WorkOrderForm;
