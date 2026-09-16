import { SELLER_ORDER_STATUS, SELLER_ORDERS_SEED } from '../constants/sellerOrders.constants';
import { SELLER_PRODUCT_STATUS, SELLER_PRODUCTS_SEED } from '../constants/sellerProducts.constants';

// Frontend-only mock backing store, standing in for the /seller/** endpoints
// planned in the architecture roadmap (backend doesn't have seller-scoped
// product/order data yet). Function names and return shapes match what those
// endpoints are expected to return, so swapping this file's internals for
// real httpClient calls later shouldn't require touching the seller pages.
let products = SELLER_PRODUCTS_SEED.map((product) => ({ ...product }));
let orders = SELLER_ORDERS_SEED.map((order) => ({ ...order }));
let nextId = products.length + 1;

const MOCK_LATENCY_MS = 350;

function delay(value) {
  return new Promise((resolve) => setTimeout(() => resolve(value), MOCK_LATENCY_MS));
}

function isSameDay(isoA, isoB) {
  return new Date(isoA).toDateString() === new Date(isoB).toDateString();
}

export async function getSellerStats() {
  const activeListings = products.filter(
    (product) => product.status === SELLER_PRODUCT_STATUS.ACTIVE,
  ).length;

  const now = new Date();
  const revenueThisMonth = orders
    .filter((order) => {
      if (order.status === SELLER_ORDER_STATUS.CANCELLED) return false;
      const createdAt = new Date(order.createdAt);
      return createdAt.getMonth() === now.getMonth() && createdAt.getFullYear() === now.getFullYear();
    })
    .reduce((sum, order) => sum + order.amount, 0);

  return delay({
    totalListings: products.length,
    activeListings,
    ordersReceived: orders.length,
    revenue: revenueThisMonth,
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

export async function getRecentOrders({ limit = 5 } = {}) {
  const sorted = [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  return delay(sorted.slice(0, limit));
}

export async function getOrderStatusBreakdown() {
  const counts = {
    pending: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
  };
  orders.forEach((order) => {
    counts[order.status] += 1;
  });

  return delay({ ...counts, total: orders.length });
}

// [{ date: 'YYYY-MM-DD', revenue }] for the last `days` days, oldest first.
// Cancelled orders don't count toward revenue.
export async function getSalesTrend({ days = 14 } = {}) {
  const trend = [];
  for (let offset = days - 1; offset >= 0; offset -= 1) {
    const day = new Date();
    day.setDate(day.getDate() - offset);

    const revenue = orders
      .filter((order) => order.status !== SELLER_ORDER_STATUS.CANCELLED)
      .filter((order) => isSameDay(order.createdAt, day.toISOString()))
      .reduce((sum, order) => sum + order.amount, 0);

    trend.push({ date: day.toISOString().slice(0, 10), revenue });
  }
  return delay(trend);
}

export async function getTopSellingProducts({ limit = 5 } = {}) {
  const sorted = [...products].sort((a, b) => b.unitsSold - a.unitsSold);
  return delay(sorted.slice(0, limit));
}

export async function getLowStockProducts({ threshold = 5 } = {}) {
  const lowStock = products
    .filter((product) => product.stock <= threshold)
    .sort((a, b) => a.stock - b.stock);
  return delay(lowStock);
}

export async function getRecentlyAddedProducts({ limit = 5 } = {}) {
  const sorted = [...products].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  return delay(sorted.slice(0, limit));
}
