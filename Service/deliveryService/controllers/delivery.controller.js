const deliveryService = require('../services/delivery.service');
const { success, error } = require('../utils/response.util');

exports.createDelivery = async (req, res) => {
  try {
    const delivery = await deliveryService.createDeliveryRecord(req.body);
    return success(res, 201, 'Delivery created successfully', delivery);
  } catch (err) {
    return error(res, 400, err.message);
  }
};

exports.assignRider = async (req, res) => {
  try {
    const { deliveryPersonId } = req.body;
    const delivery = await deliveryService.assignDeliveryPerson(req.params.id, deliveryPersonId);
    return success(res, 200, 'Delivery assigned successfully', delivery);
  } catch (err) {
    return error(res, 400, err.message);
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const delivery = await deliveryService.updateDeliveryStatus(req.params.id, status);
    return success(res, 200, `Delivery status updated to ${status}`, delivery);
  } catch (err) {
    return error(res, 400, err.message);
  }
};

exports.getMyDeliveries = async (req, res) => {
  try {
    const deliveries = await deliveryService.getDeliveriesByRider(req.user.userId);
    return success(res, 200, 'Assigned deliveries fetched', deliveries);
  } catch (err) {
    return error(res, 500, 'Failed to fetch deliveries', err.message);
  }
};

exports.getDeliveryById = async (req, res) => {
  try {
    const delivery = await deliveryService.getDeliveryDetails(req.params.id);
    if (!delivery) return error(res, 404, 'Delivery not found');
    return success(res, 200, 'Delivery details retrieved', delivery);
  } catch (err) {
    return error(res, 500, 'Failed to retrieve delivery', err.message);
  }
};