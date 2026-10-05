const addressService = require('../services/address.service');
const { success, error } = require('../utils/response.util');

exports.addAddress = async (req, res) => {
  try {
    const addresses = await addressService.addAddress(req.user.userId, req.body);
    return success(res, 201, 'Address added successfully', addresses);
  } catch (err) {
    return error(res, 400, err.message);
  }
};

exports.getAddresses = async (req, res) => {
  try {
    const addresses = await addressService.getAddresses(req.user.userId);
    return success(res, 200, 'Addresses retrieved', addresses);
  } catch (err) {
    return error(res, 500, 'Failed to retrieve addresses', err.message);
  }
};

exports.deleteAddress = async (req, res) => {
  try {
    const deleted = await addressService.removeAddress(req.user.userId, req.params.id);
    if (!deleted) return error(res, 404, 'Address not found');
    return success(res, 200, 'Address deleted successfully');
  } catch (err) {
    return error(res, 500, 'Failed to delete address', err.message);
  }
};