import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Scissors,
  Images,
  Star,
  Settings,
} from 'lucide-react';
import { PortalShell, LoadingState } from '@elaris/shared-ui';
import { fetchMe, logout } from './store.js';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import OverviewPage from './pages/OverviewPage.jsx';
import SchedulePage from './pages/SchedulePage.jsx';
import StaffPage from './pages/StaffPage.jsx';
import ServicesPage from './pages/ServicesPage.jsx';
import GalleryPage from './pages/GalleryPage.jsx';
import ReviewsPage from './pages/ReviewsPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';

const nav = [
  { to: '/', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/schedule', label: 'Schedule', icon: CalendarDays },
  { to: '/staff', label: 'Staff', icon: Users },
  { to: '/services', label: 'Services', icon: Scissors },
  { to: '/gallery', label: 'Gallery', icon: Images },
  { to: '/reviews', label: 'Reviews', icon: Star },
  { to: '/profile', label: 'Business profile', icon: Settings },
];

function OwnerShell() {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((s) => s.auth);

  useEffect(() => { dispatch(fetchMe()); }, [dispatch]);

  if (loading) return <LoadingState />;
  if (!user || user.role !== 'owner') return <Navigate to="/login" replace />;

  return (
    <PortalShell
      title="Salon workspace"
      subtitle="Salon workspace"
      navItems={nav}
      userInitial={user.name?.charAt(0) || 'O'}
      onLogout={() => dispatch(logout())}
      headerExtra={`${user.name}'s salon`}
    >
      <Routes>
        <Route index element={<OverviewPage />} />
        <Route path="schedule" element={<SchedulePage />} />
        <Route path="staff" element={<StaffPage />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="gallery" element={<GalleryPage />} />
        <Route path="reviews" element={<ReviewsPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Routes>
    </PortalShell>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/*" element={<OwnerShell />} />
    </Routes>
  );
}
