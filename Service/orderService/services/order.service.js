const orderRepo = require('../repositories/order.repository');

const VALID_STATUSES = [
  'PENDING', 'CONFIRMED', 'PREPARING', 'READY_FOR_PICKUP',
  'PICKED_UP', 'ON_THE_WAY', 'DELIVERED', 'CANCELLED'
];

exports.placeOrder = async (customer_id, orderPayload) => {
  const { restaurant_id, delivery_address, items, delivery_fee = 2.50 } = orderPayload;

  if (!items || items.length === 0) {
    throw new Error('Order must contain at least one item');
  }

  let subtotal = 0;
  const processedItems = items.map(item => {
    const total_price = Number(item.unit_price) * Number(item.quantity);
    subtotal += total_price;
    return { ...item, total_price };
  });

  const total_amount = subtotal + Number(delivery_fee);

  const orderId = await orderRepo.createOrder(
    { customer_id, restaurant_id, delivery_address, subtotal, delivery_fee, total_amount },
    processedItems
  );

  return orderRepo.getOrderWithItems(orderId);
};

exports.getOrder = async (orderId) => orderRepo.getOrderWithItems(orderId);
exports.getCustomerOrders = async (customerId) => orderRepo.findByCustomerId(customerId);
exports.getRestaurantOrders = async (restaurantId) => orderRepo.findByRestaurantId(restaurantId);

exports.updateOrderStatus = async (orderId, newStatus) => {
  if (!VALID_STATUSES.includes(newStatus)) {
    throw new Error(`Invalid status. Permitted: ${VALID_STATUSES.join(', ')}`);
  }
  return orderRepo.updateStatus(orderId, newStatus);
};