import { Bell, Calendar, Download, User, Settings, LogOut, UserRoundPen, ChevronDown, Menu } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './auth/AuthContext';

interface TopNavProps {
    onMenuClick?: () => void;
}

const TopNav = ({ onMenuClick }: TopNavProps) => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const getPageTitle = () => {
        const path = location.pathname;
        if (path === '/') return 'Dashboard';
        if (path === '/work-orders') return 'Work Orders';
        if (path === '/schedule') return 'Maintenance Schedule';
        if (path === '/billing') return 'Billing';
        if (path.startsWith('/assets')) return 'Assets';
        if (path === '/devices') return 'Devices & Sensors';
        if (path === '/electricity') return 'Electricity Usage';
        if (path === '/iot') return 'IoT Management';
        if (path === '/reports') return 'Reports & Insights';
        if (path === '/help') return 'Help & Support';
        if (path === '/settings') return 'Settings';
        if (path === '/profile') return 'Profile';
        return 'OPM.FM';
    };

    const fullName = user?.user_metadata?.full_name || 'User';
    const email = user?.email || '';
    const avatarUrl = user?.user_metadata?.avatar_url;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        };

        if (isProfileOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isProfileOpen]);

    const handleLogout = async () => {
        await signOut();
        setIsProfileOpen(false);
        navigate('/login');
    };

    return (
        <header className="fixed top-0 right-0 left-0 md:left-64 z-10 h-16 bg-transparent border-none font-sans transition-[left] duration-300">
            <div className="mx-auto flex h-full w-full max-w-[1320px] items-center justify-between px-4 md:px-8">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onMenuClick}
                        className="md:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100/50 rounded-lg transition-colors"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <h1 className="text-xl font-black tracking-tight text-gray-900">{getPageTitle()}</h1>
                </div>

                <div className="flex items-center space-x-4">
                    <button className="hidden md:flex items-center space-x-2 px-4 py-2 bg-white/90 hover:bg-white border border-gray-200/70 rounded-xl text-sm font-semibold text-gray-700 transition shadow-[0_1px_0_rgba(15,23,42,0.04),0_12px_32px_-18px_rgba(15,23,42,0.28)] hover:shadow-[0_1px_0_rgba(15,23,42,0.04),0_18px_44px_-22px_rgba(15,23,42,0.32)] backdrop-blur-sm">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span>Mon, 7 July 2025</span>
                        <ChevronDown className="w-4 h-4 text-gray-400 ml-2" />
                    </button>

                    <button className="hidden md:flex items-center space-x-2 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold shadow-[0_14px_40px_-18px_rgba(16,185,129,0.85),0_10px_18px_-14px_rgba(15,23,42,0.35)] hover:shadow-[0_20px_52px_-22px_rgba(16,185,129,0.90),0_14px_24px_-18px_rgba(15,23,42,0.38)] transition hover:-translate-y-0.5">
                        <Download className="w-4 h-4" />
                        <span>Export</span>
                    </button>

                    <button className="p-2.5 rounded-xl border border-gray-200/70 text-gray-500 bg-white/90 hover:bg-white hover:text-gray-700 focus:outline-none transition relative shadow-[0_1px_0_rgba(15,23,42,0.04),0_12px_32px_-18px_rgba(15,23,42,0.28)] hover:shadow-[0_1px_0_rgba(15,23,42,0.04),0_18px_44px_-22px_rgba(15,23,42,0.32)] backdrop-blur-sm">
                        <Bell className="h-5 w-5" />
                        <span className="absolute top-2 right-2.5 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                    </button>

                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="ml-2 flex items-center space-x-2 focus:outline-none group"
                        >
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center transition-all overflow-hidden ${isProfileOpen ? 'border-emerald-500 ring-4 ring-emerald-500/10 shadow-lg' : 'border-white shadow-[0_1px_0_rgba(15,23,42,0.04),0_12px_32px_-18px_rgba(15,23,42,0.28)] hover:shadow-[0_1px_0_rgba(15,23,42,0.04),0_18px_44px_-22px_rgba(15,23,42,0.32)]'} ${avatarUrl ? 'bg-white' : 'bg-gray-200'}`}>
                                {avatarUrl ? (
                                    <img
                                        src={avatarUrl}
                                        alt="User"
                                        className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                ) : (
                                    <User className="w-5 h-5 text-gray-500" />
                                )}
                            </div>
                        </button>

                        {/* Profile Dropdown */}
                        {isProfileOpen && (
                            <div className="absolute right-0 mt-3 w-64 bg-white/95 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1),0_0_0_1px_rgba(0,0,0,0.02)] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                                <div className="px-5 py-4 border-b border-gray-50 bg-gray-50/50">
                                    <p className="text-sm font-bold text-gray-900 truncate">{fullName}</p>
                                    <p className="text-xs text-gray-500 font-medium truncate">{email}</p>
                                </div>

                                <div className="p-2">
                                    <Link
                                        to="/profile"
                                        className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-600 hover:text-emerald-700 hover:bg-emerald-50/50 rounded-xl transition-all group"
                                        onClick={() => setIsProfileOpen(false)}
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-gray-50 group-hover:bg-emerald-100/50 flex items-center justify-center transition-colors">
                                            <UserRoundPen className="w-4 h-4 text-gray-400 group-hover:text-emerald-600" />
                                        </div>
                                        Edit Profile
                                    </Link>

                                    <Link
                                        to="/settings"
                                        className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-600 hover:text-emerald-700 hover:bg-emerald-50/50 rounded-xl transition-all group"
                                        onClick={() => setIsProfileOpen(false)}
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-gray-50 group-hover:bg-emerald-100/50 flex items-center justify-center transition-colors">
                                            <Settings className="w-4 h-4 text-gray-400 group-hover:text-emerald-600" />
                                        </div>
                                        Settings
                                    </Link>
                                </div>

                                <div className="p-2 border-t border-gray-50">
                                    <button
                                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition-all group"
                                        onClick={handleLogout}
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-red-50 group-hover:bg-red-100 flex items-center justify-center transition-colors">
                                            <LogOut className="w-4 h-4 text-red-500" />
                                        </div>
                                        Log out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default TopNav;
