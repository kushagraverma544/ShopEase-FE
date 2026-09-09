import { Home, LayoutGrid, Settings } from 'lucide-react';

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

