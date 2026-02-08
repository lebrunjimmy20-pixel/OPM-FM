import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import Dashboard from './pages/Dashboard';
import WorkOrders from './pages/WorkOrders';
import MaintenanceSchedule from './pages/MaintenanceSchedule';
import Settings from './pages/Settings';
import Devices from './pages/Devices';
import ComingSoon from './pages/ComingSoon';
import Profile from './pages/Profile';
import Login from './pages/Login';
import HelpSupport from './pages/HelpSupport';
import ElectricityUsage from './pages/ElectricityUsage';
import { AuthProvider } from './components/auth/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/work-orders" element={<WorkOrders />} />
              <Route path="/schedule" element={<MaintenanceSchedule />} />
              <Route path="/billing" element={<ComingSoon title="Billing" />} />
              <Route path="/assets" element={<ComingSoon title="Assets" />} />
              <Route path="/devices" element={<Devices />} />
              <Route path="/iot" element={<ComingSoon title="IoT" />} />
              <Route path="/sustainability-goals" element={<ComingSoon title="Sustainability Goal Report" />} />
              <Route path="/reports" element={<ComingSoon title="Reports & Insights" />} />
              <Route path="/water-consumption" element={<ComingSoon title="Water Consumption" />} />
              <Route path="/gas-tracking" element={<ComingSoon title="Gas Flow Tracking" />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/electricity" element={<ElectricityUsage />} />
              <Route path="/help" element={<HelpSupport />} />
              <Route path="/settings/*" element={<Settings />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
