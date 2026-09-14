import axios from 'axios';

import { store } from '../../app/store';
import { selectAccessToken } from '../../features/auth/authSlice';

export const httpClient = axios.create({
  // In dev this stays relative and goes through the Vite proxy (see
  // vite.config.js) to the inventory-service/user-service, avoiding CORS. In
  // production, vite.config.js refuses to build without VITE_API_BASE_URL
  // set to the real API Gateway URL.
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '',
  headers: { 'Content-Type': 'application/json' },
});

export function attachAuthHeader(config) {
  const accessToken = selectAccessToken(store.getState());
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
}

httpClient.interceptors.request.use(attachAuthHeader);

httpClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message ?? error.message ?? 'Something went wrong';
    return Promise.reject(new Error(message));
  },
);
