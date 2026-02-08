import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip } from 'recharts';
import { Clock, AlertCircle } from 'lucide-react';

interface Props {
    data: any;
}

const MaintenanceOperations = ({ data }: Props) => {
    const wo = data.workOrders;

    const pieData = [
        { name: 'Open', value: wo.open, color: '#9CA3AF' }, // Gray
        { name: 'In Progress', value: wo.inProgress, color: '#F59E0B' }, // Amber
        { name: 'Completed', value: wo.completed, color: '#10B981' }, // Green
        { name: 'Overdue', value: wo.overdue, color: '#EF4444' }, // Red
    ];

    const barData = [
        { name: 'Planned', value: data.plannedVsReactive.planned, fill: '#10B981' },
        { name: 'Reactive', value: data.plannedVsReactive.reactive, fill: '#EF4444' },
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            {/* Work Order Status Cards */}
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Work Order Status</h3>
                <div className="flex items-center">
                    <div className="h-40 w-40 flex-shrink-0 relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={40}
                                    outerRadius={60}
                                    paddingAngle={2}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center flex-col">
                            <span className="text-2xl font-bold text-gray-800">{wo.total}</span>
                            <span className="text-xs text-gray-500">Total</span>
                        </div>
                    </div>
                    <div className="ml-8 grid grid-cols-2 gap-x-8 gap-y-4 flex-1">
                        {pieData.map((item) => (
                            <div key={item.name} className="flex items-center justify-between">
                                <div className="flex items-center text-sm text-gray-600">
                                    <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }} />
                                    {item.name}
                                </div>
                                <span className="font-semibold">{item.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Planned vs Reactive */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Planned vs Reactive</h3>
                <div className="h-40">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={barData} layout="vertical" barSize={20}>
                            <XAxis type="number" hide />
                            <YAxis dataKey="name" type="category" width={70} tick={{ fontSize: 12 }} interval={0} />
                            <RechartsTooltip />
                            <Bar dataKey="value" radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="text-center text-xs text-gray-400 mt-2">Target: 70% Planned</div>
            </div>

            {/* MTTR & Backlog */}
            <div className="space-y-6">
                {/* MTTR */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase">MTTR</h3>
                        <Clock className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex items-end items-baseline">
                        <span className="text-3xl font-bold text-gray-900">{data.mttr.value}</span>
                        <span className="ml-1 text-sm text-gray-500">hrs</span>
                    </div>
                    <p className={`text-sm mt-1 ${data.mttr.trend < 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {data.mttr.trend > 0 ? '+' : ''}{data.mttr.trend} hrs vs last month
                    </p>
                </div>

                {/* Backlog */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase">Backlog Depth</h3>
                        <AlertCircle className="w-5 h-5 text-red-500" />
                    </div>
                    <div className="flex items-end items-baseline">
                        <span className="text-3xl font-bold text-gray-900">{data.backlog}</span>
                        <span className="ml-1 text-sm text-gray-500">tickets</span>
                    </div>
                    <p className="text-sm mt-1 text-red-600 font-medium">18 Overdue</p>
                </div>
            </div>
        </div>
    );
};

export default MaintenanceOperations;
