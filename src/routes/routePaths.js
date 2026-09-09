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
  ORDERS: '/orders',
  LOGIN: '/login',
};
