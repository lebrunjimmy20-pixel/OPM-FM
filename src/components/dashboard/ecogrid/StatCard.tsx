import clsx from 'clsx';
import { ArrowUpRight, ArrowDownRight, Zap, Leaf } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string;
    trend: number;
    trendLabel: string;
    icon: 'zap' | 'leaf';
    color: 'emerald' | 'blue';
}

const StatCard = ({ title, value, trend, trendLabel, icon, color }: StatCardProps) => {
    const isPositive = trend > 0;

    // Icon mapping
    const Icon = icon === 'zap' ? Zap : Leaf;

    // Color variants - STRICTLY defined based on request
    // Electricity = Green (#10B981)
    // Plants = Light Blue (Keep distinctions)

    const trendColorClass = isPositive ? "text-emerald-600 bg-emerald-50" : "text-red-500 bg-red-50";

    return (
        <div className="relative overflow-hidden rounded-3xl border border-gray-100/70 bg-white p-6 shadow-[0_1px_0_rgba(15,23,42,0.04),0_16px_40px_-28px_rgba(15,23,42,0.38)] min-h-[160px]">
            <div className={clsx(
                "pointer-events-none absolute inset-0 opacity-80",
                color === 'emerald'
                    ? "bg-[radial-gradient(800px_260px_at_12%_0%,rgba(16,185,129,0.14),transparent_62%)]"
                    : "bg-[radial-gradient(800px_260px_at_12%_0%,rgba(59,130,246,0.12),transparent_62%)]"
            )} />

            <div className="relative flex justify-between items-start mb-4">
                <div>
                    <p className="text-gray-600 text-base font-semibold mb-1">{title}</p>
                    <div className="flex items-center gap-3">
                        <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
                        <span className={clsx("px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1", trendColorClass)}>
                            {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                            {Math.abs(trend)}%
                        </span>
                    </div>
                </div>

                <div className={clsx("w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-[0_16px_44px_-24px_rgba(15,23,42,0.45)] transition-transform hover:scale-105",
                    color === 'emerald'
                        ? "bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-[0_22px_54px_-28px_rgba(16,185,129,0.85)]"
                        : "bg-gradient-to-br from-blue-400 to-blue-600 shadow-[0_22px_54px_-28px_rgba(59,130,246,0.65)]"
                )}>
                    <Icon className="w-8 h-8 fill-current" />
                </div>
            </div>

            <div className="relative border-t border-gray-100/60 pt-4 flex items-center justify-between">
                <p className="text-gray-400 text-xs font-medium">
                    <span className="text-gray-900 font-bold">{trendLabel.split(' ')[0]}</span> {trendLabel.split(' ').slice(1).join(' ')}
                </p>

                <ArrowUpRight className="w-4 h-4 text-gray-400" />
            </div>
        </div>
    );
};

export default StatCard;
