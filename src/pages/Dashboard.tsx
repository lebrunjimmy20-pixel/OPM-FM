import StatCard from '../components/dashboard/ecogrid/StatCard';
import ConsumptionChart from '../components/dashboard/ecogrid/ConsumptionChart';
import UtilitiesTable from '../components/dashboard/ecogrid/UtilitiesTable';
import { GaugeWidget, AlertsWidget, AIWidget } from '../components/dashboard/ecogrid/RightWidgets';

const Dashboard = () => {
    return (
        <div className="text-gray-900">

            <div className="grid grid-cols-12 gap-6">

                {/* Main Column (Left - 8 cols) */}
                <div className="col-span-12 xl:col-span-8 flex flex-col gap-6">

                    {/* Top Row: Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <StatCard
                            title="Electricity"
                            value="2,196 gal"
                            trend={12}
                            trendLabel="+10 from last month"
                            icon="zap"
                            color="emerald" // Green icon container per request
                        />
                        <StatCard
                            title="Plants"
                            value="27"
                            trend={-12}
                            trendLabel="-40 from last month"
                            icon="leaf"
                            color="blue" // Light blue icon container (KEEP THIS BLUE per request)
                        />
                    </div>

                    {/* Middle Row: Chart */}
                    <div className="w-full">
                        <ConsumptionChart />
                    </div>

                    {/* Bottom Row: Table */}
                    <div className="w-full">
                        <UtilitiesTable />
                    </div>

                </div>

                {/* Right Column (Sidebar Widgets - 4 cols) */}
                <div className="col-span-12 xl:col-span-4 flex flex-col gap-6">

                    <GaugeWidget />

                    <AlertsWidget />

                    <AIWidget />

                </div>
            </div>
        </div>
    );
};

export default Dashboard;
