import { Navigate, Outlet } from 'react-router-dom';

import { selectIsAuthenticated } from '../features/auth/authSlice';
import { useAppSelector } from '../hooks/useAppSelector';
import { ROUTE_PATHS } from './routePaths';

export function PrivateRoute() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  return isAuthenticated ? <Outlet /> : <Navigate to={ROUTE_PATHS.HOME} replace />;
}
