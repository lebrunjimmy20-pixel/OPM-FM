import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Zap, Droplets, Flame, Activity } from 'lucide-react';

interface Props {
    data: any;
}

const AssetsUtilities: React.FC<Props> = ({ data }) => {
    const assets = [
        { name: 'HVAC', uptime: data.assets.hvac, color: '#10B981' },
        { name: 'Elevators', uptime: data.assets.elevators, color: '#F59E0B' },
        { name: 'Plumbing', uptime: data.assets.plumbing, color: '#10B981' },
        { name: 'Electrical', uptime: data.assets.electrical, color: '#10B981' },
    ];

    const utilities = [
        { name: 'Electricity', icon: Zap, value: '452 kWh', change: '-4%', color: 'text-yellow-500' },
        { name: 'Water', icon: Droplets, value: '1,204 L', change: '+2%', color: 'text-blue-500' },
        { name: 'Gas', icon: Flame, value: '89 m³', change: '0%', color: 'text-orange-500' },
    ];

    const healthAssets = [
        { name: 'Chiller Unit 01', score: 92, status: 'good' },
        { name: 'Boiler B2', score: 88, status: 'good' },
        { name: 'Elevator E1', score: 45, status: 'critical' },
        { name: 'AHU Lvl 3', score: 76, status: 'warning' },
        { name: 'Generator Main', score: 98, status: 'good' },
        { name: 'Sump Pump', score: 95, status: 'good' },
    ];

    const getHealthColor = (score: number) => {
        if (score >= 90) return 'text-green-600 bg-green-50';
        if (score >= 70) return 'text-amber-600 bg-amber-50';
        return 'text-red-600 bg-red-50';
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Asset Uptime */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-6">Asset Uptime</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={assets} layout="vertical" barSize={20}>
                            <XAxis type="number" domain={[90, 100]} hide />
                            <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 12 }} />
                            <Tooltip cursor={{ fill: 'transparent' }} />
                            <Bar dataKey="uptime" background={{ fill: '#F3F4F6' }} radius={[0, 4, 4, 0]}>
                                {assets.map((entry, index) => (
                                    <Cell key={index} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Utilities */}
            <div className="space-y-4">
                {utilities.map((util) => (
                    <div key={util.name} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                        <div className="flex items-center">
                            <div className={`p-3 rounded-lg bg-gray-50 ${util.color}`}>
                                <util.icon className="w-5 h-5" />
                            </div>
                            <div className="ml-4">
                                <h4 className="text-sm font-medium text-gray-500">{util.name}</h4>
                                <span className="text-lg font-bold text-gray-900">{util.value}</span>
                            </div>
                        </div>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${util.change.startsWith('-') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {util.change}
                        </span>
                    </div>
                ))}
            </div>

            {/* Asset Health Grid */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Asset Health</h3>
                    <Activity className="w-4 h-4 text-gray-400" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    {healthAssets.map((asset) => (
                        <div key={asset.name} className={`p-3 rounded-lg border flex flex-col items-center justify-center text-center ${getHealthColor(asset.score)} border-transparent`}>
                            <span className="text-xl font-bold">{asset.score}</span>
                            <span className="text-xs font-medium mt-1 truncate w-full">{asset.name}</span>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};
import { Cell } from 'recharts';

export default AssetsUtilities;
