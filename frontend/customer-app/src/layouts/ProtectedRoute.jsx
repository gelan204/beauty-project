import { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMe } from '../features/auth/authSlice.js';
import { LoadingState } from '@elaris/shared-ui';

export default function ProtectedRoute() {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchMe());
  }, [dispatch]);

  if (loading) return <LoadingState />;
  if (!user || user.role !== 'customer') return <Navigate to="/login" replace />;
  return <Outlet />;
}
