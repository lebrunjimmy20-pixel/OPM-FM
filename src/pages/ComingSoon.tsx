import { ArrowLeft, Bell, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ComingSoonProps {
    title: string;
}

const ComingSoon = ({ title }: ComingSoonProps) => {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-400/20 rounded-full blur-[100px] -z-10 animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-400/20 rounded-full blur-[100px] -z-10 animate-pulse delay-1000" />

            <div className="relative z-10 w-full max-w-2xl px-6 text-center">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 font-semibold text-xs uppercase tracking-wider mb-8 shadow-sm">
                    <Sparkles className="w-3.5 h-3.5 fill-current" />
                    <span>In Development</span>
                </div>

                {/* Main Content */}
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
                    {title}
                </h1>

                <p className="text-lg md:text-xl text-gray-500 mb-10 max-w-lg mx-auto leading-relaxed">
                    We're crafting a powerful new experience to help you manage your sustainability goals even better.
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button className="flex items-center justify-center px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-semibold transition-all shadow-[0_10px_20px_-10px_rgba(5,150,105,0.4)] hover:shadow-[0_20px_40px_-15px_rgba(5,150,105,0.5)] active:scale-95 group w-full sm:w-auto">
                        <Bell className="w-5 h-5 mr-2 group-hover:animate-swing" />
                        Notify Me When Ready
                    </button>

                    <Link
                        to="/"
                        className="flex items-center justify-center px-8 py-4 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-2xl font-semibold transition-all hover:border-gray-300 w-full sm:w-auto"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to Dashboard
                    </Link>
                </div>

                {/* Image Placeholder / Graphic could go here */}
                <div className="mt-16 p-8 bg-white/60 backdrop-blur-xl border border-white/40 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hidden md:block">
                    <div className="h-4 bg-gray-200/50 rounded w-3/4 mx-auto mb-4"></div>
                    <div className="h-4 bg-gray-200/50 rounded w-1/2 mx-auto mb-4"></div>
                    <div className="h-4 bg-gray-200/50 rounded w-2/3 mx-auto"></div>
                </div>
            </div>
        </div>
    );
};

export default ComingSoon;
