import { SELLER_PRODUCT_STATUS, SELLER_PRODUCTS_SEED } from '../constants/sellerProducts.constants';

// Frontend-only mock backing store, standing in for the /seller/** endpoints
// planned in the architecture roadmap (backend doesn't have seller-scoped
// product ownership yet). Function names and return shapes match what those
// endpoints are expected to return, so swapping this file's internals for
// real httpClient calls later shouldn't require touching the seller pages.
let products = SELLER_PRODUCTS_SEED.map((product) => ({ ...product }));
let nextId = products.length + 1;

const MOCK_LATENCY_MS = 350;

function delay(value) {
  return new Promise((resolve) => setTimeout(() => resolve(value), MOCK_LATENCY_MS));
}

export async function getSellerStats() {
  const activeListings = products.filter(
    (product) => product.status === SELLER_PRODUCT_STATUS.ACTIVE,
  ).length;

  return delay({
    totalListings: products.length,
    activeListings,
    ordersReceived: 12,
    revenue: products.reduce((sum, product) => sum + product.price * (product.stock > 0 ? 1 : 0), 0),
  });
}

export async function getSellerProducts() {
  return delay(products);
}

export async function createSellerProduct(data) {
  const product = { status: SELLER_PRODUCT_STATUS.ACTIVE, ...data, id: `sp-${nextId++}` };
  products = [product, ...products];
  return delay(product);
}

export async function updateSellerProduct(id, data) {
  products = products.map((product) => (product.id === id ? { ...product, ...data } : product));
  return delay(products.find((product) => product.id === id));
}

export async function deleteSellerProduct(id) {
  products = products.filter((product) => product.id !== id);
  return delay({ id });
}
