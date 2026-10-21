import { apiClient } from './apiClient';

const DELIVERY_URL = import.meta.env.VITE_DELIVERY_API_URL || 'http://localhost:5004/api/deliveries';

export const getAvailableDeliveries = () => apiClient(`${DELIVERY_URL}/available`);
export const getMyDeliveries = () => apiClient(`${DELIVERY_URL}/my-assignments`);
export const acceptDelivery = (id) =>
  apiClient(`${DELIVERY_URL}/${id}/accept`, {
    method: 'PATCH'
  });
export const updateDeliveryStatus = (deliveryId, status) =>
  apiClient(`${DELIVERY_URL}/${deliveryId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  });
export const getDeliveryById = (id) => apiClient(`${DELIVERY_URL}/${id}`);