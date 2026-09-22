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
  SELLER_APPLICATION: {
    STATUS: '/seller/application-status',
    APPLY: '/seller/apply',
    PROFILE: '/seller/profile',
    HISTORY: '/seller/history',
  },
  ADMIN: {
    SELLERS: '/admin/sellers',
    APPROVE: (id) => `/admin/sellers/${id}/approve`,
    REJECT: (id) => `/admin/sellers/${id}/reject`,
    HOLD: (id) => `/admin/sellers/${id}/hold`,
    HISTORY: (id) => `/admin/sellers/${id}/history`,
  },
};
