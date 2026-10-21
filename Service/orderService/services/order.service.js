const orderRepo = require('../repositories/order.repository');

const RESTAURANT_SERVICE_URL = process.env.RESTAURANT_SERVICE_URL || 'http://restaurant-service:5002';
const DELIVERY_SERVICE_URL = process.env.DELIVERY_SERVICE_URL || 'http://delivery-service:5004';

const VALID_STATUSES = [
  'PENDING', 'CONFIRMED', 'PREPARING', 'READY_FOR_PICKUP',
  'PICKED_UP', 'ON_THE_WAY', 'DELIVERED', 'CANCELLED'
];

exports.placeOrder = async (customer_id, orderPayload) => {
  const { restaurant_id, delivery_address, items, delivery_fee = 250 } = orderPayload;

  if (!items || items.length === 0) {
    const error = new Error('Order must contain at least one item');
    error.statusCode = 400;
    throw error;
  }

  // 1. Fetch official menu items from Restaurant Service to verify price
  const response = await fetch(`${RESTAURANT_SERVICE_URL}/api/menu/restaurant/${restaurant_id}`);
  if (!response.ok) {
    const error = new Error('Failed to verify menu items with Restaurant Service');
    error.statusCode = 502;
    throw error;
  }

  const menuData = await response.json();
  const availableMenuItems = menuData.data || [];

  let subtotal = 0;
  const verifiedItems = [];

  for (const item of items) {
    const officialItem = availableMenuItems.find(m => m.id === Number(item.menu_item_id));

    if (!officialItem) {
      const error = new Error(`Menu item with ID ${item.menu_item_id} does not exist for this restaurant`);
      error.statusCode = 400;
      throw error;
    }

    if (!officialItem.availability) {
      const error = new Error(`Item "${officialItem.item_name}" is currently unavailable`);
      error.statusCode = 400;
      throw error;
    }

    const unitPrice = Number(officialItem.price);
    const lineTotal = unitPrice * Number(item.quantity);
    subtotal += lineTotal;

    verifiedItems.push({
      menu_item_id: officialItem.id,
      item_name: officialItem.item_name,
      quantity: Number(item.quantity),
      unit_price: unitPrice,
      total_price: lineTotal
    });
  }

  const total_amount = subtotal + Number(delivery_fee);

  const orderId = await orderRepo.createOrder(
    { customer_id, restaurant_id, delivery_address, subtotal, delivery_fee, total_amount },
    verifiedItems
  );

  return orderRepo.getOrderWithItems(orderId);
};

exports.getOrder = async (orderId) => orderRepo.getOrderWithItems(orderId);
exports.getCustomerOrders = async (customerId) => orderRepo.findByCustomerId(customerId);
exports.getRestaurantOrders = async (restaurantId) => orderRepo.findByRestaurantId(restaurantId);

exports.updateOrderStatus = async (orderId, newStatus, authToken = null) => {
  if (!VALID_STATUSES.includes(newStatus)) {
    const error = new Error(`Invalid status. Permitted: ${VALID_STATUSES.join(', ')}`);
    error.statusCode = 400;
    throw error;
  }

  const order = await orderRepo.getOrderWithItems(orderId);
  if (!order) {
    const error = new Error('Order not found');
    error.statusCode = 404;
    throw error;
  }

  // Status Lifecycle rules
  if (order.order_status === 'DELIVERED' || order.order_status === 'CANCELLED') {
    const error = new Error(`Cannot change status of an order that is already ${order.order_status}`);
    error.statusCode = 400;
    throw error;
  }

  console.log(`[OrderService] Transitioning Order #${orderId} from ${order.order_status} -> ${newStatus}`);

  await orderRepo.updateStatus(orderId, newStatus);

  // When order reaches READY_FOR_PICKUP, automatically create delivery record in Delivery Service
  if (newStatus === 'READY_FOR_PICKUP') {
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (authToken) {
        headers['Authorization'] = authToken.startsWith('Bearer ') ? authToken : `Bearer ${authToken}`;
      }

      await fetch(`${DELIVERY_SERVICE_URL}/api/deliveries`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          order_id: order.id,
          restaurant_id: order.restaurant_id,
          customer_id: order.customer_id,
          pickup_address: `Restaurant #${order.restaurant_id} Dispatch Counter`,
          delivery_address: order.delivery_address
        })
      });
    } catch (deliveryErr) {
      console.error('Notice: Auto delivery generation skipped or failed:', deliveryErr.message);
    }
  }

  return orderRepo.getOrderWithItems(orderId);
};