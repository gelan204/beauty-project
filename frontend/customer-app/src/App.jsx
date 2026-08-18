import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchMe } from './features/auth/authSlice.js';
import PublicLayout from './layouts/PublicLayout.jsx';
import ProtectedRoute from './layouts/ProtectedRoute.jsx';
import HomePage from './pages/HomePage.jsx';
import ServicesPage from './pages/ServicesPage.jsx';
import SalonsPage from './pages/SalonsPage.jsx';
import SalonDetailPage from './pages/SalonDetailPage.jsx';
import BookingPage from './pages/BookingPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import AppointmentsPage from './pages/AppointmentsPage.jsx';
import PortalEntryPage from './pages/PortalEntryPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import FavoritesPage from './pages/FavoritesPage.jsx';

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchMe());
  }, [dispatch]);

  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="salons" element={<SalonsPage />} />
        <Route path="salons/:id" element={<SalonDetailPage />} />
        <Route path="book" element={<BookingPage />} />
        <Route path="portal" element={<PortalEntryPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="appointments" element={<AppointmentsPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="favorites" element={<FavoritesPage />} />
      </Route>
    </Routes>
  );
}
