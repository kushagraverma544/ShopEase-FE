const MOCK_FEATURED_PRODUCTS = [
  { id: 'p1', name: 'Wireless Headphones', price: 2499, rating: 4.5, category: 'Electronics' },
  { id: 'p2', name: 'Running Sneakers', price: 3299, rating: 4.2, category: 'Fashion' },
  { id: 'p3', name: 'Smart Watch', price: 5499, rating: 4.6, category: 'Accessories' },
  { id: 'p4', name: 'Ceramic Dinner Set', price: 1899, rating: 4.3, category: 'Home & Living' },
  { id: 'p5', name: 'Backpack', price: 1499, rating: 4.4, category: 'Fashion' },
  { id: 'p6', name: 'Bluetooth Speaker', price: 1999, rating: 4.1, category: 'Electronics' },
  { id: 'p7', name: 'Sunglasses', price: 999, rating: 4.0, category: 'Accessories' },
  { id: 'p8', name: 'Table Lamp', price: 1299, rating: 4.5, category: 'Home & Living' },
];

// TODO: replace with `httpClient.get(ENDPOINTS.PRODUCTS.FEATURED)` once the
// product-catalog service exposes this endpoint.
export async function getFeaturedProducts() {
  return MOCK_FEATURED_PRODUCTS;
}
