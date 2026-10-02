const orderService = require('../services/order.service');
const { success, error } = require('../utils/response.util');

exports.createOrder = async (req, res) => {
  try {
    const customerId = req.user ? req.user.userId : req.body.customer_id;
    const order = await orderService.placeOrder(customerId, req.body);
    return success(res, 201, 'Order created successfully', order);
  } catch (err) {
    return error(res, 400, err.message);
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await orderService.getOrder(req.params.id);
    if (!order) return error(res, 404, 'Order not found');
    return success(res, 200, 'Order retrieved successfully', order);
  } catch (err) {
    return error(res, 500, 'Failed to fetch order', err.message);
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const customerId = req.user.userId;
    const orders = await orderService.getCustomerOrders(customerId);
    return success(res, 200, 'Orders retrieved successfully', orders);
  } catch (err) {
    return error(res, 500, 'Failed to fetch orders', err.message);
  }
};

exports.getRestaurantOrders = async (req, res) => {
  try {
    const orders = await orderService.getRestaurantOrders(req.params.restaurantId);
    return success(res, 200, 'Restaurant orders retrieved', orders);
  } catch (err) {
    return error(res, 500, 'Failed to fetch restaurant orders', err.message);
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await orderService.updateOrderStatus(req.params.id, status);
    if (!updated) return error(res, 404, 'Order not found');
    return success(res, 200, `Order status updated to ${status}`);
  } catch (err) {
    return error(res, 400, err.message);
  }
};