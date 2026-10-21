import { apiClient } from './apiClient';

const ORDER_URL = import.meta.env.VITE_ORDER_API_URL || 'http://localhost:5003/api/orders';

export const createOrder = (orderData) =>
  apiClient(ORDER_URL, {
    method: 'POST',
    body: JSON.stringify(orderData)
  });

export const getOrderById = (id) => apiClient(`${ORDER_URL}/${id}`);
export const getMyOrders = () => apiClient(`${ORDER_URL}/my-orders`);
export const getRestaurantOrders = (restaurantId) =>
  apiClient(`${ORDER_URL}/restaurant/${restaurantId}`);
export const updateOrderStatus = (orderId, status) =>
  apiClient(`${ORDER_URL}/${orderId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  });