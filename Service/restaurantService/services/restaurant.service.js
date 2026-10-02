const restaurantRepo = require('../repositories/restaurant.repository');

exports.createRestaurant = async (data) => {
  const id = await restaurantRepo.create(data);
  return restaurantRepo.findById(id);
};

exports.getAllRestaurants = async () => restaurantRepo.findAll();
exports.getRestaurantById = async (id) => restaurantRepo.findById(id);
exports.updateStatus = async (id, status) => restaurantRepo.updateStatus(id, status);
exports.deleteRestaurant = async (id) => restaurantRepo.deleteById(id);