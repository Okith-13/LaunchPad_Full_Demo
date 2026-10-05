const customerService = require('../services/customer.service');
const { success, error } = require('../utils/response.util');

exports.createProfile = async (req, res) => {
  try {
    const profile = await customerService.createCustomerProfile({ ...req.body, user_id: req.user.userId });
    return success(res, 201, 'Customer profile created', profile);
  } catch (err) {
    return error(res, 400, err.message);
  }
};

exports.getProfile = async (req, res) => {
  try {
    const profile = await customerService.getProfile(req.user.userId);
    if (!profile) return error(res, 404, 'Profile not found');
    return success(res, 200, 'Profile retrieved', profile);
  } catch (err) {
    return error(res, 500, 'Failed to fetch profile', err.message);
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const profile = await customerService.updateProfile(req.user.userId, req.body);
    return success(res, 200, 'Profile updated successfully', profile);
  } catch (err) {
    return error(res, 500, 'Failed to update profile', err.message);
  }
};