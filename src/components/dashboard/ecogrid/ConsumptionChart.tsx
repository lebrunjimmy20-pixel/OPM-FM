import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import { MoreHorizontal } from 'lucide-react';

type CustomBarProps = {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    index?: number;
    opacity?: number;
};

type XAxisTickProps = {
    x?: number;
    y?: number;
    payload?: { value?: string };
};

const data = [
    { name: 'Jan', value: 100 },
    { name: 'Feb', value: 230 },
    { name: 'Mar', value: 350 },
    { name: 'Apr', value: 190 },
    { name: 'May', value: 220 },
    { name: 'Jun', value: 300 },
    { name: 'Jul', value: 140 },
];

const CustomBar = (props: CustomBarProps) => {
    const { x = 0, y = 0, width = 0, height = 0, index = 0, opacity = 1 } = props;
    const gradientId = `greenToWhite-${index}`;
    return (
        <g opacity={opacity}>
            <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity={0.28} />
                    <stop offset="100%" stopColor="#FFFFFF" stopOpacity={0} />
                </linearGradient>
            </defs>
            <rect x={x} y={y} width={width} height={height} rx={10} ry={10} fill={`url(#${gradientId})`} />
            {/* Top Line */}
            <line x1={x} y1={y} x2={x + width} y2={y} stroke="#10B981" strokeWidth={3} strokeLinecap="round" />
        </g>
    );
};

const CustomXAxisTick = ({ x = 0, y = 0, payload }: XAxisTickProps) => {
    const value = payload?.value ?? '';
    const isSelected = value === 'May';
    return (
        <g transform={`translate(${x},${y})`}>
            {isSelected && (
                <rect
                    x={-20}
                    y={-5}
                    width={40}
                    height={28}
                    rx={6}
                    fill="#ECFDF5" // Emerald-50
                />
            )}
            <text
                x={0}
                y={15}
                dy={0}
                textAnchor="middle"
                fill={isSelected ? '#10B981' : '#9CA3AF'}
                fontSize={12}
                fontWeight={isSelected ? 700 : 500}
            >
                {value}
            </text>
        </g>
    );
};

const ConsumptionChart = () => {
    const [focusIndex, setFocusIndex] = useState<number | null>(null);

    return (
        <div className="relative overflow-hidden rounded-3xl border border-gray-100/70 bg-white p-6 shadow-[0_1px_0_rgba(15,23,42,0.04),0_16px_40px_-28px_rgba(15,23,42,0.38)]">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_320px_at_18%_0%,rgba(16,185,129,0.12),transparent_62%)] opacity-80" />

            <div className="relative flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-1 h-6 bg-emerald-500 rounded-full"></div> {/* Accent bar */}
                    <h3 className="text-lg font-bold text-gray-900">Consumption</h3>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center rounded-xl border border-gray-200/70 bg-gray-50/70 p-1 shadow-[0_1px_0_rgba(15,23,42,0.04)]">
                        <button className="px-3 py-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 transition">Weekly</button>
                        <button className="px-3 py-1.5 text-xs font-bold text-emerald-700 bg-white rounded-lg shadow-[0_10px_24px_-18px_rgba(15,23,42,0.35)]">Monthly</button>
                        <button className="px-3 py-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 transition">Yearly</button>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                        <MoreHorizontal className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="relative h-[300px] w-full"> {/* Chart height */}
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        margin={{
                            top: 10,
                            right: 0,
                            left: -20,
                            bottom: 0,
                        }}
                        barCategoryGap={5}
                        onMouseMove={(state) => {
                            if (!state?.isTooltipActive) {
                                setFocusIndex(null);
                                return;
                            }

                            const idx = typeof state.activeTooltipIndex === 'number' ? state.activeTooltipIndex : null;
                            setFocusIndex(idx);
                        }}
                        onMouseLeave={() => setFocusIndex(null)}
                    >
                        {/* Removed global defs for gradient, now handled by CustomBar */}
                        {/* Clean Minimalist Grid */}
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />

                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={<CustomXAxisTick />}
                            dy={10}
                        />

                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 600 }}
                            domain={[0, 500]}
                            tickCount={6} // Creates 0, 100, 200, 300, 400, 500
                        />

                        <Tooltip
                            cursor={{ fill: 'transparent' }}
                            contentStyle={{ borderRadius: '14px', border: '1px solid rgba(226,232,240,0.9)', boxShadow: '0 18px 44px -28px rgba(15,23,42,0.45)', backdropFilter: 'blur(10px)' }}
                        />

                        <Bar
                            dataKey="value"
                            shape={<CustomBar />}
                            animationDuration={1000}
                        >
                            {data.map((_, i) => (
                                <Cell
                                    key={`cell-${i}`}
                                    opacity={focusIndex == null ? 1 : i === focusIndex ? 1 : 0.35}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default ConsumptionChart;
