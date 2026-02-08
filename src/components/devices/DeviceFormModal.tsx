import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';

interface DeviceFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: {
        name: string;
        type: string;
        location: string;
        building: string;
        tuya_device_id?: string;
        is_tuya?: boolean;
    }) => Promise<void>;
}

const DEVICE_TYPES = [
    'HVAC',
    'Thermostat',
    'Lighting',
    'Sensor',
    'Security',
    'Power',
    'Access Control',
    'Elevator',
    'Irrigation',
    'Appliance',
    'Other'
];

const BUILDINGS = ['Aquablu', "Jimmy's Home"];

const DeviceFormModal = ({ isOpen, onClose, onSubmit }: DeviceFormModalProps) => {
    const [name, setName] = useState('');
    const [type, setType] = useState(DEVICE_TYPES[0]);
    const [location, setLocation] = useState('');
    const [building, setBuilding] = useState(BUILDINGS[0]);
    const [tuyaId, setTuyaId] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onSubmit({
                name,
                type,
                location,
                building,
                tuya_device_id: tuyaId || undefined,
                is_tuya: !!tuyaId
            });
            // Reset form
            setName('');
            setType(DEVICE_TYPES[0]);
            setLocation('');
            setBuilding(BUILDINGS[0]);
            setTuyaId('');
            onClose();
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900">Add New Device</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Device Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                            placeholder="e.g., Main HVAC Unit"
                        />
                    </div>

                    <div>
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                            Device Type
                        </label>
                        <select
                            id="type"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                        >
                            {DEVICE_TYPES.map((t) => (
                                <option key={t} value={t}>
                                    {t}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="building" className="block text-sm font-medium text-gray-700 mb-1">
                            Building / Property
                        </label>
                        <select
                            id="building"
                            value={building}
                            onChange={(e) => setBuilding(e.target.value as any)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                        >
                            {BUILDINGS.map((b) => (
                                <option key={b} value={b}>
                                    {b}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                            Location
                        </label>
                        <input
                            type="text"
                            id="location"
                            required
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                            placeholder="e.g., Rooftop, Lobby"
                        />
                    </div>

                    {(type === 'Lighting' || type === 'Sensor' || type === 'Appliance') && (
                        <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 animate-in slide-in-from-top-2 duration-200">
                            <label htmlFor="tuya_id" className="block text-[10px] font-black text-emerald-700 uppercase tracking-widest mb-2">
                                Tuya Device ID (Optional)
                            </label>
                            <input
                                type="text"
                                id="tuya_id"
                                value={tuyaId}
                                onChange={(e) => setTuyaId(e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-emerald-200 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 transition-colors font-medium text-sm"
                                placeholder="Enter Tuya ID to enable cloud control"
                            />
                            <p className="text-[10px] text-emerald-600 mt-2 font-medium opacity-70 italic">
                                * Linking this will enable real-time control via Tuya Cloud.
                            </p>
                        </div>
                    )}

                    <div className="pt-4 flex items-center justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-emerald-200"
                        >
                            {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Create Device
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DeviceFormModal;
