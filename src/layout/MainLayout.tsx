import { Outlet, useLocation } from 'react-router-dom';
import { useState, type ReactNode, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';
import { Toaster } from 'sonner';
import DemoControl from '../components/DemoControl';

interface MainLayoutProps {
    children?: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();

    // Close sidebar on route change (mobile)
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [location.pathname]);

    return (
        <div className="min-h-screen bg-[#F9F9F9] font-sans">
            <Toaster position="top-right" richColors />
            
            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-20 md:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            
            <div className="md:pl-64 transition-[padding] duration-300">
                <TopNav onMenuClick={() => setIsSidebarOpen(true)} />
                <main className="p-4 md:p-8 pt-20">
                    <div className="mx-auto max-w-[1320px]">
                        <div className="rounded-3xl border border-gray-100/70 bg-[radial-gradient(1200px_600px_at_70%_0%,rgba(16,185,129,0.10),transparent_62%),radial-gradient(900px_500px_at_0%_30%,rgba(15,23,42,0.04),transparent_55%)] p-6 md:p-7">
                            {children || <Outlet />}
                        </div>
                    </div>
                </main>
            </div>
            <DemoControl />
        </div>
    );
};

export default MainLayout;
