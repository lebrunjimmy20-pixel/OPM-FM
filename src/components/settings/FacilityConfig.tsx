import { ChevronRight, ChevronDown, MapPin, Layers, Layout } from 'lucide-react';

const FacilityConfig = () => {
    // Mock Tree
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Structure</h3>
                <div className="space-y-2">
                    <div className="flex items-center text-sm font-medium text-gray-900 cursor-pointer">
                        <ChevronDown className="w-4 h-4 mr-1 text-gray-400" />
                        <MapPin className="w-4 h-4 mr-2 text-primary" />
                        Main Campus
                    </div>
                    <div className="ml-6 space-y-2">
                        <div className="flex items-center text-sm text-gray-700 bg-gray-50 rounded-md p-1 cursor-pointer">
                            <ChevronDown className="w-4 h-4 mr-1 text-gray-400" />
                            <Layers className="w-4 h-4 mr-2 text-blue-500" />
                            Building A
                        </div>
                        <div className="ml-6 space-y-1">
                            {['Level 1', 'Level 2', 'Level 3'].map(lvl => (
                                <div key={lvl} className="flex items-center text-sm text-gray-500 p-1 hover:text-gray-900 cursor-pointer">
                                    <Layout className="w-3 h-3 mr-2" />
                                    {lvl}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="ml-6 flex items-center text-sm text-gray-600 p-1 cursor-pointer hover:bg-gray-50 rounded-md">
                        <ChevronRight className="w-4 h-4 mr-1 text-gray-400" />
                        <Layers className="w-4 h-4 mr-2 text-blue-500" />
                        Building B
                    </div>
                </div>
            </div>

            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Building Details: Building A</h3>
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Building Name</label>
                        <input type="text" defaultValue="Building A" className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                        <select className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary">
                            <option>Office</option>
                            <option>Warehouse</option>
                            <option>Residential</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Total Area (sq ft)</label>
                        <input type="number" defaultValue="45000" className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Floors</label>
                        <input type="number" defaultValue="3" className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary" />
                    </div>
                </div>
                <div className="mt-6 flex justify-end">
                    <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-green-800">Save Changes</button>
                </div>
            </div>
        </div>
    );
};

export default FacilityConfig;
