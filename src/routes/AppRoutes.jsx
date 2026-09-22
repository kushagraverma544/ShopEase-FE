import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

import { Loader } from '../components/common/Loader/Loader';
import { AdminLayout } from '../components/layout/AdminLayout';
import { MainLayout } from '../components/layout/MainLayout';
import { SellerLayout } from '../components/layout/SellerLayout';
import { AdminRoute } from './AdminRoute';
import { PrivateRoute } from './PrivateRoute';
import { ROUTE_PATHS } from './routePaths';
import { SellerRoute } from './SellerRoute';

const LandingPage = lazy(() => import('../pages/Landing/LandingPage'));
const ProductListingPage = lazy(() => import('../pages/Products/ProductListingPage'));
const ProductDetailPage = lazy(() => import('../pages/ProductDetail/ProductDetailPage'));
const AuthPage = lazy(() => import('../pages/Auth/AuthPage'));
const AccountPage = lazy(() => import('../pages/Account/AccountPage'));
const BecomeSellerPage = lazy(() => import('../pages/Account/BecomeSellerPage'));
const SellerDashboardPage = lazy(() => import('../pages/Seller/SellerDashboardPage'));
const SellerListingsPage = lazy(() => import('../pages/Seller/SellerListingsPage'));
const SellerAddProductPage = lazy(() => import('../pages/Seller/SellerAddProductPage'));
const SellerProfilePage = lazy(() => import('../pages/Seller/SellerProfilePage'));
const AdminSellerApplicationsPage = lazy(() => import('../pages/Admin/AdminSellerApplicationsPage'));
const AdminDashboardPage = lazy(() => import('../pages/Admin/AdminDashboardPage'));

export function AppRoutes() {
  return (
    <Suspense fallback={<Loader fullScreen />}>
      <Routes>
        <Route path={ROUTE_PATHS.LOGIN} element={<AuthPage />} />

        <Route element={<MainLayout />}>
          <Route path={ROUTE_PATHS.HOME} element={<LandingPage />} />
          <Route path={ROUTE_PATHS.PRODUCTS} element={<ProductListingPage />} />
          <Route path={ROUTE_PATHS.PRODUCT_DETAILS} element={<ProductDetailPage />} />

          <Route element={<PrivateRoute />}>
            <Route path={ROUTE_PATHS.ACCOUNT} element={<AccountPage />} />
            <Route path={ROUTE_PATHS.BECOME_SELLER} element={<BecomeSellerPage />} />
          </Route>
        </Route>

        <Route element={<SellerRoute />}>
          <Route element={<SellerLayout />}>
            <Route path={ROUTE_PATHS.SELLER_DASHBOARD} element={<SellerDashboardPage />} />
            <Route path={ROUTE_PATHS.SELLER_LISTINGS} element={<SellerListingsPage />} />
            <Route path={ROUTE_PATHS.SELLER_ADD_PRODUCT} element={<SellerAddProductPage />} />
            <Route path={ROUTE_PATHS.SELLER_PROFILE} element={<SellerProfilePage />} />
          </Route>
        </Route>

        <Route element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path={ROUTE_PATHS.ADMIN_DASHBOARD} element={<AdminDashboardPage />} />
            <Route path={ROUTE_PATHS.ADMIN_SELLER_APPLICATIONS} element={<AdminSellerApplicationsPage />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
}
