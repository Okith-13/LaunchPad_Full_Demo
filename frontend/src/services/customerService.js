import { apiClient } from './apiClient';

const CUSTOMER_URL = import.meta.env.VITE_CUSTOMER_API_URL || 'http://localhost:5005/api/customers';

export const getProfile = () => apiClient(`${CUSTOMER_URL}/profile`);
export const createProfile = (data) =>
  apiClient(`${CUSTOMER_URL}/profile`, {
    method: 'POST',
    body: JSON.stringify(data)
  });
export const updateProfile = (data) =>
  apiClient(`${CUSTOMER_URL}/profile`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });

export const getAddresses = () => apiClient(`${CUSTOMER_URL}/addresses`);
export const addAddress = (data) =>
  apiClient(`${CUSTOMER_URL}/addresses`, {
    method: 'POST',
    body: JSON.stringify(data)
  });
export const deleteAddress = (id) =>
  apiClient(`${CUSTOMER_URL}/addresses/${id}`, {
    method: 'DELETE'
  });