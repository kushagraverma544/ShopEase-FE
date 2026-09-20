import { Navigate, Outlet } from 'react-router-dom';

import { selectIsSeller } from '../features/auth/authSlice';
import { useAppSelector } from '../hooks/useAppSelector';
import { ROUTE_PATHS } from './routePaths';

export function SellerRoute() {
  const isSeller = useAppSelector(selectIsSeller);
  return isSeller ? <Outlet /> : <Navigate to={ROUTE_PATHS.HOME} replace />;
}
