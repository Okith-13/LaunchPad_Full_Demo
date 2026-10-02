const restaurantService = require('../services/restaurant.service');
const { success, error } = require('../utils/response.util');

exports.createRestaurant = async (req, res) => {
  try {
    const owner_id = req.user ? req.user.userId : req.body.owner_id;
    const newRestaurant = await restaurantService.createRestaurant({ ...req.body, owner_id });
    return success(res, 201, 'Restaurant registered successfully', newRestaurant);
  } catch (err) {
    return error(res, 500, 'Failed to create restaurant', err.message);
  }
};

exports.getRestaurants = async (req, res) => {
  try {
    const restaurants = await restaurantService.getAllRestaurants();
    return success(res, 200, 'Restaurants fetched successfully', restaurants);
  } catch (err) {
    return error(res, 500, 'Failed to fetch restaurants', err.message);
  }
};

exports.getRestaurantById = async (req, res) => {
  try {
    const restaurant = await restaurantService.getRestaurantById(req.params.id);
    if (!restaurant) return error(res, 404, 'Restaurant not found');
    return success(res, 200, 'Restaurant fetched successfully', restaurant);
  } catch (err) {
    return error(res, 500, 'Failed to fetch restaurant', err.message);
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await restaurantService.updateStatus(req.params.id, status);
    if (!updated) return error(res, 404, 'Restaurant not found');
    return success(res, 200, `Restaurant status updated to ${status}`);
  } catch (err) {
    return error(res, 500, 'Failed to update status', err.message);
  }
};

exports.deleteRestaurant = async (req, res) => {
  try {
    const deleted = await restaurantService.deleteRestaurant(req.params.id);
    if (!deleted) return error(res, 404, 'Restaurant not found');
    return success(res, 200, 'Restaurant deleted successfully');
  } catch (err) {
    return error(res, 500, 'Failed to delete restaurant', err.message);
  }
};