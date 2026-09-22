import {
  CreditCard,
  FileText,
  Home,
  LayoutDashboard,
  LayoutGrid,
  LineChart,
  Package,
  PlusCircle,
  Settings,
  Store,
  UserPlus,
  Users,
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

// AdminSidebar's nav, grouped into sections (General/Operations/People/
// Compliance) the way a standard marketplace admin console is organized.
// Only Dashboard and Seller Applications have real backends today — every
// other entry is a disabled "Soon" placeholder reserving its spot, per the
// same pattern the admin spec already established for Customers/Analytics:
// visible in the IA, not faked with mock functionality (Onboarding in
// particular creates other ADMIN accounts — too sensitive to mock).
export const ADMIN_SIDEBAR_NAV_GROUPS = [
  {
    id: 'general',
    label: 'General',
    items: [
      { id: 'admin-dashboard', label: 'Dashboard', icon: LayoutDashboard, path: ROUTE_PATHS.ADMIN_DASHBOARD },
    ],
  },
  {
    id: 'operations',
    label: 'Operations',
    items: [
      {
        id: 'admin-seller-applications',
        label: 'Seller Applications',
        icon: Store,
        path: ROUTE_PATHS.ADMIN_SELLER_APPLICATIONS,
      },
      { id: 'admin-orders', label: 'Orders', icon: Package, disabled: true },
      { id: 'admin-payments', label: 'Payments', icon: CreditCard, disabled: true },
    ],
  },
  {
    id: 'people',
    label: 'People',
    items: [
      { id: 'admin-customers', label: 'Customers', icon: Users, disabled: true },
      { id: 'admin-onboarding', label: 'Admin Onboarding', icon: UserPlus, disabled: true },
    ],
  },
  {
    id: 'compliance',
    label: 'Compliance',
    items: [
      { id: 'admin-audit-log', label: 'Audit Log', icon: FileText, disabled: true },
      { id: 'admin-analytics', label: 'Analytics', icon: LineChart, disabled: true },
    ],
  },
];
