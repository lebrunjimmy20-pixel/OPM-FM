import React from 'react';
import { Users } from 'lucide-react';

interface Props {
    data: any;
}

const Occupancy: React.FC<Props> = ({ data }) => {
    // Simple heatmap simulation grid
    const floors = ['Lvl 1', 'Lvl 2', 'Lvl 3'];
    const zones = ['North', 'East', 'South', 'West'];

    // Random heat map colors
    const getHeatColor = () => {
        const r = Math.random();
        if (r > 0.8) return 'bg-red-200'; // High
        if (r > 0.4) return 'bg-amber-200'; // Med
        return 'bg-green-100'; // Low
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Heatmap */}
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-800">Live Space Utilization</h3>
                    <div className="flex items-center space-x-2 text-xs">
                        <span className="w-3 h-3 bg-green-100 rounded-sm"></span> <span>Low</span>
                        <span className="w-3 h-3 bg-amber-200 rounded-sm"></span> <span>Med</span>
                        <span className="w-3 h-3 bg-red-200 rounded-sm"></span> <span>High</span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr>
                                <th className="text-left py-2 px-2 font-medium text-gray-500">Floor/Zone</th>
                                {zones.map(z => <th key={z} className="font-medium text-gray-500">{z}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {floors.map(f => (
                                <tr key={f} className="border-t border-gray-50">
                                    <td className="py-3 px-2 font-semibold text-gray-700">{f}</td>
                                    {zones.map(z => (
                                        <td key={z} className="p-2">
                                            <div className={`h-8 w-full rounded-md ${getHeatColor()} transition-colors duration-1000`} title="Occupancy Level"></div>
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Visitor Log */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center"><Users className="w-5 h-5 mr-2 text-blue-500" /> Visitor Log</h3>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                        <span className="block text-2xl font-bold text-blue-700">{data.occupancy.visitorsToday}</span>
                        <span className="text-xs text-blue-600">Today</span>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                        <span className="block text-2xl font-bold text-gray-700">1,842</span>
                        <span className="text-xs text-gray-500">This Month</span>
                    </div>
                </div>

                <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3">Recent Visitors</h4>
                    <ul className="space-y-3">
                        <li className="flex items-center justify-between text-sm">
                            <span className="text-gray-900">Sarah Connor</span>
                            <span className="text-gray-400 text-xs">10:42 AM</span>
                        </li>
                        <li className="flex items-center justify-between text-sm">
                            <span className="text-gray-900">Kyle Reese</span>
                            <span className="text-gray-400 text-xs">10:15 AM</span>
                        </li>
                        <li className="flex items-center justify-between text-sm">
                            <span className="text-gray-900">T. Anderson</span>
                            <span className="text-gray-400 text-xs">09:30 AM</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Occupancy;
