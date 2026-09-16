export const SELLER_PRODUCT_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
};

function daysAgoIso(days) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

// Frontend-only seed data — stands in for a real seller's product list until
// /seller/products/** exists on the backend (see sellerService.js).
export const SELLER_PRODUCTS_SEED = [
  {
    id: 'sp-1',
    name: 'Wireless Mechanical Keyboard',
    price: 3499,
    stock: 24,
    unitsSold: 42,
    status: SELLER_PRODUCT_STATUS.ACTIVE,
    imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=200&q=60',
    createdAt: daysAgoIso(60),
  },
  {
    id: 'sp-2',
    name: 'Noise Cancelling Headphones',
    price: 5999,
    stock: 0,
    unitsSold: 15,
    status: SELLER_PRODUCT_STATUS.INACTIVE,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=60',
    createdAt: daysAgoIso(10),
  },
  {
    id: 'sp-3',
    name: 'Ergonomic Office Chair',
    price: 8999,
    stock: 8,
    unitsSold: 28,
    status: SELLER_PRODUCT_STATUS.ACTIVE,
    imageUrl: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=200&q=60',
    createdAt: daysAgoIso(3),
  },
  {
    id: 'sp-4',
    name: 'USB-C Docking Station',
    price: 2499,
    stock: 3,
    unitsSold: 9,
    status: SELLER_PRODUCT_STATUS.ACTIVE,
    imageUrl: 'https://images.unsplash.com/photo-1591370874773-6702e8f12fd8?w=200&q=60',
    createdAt: daysAgoIso(1),
  },
];

export const SELLER_PRODUCTS_PAGE_SIZE = 8;
