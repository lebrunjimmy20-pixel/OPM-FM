import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import UserManagement from '../components/settings/UserManagement';
import FacilityConfig from '../components/settings/FacilityConfig';
import Notifications from '../components/settings/Notifications';
import CompanyProfile from '../components/settings/CompanyProfile';
import TuyaConfig from '../components/settings/TuyaConfig';
import { User, Building, Bell, Briefcase, Cpu } from 'lucide-react';

const Settings = () => {
    const location = useLocation();

    const tabs = [
        { name: 'User Management', path: '/settings/users', icon: User },
        { name: 'Facility Config', path: '/settings/facility', icon: Building },
        { name: 'Tuya Integration', path: '/settings/tuya', icon: Cpu },
        { name: 'Notifications', path: '/settings/notifications', icon: Bell },
        { name: 'Company Profile', path: '/settings/company', icon: Briefcase },
    ];

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                <p className="text-gray-500 mt-1">Configure your facility management platform.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Nav */}
                <nav className="lg:w-64 flex-shrink-0 space-y-1">
                    {tabs.map((tab) => {
                        const isActive = location.pathname === tab.path;
                        return (
                            <Link
                                key={tab.path}
                                to={tab.path}
                                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isActive ? 'bg-white text-emerald-600 shadow-sm border border-emerald-100' : 'text-gray-600 hover:bg-emerald-50 hover:text-gray-900'}`}
                            >
                                <tab.icon className={`w-5 h-5 mr-3 ${isActive ? 'text-emerald-600' : 'text-gray-400'}`} />
                                {tab.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* Content Area */}
                <div className="flex-1">
                    <Routes>
                        <Route path="users" element={<UserManagement />} />
                        <Route path="facility" element={<FacilityConfig />} />
                        <Route path="tuya" element={<TuyaConfig />} />
                        <Route path="notifications" element={<Notifications />} />
                        <Route path="company" element={<CompanyProfile />} />
                        <Route path="*" element={<Navigate to="users" replace />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
};

export default Settings;
