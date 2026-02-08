import { Zap, Activity, TrendingUp, Search, MoreHorizontal, ArrowUpRight, ArrowDownRight, RefreshCw, Building2, ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

interface DeviceConsumption {
    id: string;
    device_id: string;
    current_usage_kw: number;
    daily_total_kwh: number;
    peak_usage_kw: number;
    last_reading: string;
    devices: {
        name: string;
        type: string;
        location: string;
        building: string;
        status: string;
    };
}

const ElectricityUsage = () => {
    const [consumption, setConsumption] = useState<DeviceConsumption[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBuilding, setSelectedBuilding] = useState<'Aquablu' | "Jimmy's Home">('Aquablu');
    const [isBuildingDropdownOpen, setIsBuildingDropdownOpen] = useState(false);
    const buildingRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchConsumption();

        // Subscribe to real-time updates
        const subscription = supabase
            .channel('electricity_usage_realtime')
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'electricity_consumption' }, (payload) => {
                setConsumption(prev => prev.map(item =>
                    item.id === payload.new.id ? { ...item, ...payload.new } : item
                ));
            })
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (buildingRef.current && !buildingRef.current.contains(event.target as Node)) {
                setIsBuildingDropdownOpen(false);
            }
        };

        if (isBuildingDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isBuildingDropdownOpen]);

    const fetchConsumption = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('electricity_consumption')
            .select(`
                *,
                devices (
                    name,
                    type,
                    location,
                    building,
                    status
                )
            `)
            .order('current_usage_kw', { ascending: false });

        if (error) {
            console.error('Error fetching consumption:', error);
            return;
        }

        if (data) {
            setConsumption(data as any);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchConsumption();
    }, [selectedBuilding]);

    const filteredDevices = consumption.filter(item => {
        const matchesSearch = item.devices.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.devices.location.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filter === 'all' || item.devices.type.toLowerCase() === filter.toLowerCase();
        const matchesBuilding = item.devices.building === selectedBuilding;
        return matchesSearch && matchesFilter && matchesBuilding;
    });

    const totalCurrentUsage = consumption.reduce((acc, curr) => acc + Number(curr.current_usage_kw), 0);
    const totalDailyKwh = consumption.reduce((acc, curr) => acc + Number(curr.daily_total_kwh), 0);

    return (
        <div className="space-y-6">
            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Zap className="w-24 h-24 text-emerald-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Total Current Load</p>
                    <div className="flex items-end gap-2">
                        <h3 className="text-3xl font-black text-gray-900">{totalCurrentUsage.toFixed(2)}</h3>
                        <span className="text-lg font-bold text-gray-400 mb-1">kW</span>
                    </div>
                    <div className="mt-4 flex items-center text-emerald-600 text-sm font-bold">
                        <Activity className="w-4 h-4 mr-1 animate-pulse" />
                        Live Real-time Data
                    </div>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                    <p className="text-sm font-medium text-gray-500 mb-1">Daily Consumption</p>
                    <div className="flex items-end gap-2">
                        <h3 className="text-3xl font-black text-gray-900">{totalDailyKwh.toFixed(1)}</h3>
                        <span className="text-lg font-bold text-gray-400 mb-1">kWh</span>
                    </div>
                    <div className="mt-4 flex items-center text-emerald-600 text-sm font-bold">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        +4.2% from yesterday
                    </div>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                    <p className="text-sm font-medium text-gray-500 mb-1">Peak Demand</p>
                    <div className="flex items-end gap-2">
                        <h3 className="text-3xl font-black text-gray-900">42.8</h3>
                        <span className="text-lg font-bold text-gray-400 mb-1">kW</span>
                    </div>
                    <p className="mt-4 text-xs text-gray-400 font-medium italic">Peak reached today at 11:42 AM</p>
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search devices or locations..."
                        className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto pb-2 md:pb-0">
                    {/* Building Dropdown - Moved outside of overflow-x-auto */}
                    <div className="relative" ref={buildingRef}>
                        <button
                            onClick={() => setIsBuildingDropdownOpen(!isBuildingDropdownOpen)}
                            className="flex items-center gap-3 px-6 py-3 bg-white border border-gray-100 rounded-2xl font-bold text-sm text-gray-700 shadow-sm transition-all hover:shadow-md hover:bg-gray-50 building-dropdown-trigger"
                        >
                            <Building2 className="w-5 h-5 text-emerald-600" />
                            <span>{selectedBuilding}</span>
                            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isBuildingDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isBuildingDropdownOpen && (
                            <div className="absolute right-0 mt-3 w-64 bg-white rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden text-left">
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

                    {/* Filter Tags - Keep overflow-x-auto for these on small screens if needed */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">

                        {['All', 'HVAC', 'Lighting', 'Sensor', 'Power'].map((t) => (
                            <button
                                key={t}
                                onClick={() => setFilter(t.toLowerCase())}
                                className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${filter === t.toLowerCase()
                                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200/50'
                                    : 'bg-white text-gray-600 border border-gray-200 hover:border-emerald-200'
                                    }`}
                            >
                                {t}
                            </button>
                        ))}
                        <button
                            onClick={fetchConsumption}
                            className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                        >
                            <RefreshCw className={`w-4 h-4 text-gray-500 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Device Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    Array(6).fill(0).map((_, i) => (
                        <div key={i} className="bg-white rounded-[32px] p-6 border border-gray-100 animate-pulse">
                            <div className="h-4 bg-gray-100 rounded w-1/2 mb-4"></div>
                            <div className="h-8 bg-gray-100 rounded w-1/4 mb-6"></div>
                            <div className="space-y-2">
                                <div className="h-3 bg-gray-50 rounded w-full"></div>
                                <div className="h-3 bg-gray-50 rounded w-full"></div>
                            </div>
                        </div>
                    ))
                ) : filteredDevices.length > 0 ? (
                    filteredDevices.map((item) => (
                        <div key={item.id} className="bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <span className="inline-flex items-center px-2 py-1 rounded-lg bg-gray-50 text-[10px] font-black uppercase tracking-wider text-gray-500 mb-2">
                                        {item.devices.type}
                                    </span>
                                    <h4 className="text-lg font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
                                        {item.devices.name}
                                    </h4>
                                    <p className="text-xs text-gray-400 font-medium">{item.devices.location} • {item.devices.building}</p>
                                </div>
                                <button className="p-2 hover:bg-gray-50 rounded-xl transition-colors">
                                    <MoreHorizontal className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>

                            <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-50">
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Current Usage</p>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-2xl font-black text-gray-900">{Number(item.current_usage_kw).toFixed(2)}</span>
                                        <span className="text-xs font-bold text-gray-500">kW</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Efficiency</p>
                                    <div className={`flex items-center justify-end text-sm font-black ${Number(item.current_usage_kw) < 2 ? 'text-emerald-600' : 'text-orange-500'}`}>
                                        {Number(item.current_usage_kw) < 2 ? <ArrowDownRight className="w-4 h-4 mr-0.5" /> : <ArrowUpRight className="w-4 h-4 mr-0.5" />}
                                        {Number(item.current_usage_kw) < 2 ? 'Optimal' : 'High Load'}
                                    </div>
                                </div>
                            </div>

                            {/* Mini Progress Bar */}
                            <div className="mt-4 h-1.5 w-full bg-gray-50 rounded-full overflow-hidden">
                                <div
                                    className={`h-full transition-all duration-1000 ${Number(item.current_usage_kw) < 2 ? 'bg-emerald-500' : 'bg-orange-500'
                                        }`}
                                    style={{ width: `${Math.min((Number(item.current_usage_kw) / 5) * 100, 100)}%` }}
                                ></div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Zap className="w-8 h-8 text-gray-300" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">No devices found</h3>
                        <p className="text-gray-500">Try adjusting your search or filters.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ElectricityUsage;
