export const ENDPOINTS = {
  PRODUCTS: {
    LIST: '/catalog/products',
    DETAIL: (id) => `/catalog/products/${id}`,
    SEARCH: '/catalog/products/search',
    CATEGORIES: '/catalog/products/categories',
    CATEGORY_LIST: '/catalog/products/category-list',
    BY_CATEGORY: (category) => `/catalog/products/category/${category}`,
  },
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
  },
  ME: {
    DETAILS: '/me',
    PERSONAL_DETAILS: '/me/personal-details',
    CONTACT_DETAILS: '/me/contact-details',
    SECURITY: '/me/security',
    ADDRESSES: '/me/addresses',
    ADDRESS_DETAIL: (id) => `/me/addresses/${id}`,
  },
};
