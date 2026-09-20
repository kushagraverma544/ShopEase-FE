import {
  Home,
  LayoutDashboard,
  LayoutGrid,
  Package,
  PlusCircle,
  Settings,
  Store,
} from 'lucide-react';

import { ROUTE_PATHS } from '../routes/routePaths';

// Fixed entries around the dynamic category list (which Sidebar fetches
// from GET /catalog/products/categories) — these aren't catalog data.
export const SIDEBAR_TOP_NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: Home, path: ROUTE_PATHS.HOME },
  { id: 'categories', label: 'All Categories', icon: LayoutGrid, path: ROUTE_PATHS.PRODUCTS },
];

export const SIDEBAR_BOTTOM_NAV_ITEMS = [
  { id: 'settings', label: 'Settings', icon: Settings, path: ROUTE_PATHS.SETTINGS },
];

// SellerSidebar's nav — a fixed list, unlike the customer Sidebar there's no
// dynamic category fetch involved.
export const SELLER_SIDEBAR_NAV_ITEMS = [
  {
    id: 'seller-dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    path: ROUTE_PATHS.SELLER_DASHBOARD,
  },
  { id: 'seller-listings', label: 'My Listings', icon: Package, path: ROUTE_PATHS.SELLER_LISTINGS },
  {
    id: 'seller-add-product',
    label: 'Add Product',
    icon: PlusCircle,
    path: ROUTE_PATHS.SELLER_ADD_PRODUCT,
  },
  { id: 'seller-profile', label: 'Seller Profile', icon: Store, path: ROUTE_PATHS.SELLER_PROFILE },
];
