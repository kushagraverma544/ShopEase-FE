import axios from 'axios';

export const httpClient = axios.create({
  // In dev this stays relative and goes through the Vite proxy (see
  // vite.config.js) to the inventory-service, avoiding CORS. In production,
  // set VITE_API_BASE_URL to the real API gateway URL.
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '',
  headers: { 'Content-Type': 'application/json' },
});

httpClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message ?? error.message ?? 'Something went wrong';
    return Promise.reject(new Error(message));
  },
);
