import { ENDPOINTS } from './api/endpoints';
import { httpClient } from './api/httpClient';

// Matches inventory-service's paginated shape:
// { content, limit, offset, totalElements, totalPages }
export async function getProducts({ limit = 30, offset = 0, sortBy, order } = {}) {
  return httpClient.get(ENDPOINTS.PRODUCTS.LIST, {
    params: { limit, offset, sortBy, order },
  });
}

export async function getProductById(id) {
  return httpClient.get(ENDPOINTS.PRODUCTS.DETAIL(id));
}

export async function searchProducts({ q, limit = 30, offset = 0 }) {
  return httpClient.get(ENDPOINTS.PRODUCTS.SEARCH, {
    params: { q, limit, offset },
  });
}

export async function getProductsByCategory(category, { limit = 30, offset = 0 } = {}) {
  return httpClient.get(ENDPOINTS.PRODUCTS.BY_CATEGORY(category), {
    params: { limit, offset },
  });
}

// [{ slug, name }]
export async function getCategories() {
  return httpClient.get(ENDPOINTS.PRODUCTS.CATEGORIES);
}

// ["beauty", "fragrances", ...]
export async function getCategoryList() {
  return httpClient.get(ENDPOINTS.PRODUCTS.CATEGORY_LIST);
}
