import { MoreHorizontal } from 'lucide-react';
import clsx from 'clsx';

const utilitiesData = [
    { id: 1, name: 'Electricity', facility: 'Assembly Line', date: 'March 15, 2024', status: 'Optimized', statusColor: 'emerald' },
    { id: 2, name: 'Water', facility: 'Cooling Unit', date: 'November 22, 2023', status: 'Normal', statusColor: 'orange', checked: true },
    { id: 3, name: 'Gas', facility: 'Heat Treatment', date: 'January 5, 2025', status: 'Needs Upgrade', statusColor: 'red' },
];

const UtilitiesTable = () => {
    return (
        <div className="relative overflow-hidden rounded-3xl border border-gray-100/70 bg-white p-6 shadow-[0_1px_0_rgba(15,23,42,0.04),0_16px_40px_-28px_rgba(15,23,42,0.38)]">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_320px_at_18%_0%,rgba(16,185,129,0.10),transparent_62%)] opacity-80" />

            <div className="relative flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-1 h-6 bg-emerald-500 rounded-full"></div> {/* Accent bar */}
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <span className="text-emerald-500"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 21h18M5 21V7l8-4 8 4v14M8 21v-4h8v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
                        Industry Utilities
                    </h3>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                    <MoreHorizontal className="w-5 h-5" />
                </button>
            </div>

            <div className="relative overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100">
                            <th className="py-3 px-4 w-12 text-center">
                                <input type="checkbox" className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                            </th>
                            <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Facility</th>
                            <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {utilitiesData.map((item) => (
                            <tr key={item.id} className={clsx("hover:bg-gray-50/50 transition-colors", item.checked && "bg-emerald-50/50")}>
                                <td className="py-4 px-4 text-center">
                                    <input
                                        type="checkbox"
                                        checked={item.checked}
                                        readOnly
                                        className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                                    />
                                </td>
                                <td className="py-4 px-4 text-sm font-medium text-gray-900">{item.name}</td>
                                <td className="py-4 px-4 text-sm text-gray-600">{item.facility}</td>
                                <td className="py-4 px-4 text-sm text-gray-500">{item.date}</td>
                                <td className="py-4 px-4">
                                    <span className={clsx("inline-flex items-center text-xs font-medium",
                                        item.statusColor === 'emerald' && "text-emerald-600",
                                        item.statusColor === 'orange' && "text-amber-500",
                                        item.statusColor === 'red' && "text-red-500",
                                    )}>
                                        <span className={clsx("w-2 h-2 rounded-full mr-2",
                                            item.statusColor === 'emerald' && "bg-emerald-500",
                                            item.statusColor === 'orange' && "bg-amber-500",
                                            item.statusColor === 'red' && "bg-red-500",
                                        )}></span>
                                        {item.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UtilitiesTable;
