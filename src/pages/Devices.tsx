import { useState, useEffect } from 'react';
import { Search, Filter, MoreVertical, Wifi, WifiOff, MapPin, Activity, Calendar, Loader2, Trash2, X, Building2, ChevronDown } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { formatDistanceToNow } from 'date-fns';
import DeviceFormModal from '../components/devices/DeviceFormModal';
import DeleteConfirmationModal from '../components/common/DeleteConfirmationModal';
import DeviceControlModal from '../components/devices/DeviceControlModal';

interface Device {
    id: string;
    name: string;
    type: string;
    location: string;
    status: 'online' | 'offline';
    building: string;
    last_updated: string;
    tuya_device_id?: string;
    is_tuya?: boolean;
}

const Devices = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [devices, setDevices] = useState<Device[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [filterStatus, setFilterStatus] = useState<'all' | 'online' | 'offline'>('all');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
    const [selectedBuilding, setSelectedBuilding] = useState<'Aquablu' | "Jimmy's Home">('Aquablu');
    const [isBuildingDropdownOpen, setIsBuildingDropdownOpen] = useState(false);

    // Control Modal State
    const [isControlModalOpen, setIsControlModalOpen] = useState(false);
    const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

    // Delete Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deviceToDelete, setDeviceToDelete] = useState<Device | null>(null);

    const fetchDevices = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('devices')
                .select('*')
                .eq('building', selectedBuilding)
                .order('last_updated', { ascending: false });

            if (error) {
                console.error('Error fetching devices:', error);
            } else {
                setDevices(data as Device[]);
            }
        } catch (error) {
            console.error('Unexpected error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDevices();
        // Reset table states when building changes
        setActiveMenuId(null);
        setFilterStatus('all');
    }, [selectedBuilding]);

    const handleAddDevice = async (data: {
        name: string;
        type: string;
        location: string;
        building: string;
        tuya_device_id?: string;
        is_tuya?: boolean;
    }) => {
        const status = Math.random() > 0.2 ? 'online' : 'offline'; // 80% chance of online
        const { error } = await supabase.from('devices').insert([{
            ...data,
            status,
            last_updated: new Date().toISOString()
        }]);

        if (error) {
            console.error('Error creating device:', error);
            alert('Failed to create device');
        } else {
            await fetchDevices();
        }
    };

    const handleDeleteDevice = async (id: string) => {
        const { error } = await supabase.from('devices').delete().eq('id', id);

        if (error) {
            console.error('Error deleting device:', error);
            alert('Failed to delete device');
        } else {
            setDevices(prev => prev.filter(d => d.id !== id));
            setActiveMenuId(null);
        }
    };

    const filteredDevices = devices.filter(device => {
        const matchesSearch =
            device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            device.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
            device.location.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter = filterStatus === 'all' || device.status === filterStatus;

        return matchesSearch && matchesFilter;
    });

    // Close menus when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (activeMenuId && !(event.target as Element).closest('.action-menu-trigger')) {
                setActiveMenuId(null);
            }
            if (isFilterOpen && !(event.target as Element).closest('.filter-menu-trigger')) {
                setIsFilterOpen(false);
            }
            if (isBuildingDropdownOpen && !(event.target as Element).closest('.building-dropdown-trigger')) {
                setIsBuildingDropdownOpen(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [activeMenuId, isFilterOpen]);


    return (
        <div className="max-w-7xl mx-auto font-sans relative">
            <DeviceFormModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSubmit={handleAddDevice}
            />

            {selectedDevice && (
                <DeviceControlModal
                    isOpen={isControlModalOpen}
                    onClose={() => {
                        setIsControlModalOpen(false);
                        setSelectedDevice(null);
                    }}
                    device={{
                        id: selectedDevice.id,
                        name: selectedDevice.name,
                        tuya_device_id: selectedDevice.tuya_device_id || ''
                    }}
                />
            )}

            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setDeviceToDelete(null);
                }}
                onConfirm={() => {
                    if (deviceToDelete) {
                        handleDeleteDevice(deviceToDelete.id);
                    }
                }}
                title="Delete Device"
                description="Are you sure you want to permanently delete this device? This action cannot be undone."
                itemName={deviceToDelete?.name}
            />

            {/* Title Section */}
            <div className="mb-8">
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">Devices & Sensors</h1>
                <p className="text-gray-500 mt-1 font-medium">Monitor and manage all building IoT devices.</p>
            </div>

            {/* Header / Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search devices..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-white border border-gray-100 text-gray-700 text-sm rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 block w-72 pl-12 py-3.5 shadow-sm transition-all hover:bg-gray-50 focus:bg-white font-medium"
                        />
                    </div>

                    <div className="relative">
                        <button
                            onClick={(e) => { e.stopPropagation(); setIsFilterOpen(!isFilterOpen); }}
                            className={`flex items-center px-6 py-3.5 border rounded-2xl font-bold text-sm shadow-sm transition-all hover:shadow-md filter-menu-trigger ${filterStatus !== 'all' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-gray-100 bg-white text-gray-600 hover:bg-gray-50'}`}
                        >
                            <Filter className="w-4 h-4 mr-2" />
                            {filterStatus === 'all' ? 'Filter' : filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)}
                            {filterStatus !== 'all' && (
                                <X
                                    className="w-3.5 h-3.5 ml-2 hover:bg-emerald-200 rounded-full"
                                    onClick={(e) => { e.stopPropagation(); setFilterStatus('all'); setIsFilterOpen(false); }}
                                />
                            )}
                        </button>

                        {isFilterOpen && (
                            <div className="absolute left-0 mt-3 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-30 animate-in fade-in slide-in-from-top-2 duration-200">
                                <button
                                    onClick={() => { setFilterStatus('all'); setIsFilterOpen(false); }}
                                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 flex items-center font-bold ${filterStatus === 'all' ? 'text-emerald-600 bg-emerald-50/50' : 'text-gray-700'}`}
                                >
                                    All Devices
                                </button>
                                <button
                                    onClick={() => { setFilterStatus('online'); setIsFilterOpen(false); }}
                                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 flex items-center font-bold ${filterStatus === 'online' ? 'text-emerald-600 bg-emerald-50/50' : 'text-gray-700'}`}
                                >
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></div>
                                    Online Only
                                </button>
                                <button
                                    onClick={() => { setFilterStatus('offline'); setIsFilterOpen(false); }}
                                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 flex items-center font-bold ${filterStatus === 'offline' ? 'text-emerald-600 bg-emerald-50/50' : 'text-gray-700'}`}
                                >
                                    <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                                    Offline Only
                                </button>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center px-6 py-3.5 bg-emerald-600 text-white rounded-2xl hover:bg-emerald-700 font-bold text-sm shadow-[0_14px_40px_-18px_rgba(16,185,129,0.5)] transition-all hover:shadow-[0_20px_52px_-22px_rgba(16,185,129,0.6)] hover:-translate-y-0.5"
                    >
                        <Activity className="w-4 h-4 mr-2" />
                        Add Device
                    </button>
                </div>

                {/* Building Dropdown Aligned Right */}
                <div className="relative">
                    <button
                        onClick={(e) => { e.stopPropagation(); setIsBuildingDropdownOpen(!isBuildingDropdownOpen); }}
                        className="flex items-center gap-3 px-6 py-3.5 bg-white border border-gray-100 rounded-2xl font-bold text-sm text-gray-700 shadow-sm transition-all hover:shadow-md hover:bg-gray-50 building-dropdown-trigger"
                    >
                        <Building2 className="w-5 h-5 text-emerald-600" />
                        <span>{selectedBuilding}</span>
                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isBuildingDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isBuildingDropdownOpen && (
                        <div className="absolute right-0 mt-3 w-64 bg-white rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 py-2 z-30 animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden">
                            <div className="px-5 py-3 border-b border-gray-50 mb-1">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Select Property</p>
                            </div>
                            {['Aquablu', "Jimmy's Home"].map((building) => (
                                <button
                                    key={building}
                                    onClick={() => { setSelectedBuilding(building as any); setIsBuildingDropdownOpen(false); }}
                                    className={`w-full text-left px-5 py-3.5 text-sm hover:bg-emerald-50 flex items-center transition-colors font-bold ${selectedBuilding === building ? 'text-emerald-700 bg-emerald-50/50' : 'text-gray-600'}`}
                                >
                                    <Building2 className={`w-4 h-4 mr-3 ${selectedBuilding === building ? 'text-emerald-600' : 'text-gray-400'}`} />
                                    {building}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Table Card */}
            <div className="bg-white rounded-[32px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col min-h-[600px]">
                {loading ? (
                    <div className="flex-1 flex items-center justify-center">
                        <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
                    </div>
                ) : (
                    <>
                        <div className="flex-1 overflow-x-auto custom-scrollbar">
                            <table className="w-full text-sm text-left text-gray-600">
                                <thead className="text-[10px] text-gray-400 uppercase bg-gray-50/50 border-b border-gray-50 font-black tracking-[0.1em]">
                                    <tr>
                                        <th scope="col" className="px-8 py-5">Device Name</th>
                                        <th scope="col" className="px-8 py-5">Type</th>
                                        <th scope="col" className="px-8 py-5">Location</th>
                                        <th scope="col" className="px-8 py-5">Status</th>
                                        <th scope="col" className="px-8 py-5">Last Updated</th>
                                        <th scope="col" className="px-8 py-5 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {filteredDevices.map((device) => (
                                        <tr
                                            key={device.id}
                                            className="bg-white hover:bg-emerald-50/30 transition-colors group cursor-pointer"
                                            onClick={() => {
                                                if (device.is_tuya) {
                                                    setSelectedDevice(device);
                                                    setIsControlModalOpen(true);
                                                }
                                            }}
                                        >
                                            <td className="px-8 py-5 font-bold text-gray-900">
                                                <div className="flex items-center">
                                                    <div className={`p-2.5 rounded-xl mr-4 transition-colors ${device.status === 'online' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-400'}`}>
                                                        {device.status === 'online' ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5" />}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span>{device.name}</span>
                                                        {device.is_tuya && (
                                                            <span className="text-[9px] font-black text-emerald-600 flex items-center gap-1 mt-0.5 tracking-widest uppercase">
                                                                <Activity className="w-2.5 h-2.5" /> CLOUD LINKED
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-gray-50 text-gray-500 border border-gray-100">
                                                    {device.type}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex items-center text-gray-500 font-medium">
                                                    <MapPin className="w-4 h-4 mr-2 text-gray-300" />
                                                    {device.location}
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex items-center">
                                                    <div className={`h-2.5 w-2.5 rounded-full mr-3 ${device.status === 'online' ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]' : 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.3)]'}`}></div>
                                                    <span className={`font-bold text-sm ${device.status === 'online' ? 'text-emerald-700' : 'text-red-700'}`}>
                                                        {device.status === 'online' ? 'ACTIVE' : 'OFFLINE'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-gray-500 font-medium">
                                                <div className="flex items-center">
                                                    <Calendar className="w-4 h-4 mr-2 text-gray-300" />
                                                    {formatDistanceToNow(new Date(device.last_updated), { addSuffix: true })}
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-right relative">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setActiveMenuId(activeMenuId === device.id ? null : device.id);
                                                    }}
                                                    className="action-menu-trigger text-gray-300 hover:text-emerald-600 p-2 hover:bg-emerald-50 rounded-xl transition-all"
                                                >
                                                    <MoreVertical className="w-5 h-5" />
                                                </button>

                                                {activeMenuId === device.id && (
                                                    <div className="absolute right-12 top-10 w-40 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-20 animate-in fade-in zoom-in-95 duration-100 overflow-hidden">
                                                        <button
                                                            onClick={() => {
                                                                setDeviceToDelete(device);
                                                                setIsDeleteModalOpen(true);
                                                                setActiveMenuId(null);
                                                            }}
                                                            className="w-full text-left px-4 py-3 text-xs font-bold text-red-600 hover:bg-red-50 flex items-center transition-colors"
                                                        >
                                                            <Trash2 className="w-4 h-4 mr-3" />
                                                            DELETE DEVICE
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredDevices.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="px-8 py-24 text-center">
                                                <div className="flex flex-col items-center justify-center">
                                                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                                        <Search className="w-10 h-10 text-gray-200" />
                                                    </div>
                                                    <p className="text-gray-900 font-bold text-lg">No devices found</p>
                                                    <p className="text-gray-500 mt-1">Try adjusting your search or building filter.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Footer - Sticks to Bottom */}
                        <div className="mt-auto border-t border-gray-50 px-8 py-6 bg-gray-50/10 backdrop-blur-sm flex items-center justify-between">
                            <span className="text-sm text-gray-500 font-medium">
                                Showing <span className="font-bold text-gray-900">1</span> to <span className="font-bold text-gray-900">{filteredDevices.length}</span> of <span className="font-bold text-gray-900">{devices.length}</span> results
                            </span>
                            <div className="flex items-center gap-3">
                                <button className="px-5 py-2.5 text-sm font-bold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm">Previous</button>
                                <button className="px-5 py-2.5 text-sm font-bold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm">Next</button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Devices;
