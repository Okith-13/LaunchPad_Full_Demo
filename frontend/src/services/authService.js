import { apiClient } from './apiClient';

const AUTH_URL = import.meta.env.VITE_AUTH_API_URL || 'http://localhost:5001/api/auth';

export const login = (credentials) =>
  apiClient(`${AUTH_URL}/login`, {
    method: 'POST',
    body: JSON.stringify(credentials)
  });

export const register = (userData) =>
  apiClient(`${AUTH_URL}/register`, {
    method: 'POST',
    body: JSON.stringify(userData)
  });

export const refreshToken = (refreshTokenValue) =>
  apiClient(`${AUTH_URL}/refresh`, {
    method: 'POST',
    body: JSON.stringify({ refreshToken: refreshTokenValue })
  });