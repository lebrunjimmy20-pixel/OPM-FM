import { useState } from 'react';
import { Home, Zap, Monitor, Target, BarChart2, Settings, HelpCircle, ChevronRight, Search, ChevronDown, Users } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import ReferralModal from './ReferralModal';

const Sidebar = () => {
    const location = useLocation();
    const [isEnergyOpen, setIsEnergyOpen] = useState(true);
    const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);

    const isActive = (path: string) => {
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path);
    };

    return (
        <div className="h-screen w-64 bg-white/90 border-r border-gray-100 flex flex-col fixed left-0 top-0 overflow-hidden font-sans z-20 backdrop-blur-sm">
            {/* Logo Section */}
            <div className="px-6 pt-10 pb-6">
                <div className="w-full flex items-center overflow-visible pr-[5px]">
                    <img src="/logo.png" alt="OPM.FM Logo" className="w-full h-auto object-contain" />
                </div>
            </div>

            {/* Search Section */}
            <div className="px-6 pb-6 pt-2">
                <div className="relative group">
                    <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-500 group-focus-within:text-emerald-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full bg-gray-50/80 backdrop-blur-sm border border-gray-100 rounded-2xl pl-12 pr-4 py-3 text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all shadow-sm group-hover:shadow-md"
                    />
                    <div className="absolute right-4 top-3.5 flex items-center space-x-1 opacity-50">
                        <span className="text-xs text-gray-500 font-medium">⌘K</span>
                    </div>
                </div>
            </div>

            <div className="px-6 py-2">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-2">Home</p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
                <Link
                    to="/"
                    className={`flex items-center px-4 py-3.5 text-base font-bold rounded-xl transition-all relative overflow-hidden group ${isActive('/')
                        ? 'text-emerald-700 bg-white shadow-[0_4px_20px_-10px_rgba(16,185,129,0.3)] border border-emerald-50/50'
                        : 'text-gray-600 hover:bg-gray-50'
                        }`}
                >
                    <div className="absolute inset-0 bg-emerald-50/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Home className={`w-5 h-5 mr-3 relative z-10 ${isActive('/') ? 'text-emerald-600' : 'text-gray-400'}`} />
                    <span className="relative z-10">Dashboard</span>
                </Link>

                {/* Energy Section */}
                <div>
                    <button
                        onClick={() => setIsEnergyOpen(!isEnergyOpen)}
                        className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium text-gray-600 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                        <div className="flex items-center">
                            <Zap className="w-5 h-5 mr-3 text-gray-400" />
                            Energy
                        </div>
                        {isEnergyOpen ? (
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                        ) : (
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                        )}
                    </button>

                    {isEnergyOpen && (
                        <div className="ml-4 pl-4 border-l border-gray-100 space-y-1 mt-1 mb-2">
                            <Link to="/electricity" className={`block px-4 py-2 text-sm rounded-lg transition-colors ${isActive('/electricity') ? 'text-emerald-700 font-bold bg-emerald-50/50' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>Electricity Usage</Link>
                            <Link to="/water-consumption" className={`block px-4 py-2 text-sm rounded-lg transition-colors ${isActive('/water-consumption') ? 'text-emerald-700 font-bold bg-emerald-50/50' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>Water Consumption</Link>
                            <Link to="/gas-tracking" className={`block px-4 py-2 text-sm rounded-lg transition-colors ${isActive('/gas-tracking') ? 'text-emerald-700 font-bold bg-emerald-50/50' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>Gas Flow Tracking</Link>
                        </div>
                    )}
                </div>

                <Link to="/devices" className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-xl transition-colors ${isActive('/devices') ? 'text-emerald-700 font-bold bg-emerald-50' : 'text-gray-600 hover:bg-gray-50'}`}>
                    <Monitor className={`w-5 h-5 mr-3 ${isActive('/devices') ? 'text-emerald-600' : 'text-gray-400'}`} />
                    Devices & Sensors
                </Link>

                <div className="pt-6 px-2">
                    <p className="text-xs font-medium text-gray-400 mb-2">Reports</p>
                </div>

                <Link to="/sustainability-goals" className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-xl transition-colors ${isActive('/sustainability-goals') ? 'text-emerald-700 font-bold bg-emerald-50' : 'text-gray-600 hover:bg-gray-50'}`}>
                    <Target className={`w-5 h-5 mr-3 ${isActive('/sustainability-goals') ? 'text-emerald-600' : 'text-gray-400'}`} />
                    Sustainability Goals
                </Link>

                <Link
                    to="/reports"
                    className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-xl transition-all ${isActive('/reports') ? 'text-emerald-700 font-bold bg-emerald-50' : 'text-gray-600 hover:bg-gray-50'
                        }`}
                >
                    <BarChart2 className={`w-5 h-5 mr-3 ${isActive('/reports') ? 'text-emerald-600' : 'text-gray-400'}`} />
                    Reports & Insights
                </Link>
            </nav>

            {/* Bottom Section */}
            <div className="p-4 space-y-1">
                <Link to="/settings" className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-xl transition-colors ${isActive('/settings') ? 'text-emerald-700 font-bold bg-emerald-50' : 'text-gray-600 hover:bg-gray-50'}`}>
                    <Settings className={`w-5 h-5 mr-3 ${isActive('/settings') ? 'text-emerald-600' : 'text-gray-400'}`} />
                    Settings
                </Link>
                <Link to="/help" className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-xl transition-colors ${isActive('/help') ? 'text-emerald-700 font-bold bg-emerald-50' : 'text-gray-600 hover:bg-gray-50'}`}>
                    <HelpCircle className={`w-5 h-5 mr-3 ${isActive('/help') ? 'text-emerald-600' : 'text-gray-400'}`} />
                    Help & Support
                </Link>

                {/* Referral Card */}
                <div
                    onClick={() => setIsReferralModalOpen(true)}
                    className="mt-4 relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 p-4 text-white shadow-[0_20px_60px_-32px_rgba(16,185,129,0.85),0_18px_44px_-28px_rgba(15,23,42,0.45)] hover:shadow-[0_26px_70px_-36px_rgba(16,185,129,0.90),0_22px_52px_-32px_rgba(15,23,42,0.50)] transition-all cursor-pointer group hover:-translate-y-1"
                >
                    <div className="absolute inset-0 bg-[radial-gradient(500px_200px_at_20%_0%,rgba(255,255,255,0.28),transparent_60%),radial-gradient(500px_220px_at_90%_40%,rgba(255,255,255,0.12),transparent_55%)] opacity-90" />
                    <div className="absolute inset-0 bg-white/5 group-hover:bg-white/10 transition-colors" />

                    <div className="relative z-10">
                        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mb-3 text-white backdrop-blur-sm">
                            <Users className="w-5 h-5" />
                        </div>
                        <h3 className="font-semibold text-sm mb-1">Refer us a client</h3>
                        <p className="text-xs text-emerald-50/90 mb-0">Grow our network</p>

                        <div className="absolute bottom-4 right-4 text-white opacity-80 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                            <ChevronRight className="w-5 h-5" />
                        </div>
                    </div>
                </div>
            </div>

            <ReferralModal isOpen={isReferralModalOpen} onClose={() => setIsReferralModalOpen(false)} />
        </div>
    );
};

export default Sidebar;
