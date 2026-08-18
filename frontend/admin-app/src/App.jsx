import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  LayoutDashboard,
  CalendarCheck,
  Store,
  Scissors,
  Users,
  ChartNoAxesCombined,
} from 'lucide-react';
import { PortalShell, LoadingState } from '@elaris/shared-ui';
import { fetchMe, logout } from './store.js';
import LoginPage from './pages/LoginPage.jsx';
import OverviewPage from './pages/OverviewPage.jsx';
import AppointmentsPage from './pages/AppointmentsPage.jsx';
import SalonsPage from './pages/SalonsPage.jsx';
import ServicesPage from './pages/ServicesPage.jsx';
import UsersPage from './pages/UsersPage.jsx';
import AnalyticsPage from './pages/AnalyticsPage.jsx';

const nav = [
  { to: '/', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/appointments', label: 'Appointments', icon: CalendarCheck },
  { to: '/salons', label: 'Salon approvals', icon: Store },
  { to: '/services', label: 'Services', icon: Scissors },
  { to: '/users', label: 'Users', icon: Users },
  { to: '/analytics', label: 'Analytics', icon: ChartNoAxesCombined },
];

function Shell() {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((s) => s.auth);
  useEffect(() => { dispatch(fetchMe()); }, [dispatch]);
  if (loading) return <LoadingState />;
  if (!user || user.role !== 'admin') return <Navigate to="/login" replace />;
  return (
    <PortalShell subtitle="Admin workspace" navItems={nav} userInitial="A" onLogout={() => dispatch(logout())}>
      <Routes>
        <Route index element={<OverviewPage />} />
        <Route path="appointments" element={<AppointmentsPage />} />
        <Route path="salons" element={<SalonsPage />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
      </Routes>
    </PortalShell>
  );
}

export default function App() {
  return (<Routes><Route path="/login" element={<LoginPage />} /><Route path="/*" element={<Shell />} /></Routes>);
}
