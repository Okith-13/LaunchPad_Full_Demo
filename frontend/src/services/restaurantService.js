import { apiClient } from './apiClient';

const RESTAURANT_URL = import.meta.env.VITE_RESTAURANT_API_URL || 'http://localhost:5002/api';

export const getRestaurants = () => apiClient(`${RESTAURANT_URL}/restaurants`);
export const getRestaurantById = (id) => apiClient(`${RESTAURANT_URL}/restaurants/${id}`);
export const getMyRestaurant = () => apiClient(`${RESTAURANT_URL}/restaurants/my-restaurant`);
export const createRestaurant = (data) =>
  apiClient(`${RESTAURANT_URL}/restaurants`, {
    method: 'POST',
    body: JSON.stringify(data)
  });
export const updateRestaurant = (id, data) =>
  apiClient(`${RESTAURANT_URL}/restaurants/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
export const deleteRestaurant = (id) =>
  apiClient(`${RESTAURANT_URL}/restaurants/${id}`, {
    method: 'DELETE'
  });

export const getMenuItems = (restaurantId) => 
  apiClient(`${RESTAURANT_URL}/menu/restaurant/${restaurantId}`);

export const getRestaurantMenu = (restaurantId) => 
  apiClient(`${RESTAURANT_URL}/menu/restaurant/${restaurantId}`);

export const getMenuByRestaurant = (restaurantId) => 
  apiClient(`${RESTAURANT_URL}/menu/restaurant/${restaurantId}`);

export const createMenuItem = (itemData) =>
  apiClient(`${RESTAURANT_URL}/menu`, {
    method: 'POST',
    body: JSON.stringify(itemData)
  });

export const updateMenuItem = (id, itemData) =>
  apiClient(`${RESTAURANT_URL}/menu/${id}`, {
    method: 'PUT',
    body: JSON.stringify(itemData)
  });

export const deleteMenuItem = (id) =>
  apiClient(`${RESTAURANT_URL}/menu/${id}`, {
    method: 'DELETE'
  });