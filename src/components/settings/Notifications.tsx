const Notifications = () => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 max-w-2xl">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Notification Preferences</h3>

            <div className="space-y-6">
                {[
                    { title: 'Work Order Updates', desc: 'Receive notifications when status changes' },
                    { title: 'Maintenance Reminders', desc: 'Get alerts for upcoming PM tasks' },
                    { title: 'System Alerts', desc: 'Security and uptime alerts' },
                ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between pb-4 border-b border-gray-100 last:border-0">
                        <div>
                            <h4 className="text-sm font-medium text-gray-900">{item.title}</h4>
                            <p className="text-sm text-gray-500">{item.desc}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" defaultChecked={i !== 2} className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                    </div>
                ))}
            </div>

            <div className="mt-8">
                <h4 className="text-sm font-medium text-gray-900 mb-4">Delivery Methods</h4>
                <div className="space-y-3">
                    {['Email', 'Push Notifications', 'SMS', 'WhatsApp'].map(method => (
                        <label key={method} className="flex items-center">
                            <input type="checkbox" defaultChecked className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4" />
                            <span className="ml-3 text-sm text-gray-700">{method}</span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Notifications;
