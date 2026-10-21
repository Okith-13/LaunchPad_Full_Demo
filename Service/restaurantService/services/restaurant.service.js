const restaurantRepo = require('../repositories/restaurant.repository');

exports.getRestaurantByOwnerId = async (ownerId) => {
  return restaurantRepo.findByOwnerId(ownerId);
};

exports.getAllRestaurants = async (filters) => {
  return restaurantRepo.findAll(filters);
};

exports.getRestaurantById = async (id) => {
  return restaurantRepo.findById(id);
};

exports.createRestaurant = async (data) => {
  const id = await restaurantRepo.create(data);
  return restaurantRepo.findById(id);
};

exports.updateRestaurant = async (id, data, requesterId) => {
  const existing = await restaurantRepo.findById(id);
  if (!existing) {
    const err = new Error('Restaurant not found');
    err.statusCode = 404;
    throw err;
  }
  if (existing.owner_id && existing.owner_id !== requesterId) {
    const err = new Error('You do not have permission to modify this restaurant');
    err.statusCode = 403;
    throw err;
  }
  await restaurantRepo.update(id, data);
  return restaurantRepo.findById(id);
};

exports.deleteRestaurant = async (id) => {
  return restaurantRepo.delete(id);
};