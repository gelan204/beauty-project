import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { LayoutDashboard, CalendarDays, Clock, User } from 'lucide-react';
import { PortalShell, LoadingState } from '@elaris/shared-ui';
import { fetchMe, logout } from './store.js';
import LoginPage from './pages/LoginPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import AppointmentsPage from './pages/AppointmentsPage.jsx';
import AvailabilityPage from './pages/AvailabilityPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';

const nav = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/appointments', label: 'Appointments', icon: CalendarDays },
  { to: '/availability', label: 'Availability', icon: Clock },
  { to: '/profile', label: 'Profile', icon: User },
];

function Shell() {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((s) => s.auth);
  useEffect(() => { dispatch(fetchMe()); }, [dispatch]);
  if (loading) return <LoadingState />;
  if (!user || user.role !== 'staff') return <Navigate to="/login" replace />;
  return (
    <PortalShell subtitle="Staff workspace" navItems={nav} userInitial={user.name?.charAt(0) || 'S'} onLogout={() => dispatch(logout())}>
      <Routes>
        <Route index element={<DashboardPage />} />
        <Route path="appointments" element={<AppointmentsPage />} />
        <Route path="availability" element={<AvailabilityPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Routes>
    </PortalShell>
  );
}

export default function App() {
  return (<Routes><Route path="/login" element={<LoginPage />} /><Route path="/*" element={<Shell />} /></Routes>);
}
