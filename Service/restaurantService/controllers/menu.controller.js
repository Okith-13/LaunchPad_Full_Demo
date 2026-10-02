const menuService = require('../services/menu.service');
const { success, error } = require('../utils/response.util');

exports.createMenuItem = async (req, res) => {
  try {
    const item = await menuService.addMenuItem(req.body);
    return success(res, 201, 'Menu item added successfully', item);
  } catch (err) {
    return error(res, 500, 'Failed to create menu item', err.message);
  }
};

exports.getMenuByRestaurant = async (req, res) => {
  try {
    const items = await menuService.getItemsByRestaurant(req.params.restaurantId);
    return success(res, 200, 'Menu fetched successfully', items);
  } catch (err) {
    return error(res, 500, 'Failed to fetch menu', err.message);
  }
};

exports.updateAvailability = async (req, res) => {
  try {
    const { availability } = req.body;
    const updated = await menuService.setAvailability(req.params.id, availability);
    if (!updated) return error(res, 404, 'Menu item not found');
    return success(res, 200, 'Menu item availability updated');
  } catch (err) {
    return error(res, 500, 'Failed to update availability', err.message);
  }
};