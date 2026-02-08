import { ShieldCheck, AlertTriangle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface Props {
    data: any;
}

const ComplianceSafety = ({ data }: Props) => {
    const hazards = [
        { id: 1, type: 'Slip Hazard', location: 'Lobby', status: 'Open' },
        { id: 2, type: 'Exposed Wire', location: 'Server Room', status: 'Resolved' },
        { id: 3, type: 'Blocked Exit', location: 'Corridor B', status: 'New' },
    ];

    const slaData = [
        { name: 'Met', value: 89, color: '#10B981' },
        { name: 'Missed', value: 11, color: '#E5E7EB' },
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            {/* Statutory Compliance */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
                <ShieldCheck className="w-10 h-10 text-primary mb-3" />
                <span className="text-4xl font-bold text-gray-900">{data.compliance.statutory}%</span>
                <span className="text-sm text-gray-500 mt-1">Statutory Compliance</span>
            </div>

            {/* Days Since Incident */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
                <div className="text-primary font-bold text-5xl mb-2">{data.compliance.incidents}</div>
                <span className="text-sm text-gray-500 font-medium uppercase tracking-wide">Days Without Incident</span>
            </div>

            {/* Hazard Log */}
            <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center"><AlertTriangle className="w-4 h-4 mr-2 text-amber-500" /> Recent Hazards</h3>
                <div className="space-y-3">
                    {hazards.map(h => (
                        <div key={h.id} className="text-sm border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                            <div className="flex justify-between">
                                <span className="font-medium text-gray-700">{h.type}</span>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${h.status === 'Open' ? 'bg-red-100 text-red-600' : h.status === 'New' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>{h.status}</span>
                            </div>
                            <div className="text-xs text-gray-400 mt-0.5">{h.location}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* SLA Adherence */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
                <h3 className="text-sm font-semibold text-gray-500 mb-2">SLA Adherence</h3>
                <div className="h-24 w-24 relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={slaData}
                                innerRadius={25}
                                outerRadius={35}
                                dataKey="value"
                                startAngle={90}
                                endAngle={-270}
                            >
                                {slaData.map((entry, index) => (
                                    <Cell key={index} fill={entry.color} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center font-bold text-gray-800">
                        89%
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComplianceSafety;
