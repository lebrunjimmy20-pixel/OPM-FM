import { MoreHorizontal, ArrowUpRight, AlertTriangle, Sparkles, Leaf } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import clsx from 'clsx';

// Widget 1: Healthy Environment Gauge
const GaugeWidget = () => {
    // Matching the "Blue" reference: Fewer, pill-shaped segments
    const totalSegments = 15;
    const filledSegments = Math.round(totalSegments * 0.72); // 72%

    // Create data for dashed effect
    const data = Array.from({ length: totalSegments }, (_, i) => ({
        name: i,
        value: 1,
        // First 72% are green, rest are gray
        color: i < filledSegments ? '#10B981' : '#F3F4F6'
    }));

    return (
        <div className="relative overflow-hidden rounded-3xl border border-gray-100/70 bg-white p-6 shadow-[0_1px_0_rgba(15,23,42,0.04),0_16px_40px_-28px_rgba(15,23,42,0.38)] flex flex-col h-[290px]">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_320px_at_18%_0%,rgba(16,185,129,0.12),transparent_62%)] opacity-75" />

            <div className="relative flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <span className="text-emerald-500"><Leaf className="w-5 h-5" /></span>
                    Healthy Environment
                </h3>
                <MoreHorizontal className="w-5 h-5 text-gray-400 cursor-pointer" />
            </div>

            <div className="relative flex-1 flex items-center justify-center">
                {/* Text centered visually within the arch */}
                <div className="pointer-events-none absolute left-1/2 top-[66%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center text-center">
                    <span className="text-4xl font-bold text-gray-900 tracking-tight leading-none">72%</span>
                    <span className="text-base text-emerald-600 font-semibold mt-2 leading-none">On track</span>
                </div>

                <div className="w-full h-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="80%"
                                startAngle={190}
                                endAngle={-10}
                                innerRadius={85}
                                outerRadius={135}
                                paddingAngle={6}
                                dataKey="value"
                                cornerRadius={40} // Max roundness
                                stroke="none"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

// Widget 2: Automation Alerts
const AlertsWidget = () => {
    const alerts = [
        { id: 1, text: "High Electricity Spike Detected", badge: "Critical", badgeColor: "red" },
        { id: 2, text: "Water Flow Anomaly in Cooling Unit", badge: "Warning", badgeColor: "yellow" },
        { id: 3, text: "Gas Leak Risk Identified", badge: "Info", badgeColor: "blue" },
    ];

    return (
        <div className="relative overflow-hidden rounded-3xl border border-gray-100/70 bg-white p-6 shadow-[0_1px_0_rgba(15,23,42,0.04),0_16px_40px_-28px_rgba(15,23,42,0.38)] h-[340px] flex flex-col">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_320px_at_18%_0%,rgba(16,185,129,0.08),transparent_62%)] opacity-80" />

            <div className="relative flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <span className="text-emerald-500"><AlertTriangle className="w-5 h-5" /></span>
                    Automation Alerts
                </h3>
                <MoreHorizontal className="w-5 h-5 text-gray-400 cursor-pointer" />
            </div>

            <div className="relative space-y-6 flex-1 overflow-y-auto pr-1 custom-scrollbar">
                {alerts.map(alert => (
                    <div key={alert.id} className="flex items-start gap-4">
                        <div className="mt-1 p-2 bg-emerald-50 rounded-xl text-emerald-500 shrink-0 border border-emerald-100">
                            <AlertTriangle className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-base font-bold text-gray-900 leading-snug mb-2">{alert.text}</p>
                            <span className={clsx("text-[11px] uppercase tracking-widest px-2.5 py-1 rounded-md font-bold border",
                                alert.badgeColor === 'red' && "bg-red-50 text-red-600 border-red-100",
                                alert.badgeColor === 'yellow' && "bg-amber-50 text-amber-600 border-amber-100",
                                alert.badgeColor === 'blue' && "bg-blue-50 text-blue-600 border-blue-100",
                            )}>
                                {alert.badge}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Widget 3: AI Recommendation
const AIWidget = () => {
    return (
        <div className="relative overflow-hidden rounded-3xl border border-emerald-100/70 bg-white p-8 shadow-[0_1px_0_rgba(15,23,42,0.04),0_16px_40px_-28px_rgba(15,23,42,0.38)] h-[340px] flex flex-col">
            <div className="absolute inset-0 bg-[radial-gradient(900px_360px_at_20%_0%,rgba(16,185,129,0.20),transparent_65%),radial-gradient(900px_360px_at_90%_30%,rgba(16,185,129,0.10),transparent_58%),linear-gradient(to_bottom,rgba(255,255,255,0.85),rgba(255,255,255,1))] z-0" />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-emerald-100/35 via-emerald-50/15 to-transparent z-0" />

            <div className="relative z-10 flex items-center justify-between mb-8">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-emerald-600" />
                    AI Recommendation
                </h3>
                <MoreHorizontal className="w-5 h-5 text-gray-400 cursor-pointer" />
            </div>

            <div className="relative z-10 flex-1 flex flex-col items-center text-center justify-center pb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-700 rounded-2xl flex items-center justify-center shadow-[0_22px_54px_-28px_rgba(16,185,129,0.85)] mb-6 transform hover:scale-105 transition-transform duration-300">
                    <Sparkles className="w-8 h-8 text-white" />
                </div>

                <h4 className="text-2xl font-bold text-gray-900 mb-3">Auto Energy Saving</h4>
                <p className="text-sm text-gray-500 mb-5 max-w-[240px] leading-relaxed font-medium">
                    Optimize energy consumption based on real-time data analysis.
                </p>

                <button className="flex items-center gap-2 text-sm font-bold text-emerald-700 hover:text-emerald-900 transition-colors group px-4 py-2.5 rounded-xl bg-white/70 border border-emerald-100/70 shadow-[0_12px_30px_-22px_rgba(15,23,42,0.45)] hover:shadow-[0_18px_44px_-28px_rgba(15,23,42,0.55)] hover:-translate-y-0.5 backdrop-blur-sm">
                    Try Now
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
            </div>
        </div>
    );
};

export { GaugeWidget, AlertsWidget, AIWidget };
