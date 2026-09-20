/*
  Centralized route path constants. Never hardcode a path string in a
  component or <Link> — import from here so renaming a route only requires
  a change in one place.
*/
export const ROUTE_PATHS = {
  HOME: '/',
  PRODUCTS: '/products',
  PRODUCT_DETAILS: '/products/:productId',
  CART: '/cart',
  WISHLIST: '/wishlist',
  SETTINGS: '/settings',
  ACCOUNT: '/account',
  BECOME_SELLER: '/account/become-seller',
  ORDERS: '/orders',
  LOGIN: '/login',
  SELLER_DASHBOARD: '/seller/dashboard',
  SELLER_LISTINGS: '/seller/listings',
  SELLER_ADD_PRODUCT: '/seller/listings/new',
  // Deliberately not '/seller/profile' — that exact path is reserved for the
  // vite dev proxy to GET /seller/profile (see vite.config.js); using it here
  // too would make a hard refresh on this page get proxied to the API
  // instead of served the SPA shell.
  SELLER_PROFILE: '/seller/my-profile',
};

// Builds a concrete link target for the PRODUCT_DETAILS route pattern.
export function getProductDetailsPath(productId) {
  return `/products/${productId}`;
}
