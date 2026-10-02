const menuRepo = require('../repositories/menu.repository');

exports.addMenuItem = async (data) => {
  const id = await menuRepo.create(data);
  return menuRepo.findById(id);
};

exports.getItemsByRestaurant = async (restaurantId) => menuRepo.findByRestaurantId(restaurantId);
exports.getMenuItem = async (id) => menuRepo.findById(id);
exports.setAvailability = async (id, availability) => menuRepo.updateAvailability(id, availability);