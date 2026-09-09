import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

import { Loader } from '../components/common/Loader/Loader';
import { MainLayout } from '../components/layout/MainLayout';
import { ROUTE_PATHS } from './routePaths';

const LandingPage = lazy(() => import('../pages/Landing/LandingPage'));
const ProductListingPage = lazy(() => import('../pages/Products/ProductListingPage'));

export function AppRoutes() {
  return (
    <Suspense fallback={<Loader fullScreen />}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path={ROUTE_PATHS.HOME} element={<LandingPage />} />
          <Route path={ROUTE_PATHS.PRODUCTS} element={<ProductListingPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
