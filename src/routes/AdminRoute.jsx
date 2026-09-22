import { Navigate, Outlet } from 'react-router-dom';

import { selectIsAdmin } from '../features/auth/authSlice';
import { useAppSelector } from '../hooks/useAppSelector';
import { ROUTE_PATHS } from './routePaths';

export function AdminRoute() {
  const isAdmin = useAppSelector(selectIsAdmin);
  return isAdmin ? <Outlet /> : <Navigate to={ROUTE_PATHS.HOME} replace />;
}
