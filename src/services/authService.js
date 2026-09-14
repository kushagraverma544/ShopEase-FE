import { ENDPOINTS } from './api/endpoints';
import { httpClient } from './api/httpClient';

// { accessToken, refreshToken, expiresIn, tokenType }
export async function login({ username, password }) {
  return httpClient.post(ENDPOINTS.AUTH.LOGIN, { username, password });
}

export async function logout(refreshToken) {
  return httpClient.post(ENDPOINTS.AUTH.LOGOUT, { refreshToken });
}
