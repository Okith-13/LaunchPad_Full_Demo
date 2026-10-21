const restaurantService = require('../services/restaurant.service');
const { success, error } = require('../utils/response.util');

exports.getMyRestaurant = async (req, res) => {
  try {
    const restaurant = await restaurantService.getRestaurantByOwnerId(req.user.userId);
    return success(res, 200, 'User restaurant retrieved', restaurant);
  } catch (err) {
    return error(res, 500, 'Failed to fetch restaurant profile', err.message);
  }
};

exports.getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await restaurantService.getAllRestaurants(req.query);
    return success(res, 200, 'Restaurants fetched successfully', restaurants);
  } catch (err) {
    return error(res, 500, 'Failed to retrieve restaurants', err.message);
  }
};

exports.getRestaurantById = async (req, res) => {
  try {
    const restaurant = await restaurantService.getRestaurantById(req.params.id);
    if (!restaurant) return error(res, 404, 'Restaurant not found');
    return success(res, 200, 'Restaurant retrieved', restaurant);
  } catch (err) {
    return error(res, 500, 'Failed to retrieve restaurant', err.message);
  }
};

exports.createRestaurant = async (req, res) => {
  try {
    const restaurantData = {
      ...req.body,
      owner_id: req.user.userId
    };
    const newRestaurant = await restaurantService.createRestaurant(restaurantData);
    return success(res, 201, 'Restaurant created successfully', newRestaurant);
  } catch (err) {
    return error(res, 400, err.message);
  }
};

exports.updateRestaurant = async (req, res) => {
  try {
    const updated = await restaurantService.updateRestaurant(req.params.id, req.body, req.user.userId);
    return success(res, 200, 'Restaurant updated successfully', updated);
  } catch (err) {
    return error(res, 400, err.message);
  }
};

exports.deleteRestaurant = async (req, res) => {
  try {
    await restaurantService.deleteRestaurant(req.params.id);
    return success(res, 200, 'Restaurant deleted successfully');
  } catch (err) {
    return error(res, 500, err.message);
  }
};