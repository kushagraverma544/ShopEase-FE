import { Heart, Home, LayoutGrid, ShoppingBag } from 'lucide-react';

import { ROUTE_PATHS } from '../routes/routePaths';

// Fixed entries around the dynamic category list (which Sidebar fetches
// from GET /catalog/products/categories) — these aren't catalog data.
export const SIDEBAR_TOP_NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: Home, path: ROUTE_PATHS.HOME },
  { id: 'categories', label: 'All Categories', icon: LayoutGrid, path: ROUTE_PATHS.PRODUCTS },
];

export const SIDEBAR_BOTTOM_NAV_ITEMS = [
  { id: 'wishlist', label: 'Wishlist', icon: Heart, path: ROUTE_PATHS.WISHLIST },
  { id: 'orders', label: 'My Orders', icon: ShoppingBag, path: ROUTE_PATHS.ORDERS },
];

export const HEADER_NAV_LINKS = [
  { id: 'home', label: 'Home', path: ROUTE_PATHS.HOME },
  { id: 'products', label: 'Shop', path: ROUTE_PATHS.PRODUCTS },
  { id: 'deals', label: 'Deals', path: ROUTE_PATHS.PRODUCTS },
];
