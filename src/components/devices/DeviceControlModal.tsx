import { useState, useEffect } from 'react';
import { X, Power, Sun, Palette, Loader2, Thermometer, RefreshCw } from 'lucide-react';
import { tuyaService } from '../../services/tuyaService';
import type { TuyaDeviceStatus } from '../../services/tuyaService';

interface DeviceControlModalProps {
    isOpen: boolean;
    onClose: () => void;
    device: {
        id: string;
        name: string;
        tuya_device_id: string;
    };
}

const DeviceControlModal = ({ isOpen, onClose, device }: DeviceControlModalProps) => {
    const [status, setStatus] = useState<TuyaDeviceStatus | null>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    const fetchStatus = async () => {
        setLoading(true);
        try {
            const data = await tuyaService.getDeviceStatus(device.tuya_device_id);
            setStatus(data);
        } catch (error: any) {
            console.error('Error fetching device status:', error);
            const errorMsg = error?.message || 'Unknown error';
            const hint = error?.details?.hint || '';
            const fullMsg = hint ? `${errorMsg}\n\n💡 ${hint}` : errorMsg;
            alert(`Failed to connect to device:\n\n${fullMsg}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen && device.tuya_device_id) {
            fetchStatus();
        }
    }, [isOpen, device.tuya_device_id]);

    const handleToggle = async () => {
        if (!status) return;
        setActionLoading(true);
        try {
            const nextPower = !status.power;
            await tuyaService.controlDevice(device.tuya_device_id, [
                { code: 'switch_led', value: nextPower },
                { code: 'switch_1', value: nextPower }
            ]);
            setStatus({ ...status, power: nextPower });
        } catch (error: any) {
            console.error('Error toggling device:', error);
            alert(`Toggle Failed: ${error.message || 'Unknown error'}`);
        } finally {
            setActionLoading(false);
        }
    };

    const handleBrightness = async (val: number) => {
        if (!status) return;
        try {
            await tuyaService.controlDevice(device.tuya_device_id, [
                { code: 'bright_value_v2', value: Math.round(val * 10) } // Tuya 10-1000
            ]);
            setStatus({ ...status, brightness: val });
        } catch (error) {
            console.error('Error setting brightness:', error);
        }
    };

    const handleWarmth = async (val: number) => {
        if (!status) return;
        try {
            await tuyaService.controlDevice(device.tuya_device_id, [
                { code: 'temp_value_v2', value: (100 - val) * 10 } // Tuya 0(Warm)-1000(Cold). Inverted: val=100(Warm) -> 0
            ]);
            setStatus({ ...status, color_temp: 100 - val });
        } catch (error) {
            console.error('Error setting warmth:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
            <div className="bg-white/80 backdrop-blur-2xl rounded-[40px] shadow-2xl w-full max-w-xl overflow-hidden border border-white/20 animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="relative p-8 pb-4">
                    <button
                        onClick={onClose}
                        className="absolute right-6 top-6 p-2 rounded-full bg-black/5 hover:bg-black/10 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-4">
                        <div className={`p-4 rounded-3xl ${status?.power ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : 'bg-gray-100 text-gray-400'}`}>
                            <Sun className="w-8 h-8" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight">{device.name}</h2>
                            <div className="flex items-center gap-2 mt-1">
                                <div className={`w-2 h-2 rounded-full ${status?.online ? 'bg-emerald-500' : 'bg-red-500'}`} />
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                                    {status?.online ? 'Connected' : 'Offline'}
                                </span>
                                <button onClick={fetchStatus} className="p-1 hover:rotate-180 transition-transform duration-500">
                                    <RefreshCw className="w-3 h-3 text-gray-400" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-8 space-y-8">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
                            <p className="text-sm font-bold text-gray-400 tracking-widest uppercase animate-pulse">Communicating with Tuya Cloud...</p>
                        </div>
                    ) : (
                        <>
                            {/* Power Section */}
                            <div className="flex flex-col items-center justify-center py-4">
                                <button
                                    onClick={handleToggle}
                                    disabled={actionLoading}
                                    className={`relative group w-32 h-32 rounded-full border-8 transition-all duration-500 flex items-center justify-center ${status?.power ? 'border-emerald-100 bg-emerald-500 text-white shadow-2xl shadow-emerald-200' : 'border-gray-50 bg-gray-100 text-gray-400'}`}
                                >
                                    <Power className="w-12 h-12" />
                                    <div className={`absolute -inset-4 rounded-full border border-emerald-500/20 animate-ping opacity-20 ${status?.power ? 'block' : 'hidden'}`} />
                                </button>
                                <span className={`mt-6 text-sm font-black tracking-[0.2em] uppercase ${status?.power ? 'text-emerald-600' : 'text-gray-400'}`}>
                                    {status?.power ? 'POWER ON' : 'POWER OFF'}
                                </span>
                            </div>

                            {/* Controls Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
                                {/* Brightness */}
                                <div className="p-6 bg-gray-50/50 rounded-[32px] border border-gray-100">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <Sun className="w-4 h-4 text-emerald-600" />
                                            <span className="text-xs font-black uppercase tracking-widest text-gray-400">Brightness</span>
                                        </div>
                                        <span className="text-sm font-black text-gray-900">{status?.brightness || 0}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={status?.brightness || 0}
                                        onChange={(e) => setStatus({ ...status!, brightness: parseInt(e.target.value) })}
                                        onMouseUp={(e) => handleBrightness(parseInt((e.target as any).value))}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-500 hover:accent-emerald-600 transition-all"
                                    />
                                </div>

                                {/* Color Temp / Warmth */}
                                <div className="p-6 bg-gray-50/50 rounded-[32px] border border-gray-100">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <Thermometer className="w-4 h-4 text-orange-500" />
                                            <span className="text-xs font-black uppercase tracking-widest text-gray-400">Warmth</span>
                                        </div>
                                        <span className="text-sm font-black text-gray-900">{status?.color_temp !== undefined ? 100 - status.color_temp : 0}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={status?.color_temp !== undefined ? 100 - status.color_temp : 0}
                                        onChange={(e) => setStatus({ ...status!, color_temp: 100 - parseInt(e.target.value) })}
                                        onMouseUp={(e) => handleWarmth(parseInt((e.target as any).value))}
                                        className="w-full h-2 bg-gradient-to-r from-blue-100 via-white to-orange-100 rounded-lg appearance-none cursor-pointer accent-orange-400 hover:accent-orange-500 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Color Palette (Mock) */}
                            <div className="p-6 bg-gray-50/50 rounded-[32px] border border-gray-100">
                                <div className="flex items-center gap-2 mb-4">
                                    <Palette className="w-4 h-4 text-purple-500" />
                                    <span className="text-xs font-black uppercase tracking-widest text-gray-400">Quick Colors</span>
                                </div>
                                <div className="flex justify-between gap-3">
                                    {['#FFFBCC', '#FFD5B8', '#B8E1FF', '#C7FFB8', '#FFB8EF'].map((c) => (
                                        <button
                                            key={c}
                                            className="w-12 h-12 rounded-2xl shadow-sm border-4 border-white transition-transform hover:scale-110 active:scale-95"
                                            style={{ backgroundColor: c }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DeviceControlModal;
