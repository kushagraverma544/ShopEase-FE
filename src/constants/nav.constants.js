import {
  Heart,
  Home,
  LayoutGrid,
  Percent,
  Shirt,
  ShoppingBag,
  Smartphone,
  Sofa,
  Sparkles,
  Watch,
} from 'lucide-react';

import { ROUTE_PATHS } from '../routes/routePaths';

export const SIDEBAR_NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: Home, path: ROUTE_PATHS.HOME },
  { id: 'categories', label: 'All Categories', icon: LayoutGrid, path: ROUTE_PATHS.PRODUCTS },
  { id: 'fashion', label: 'Fashion', icon: Shirt, path: ROUTE_PATHS.PRODUCTS },
  { id: 'electronics', label: 'Electronics', icon: Smartphone, path: ROUTE_PATHS.PRODUCTS },
  { id: 'home-living', label: 'Home & Living', icon: Sofa, path: ROUTE_PATHS.PRODUCTS },
  { id: 'accessories', label: 'Accessories', icon: Watch, path: ROUTE_PATHS.PRODUCTS },
  { id: 'deals', label: 'Deals', icon: Percent, path: ROUTE_PATHS.PRODUCTS },
  { id: 'new-arrivals', label: 'New Arrivals', icon: Sparkles, path: ROUTE_PATHS.PRODUCTS },
  { id: 'wishlist', label: 'Wishlist', icon: Heart, path: ROUTE_PATHS.WISHLIST },
  { id: 'orders', label: 'My Orders', icon: ShoppingBag, path: ROUTE_PATHS.ORDERS },
];

export const HEADER_NAV_LINKS = [
  { id: 'home', label: 'Home', path: ROUTE_PATHS.HOME },
  { id: 'products', label: 'Shop', path: ROUTE_PATHS.PRODUCTS },
  { id: 'deals', label: 'Deals', path: ROUTE_PATHS.PRODUCTS },
];
