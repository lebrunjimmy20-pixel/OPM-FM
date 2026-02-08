const CompanyProfile = () => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 max-w-2xl">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Company Profile</h3>

            <div className="flex items-center mb-8">
                <div className="h-20 w-20 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 border border-dashed border-gray-300 mr-6">
                    Logo
                </div>
                <button className="text-sm text-primary font-medium hover:text-green-800">Upload New Logo</button>
            </div>

            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                        <input type="text" defaultValue="OPM FM Solutions" className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                        <input type="email" defaultValue="admin@opm.fm" className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary" />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <textarea rows={3} className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary"></textarea>
                </div>
            </div>

            <div className="mt-6 flex justify-end">
                <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-green-800">Save Profile</button>
            </div>
        </div>
    );
};

export default CompanyProfile;
