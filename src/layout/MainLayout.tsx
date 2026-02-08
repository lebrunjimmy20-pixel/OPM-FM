import { Outlet } from 'react-router-dom';
import type { ReactNode } from 'react';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';
import { Toaster } from 'sonner';
import DemoControl from '../components/DemoControl';

interface MainLayoutProps {
    children?: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
    return (
        <div className="min-h-screen bg-[#F9F9F9] font-sans">
            <Toaster position="top-right" richColors />
            <Sidebar />
            <div className="pl-64">
                <TopNav />
                <main className="p-8 pt-20">
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
