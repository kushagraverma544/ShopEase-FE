import axios from 'axios';

export const unsplashClient = axios.create({
  baseURL: 'https://api.unsplash.com',
  headers: {
    Authorization: `Client-ID ${import.meta.env.VITE_UNSPLASH_ACCESS_KEY}`,
  },
});

unsplashClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.errors?.[0] ?? error.message ?? 'Something went wrong';
    return Promise.reject(new Error(message));
  },
);
