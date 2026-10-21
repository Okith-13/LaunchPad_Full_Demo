const deliveryRepo = require('../repositories/delivery.repository');

const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL || 'http://order-service:5003';

const VALID_DELIVERY_STATUSES = [
  'PENDING', 'ASSIGNED', 'PICKUP_PENDING', 'PICKED_UP',
  'ON_THE_WAY', 'DELIVERED', 'FAILED', 'CANCELLED'
];

exports.createDeliveryRecord = async (data) => {
  const existing = await deliveryRepo.findByOrderId(data.order_id);
  if (existing) {
    return existing;
  }
  const id = await deliveryRepo.create(data);
  return deliveryRepo.findById(id);
};

exports.getAvailableDeliveries = async () => {
  return deliveryRepo.findAvailableUnassigned();
};

exports.acceptDelivery = async (deliveryId, deliveryPersonId) => {
  const claimed = await deliveryRepo.claimDelivery(deliveryId, deliveryPersonId);
  if (!claimed) {
    const error = new Error('Delivery is already assigned or no longer available');
    error.statusCode = 400;
    throw error;
  }
  return deliveryRepo.findById(deliveryId);
};

exports.assignDeliveryPerson = async (deliveryId, deliveryPersonId) => {
  const delivery = await deliveryRepo.findById(deliveryId);
  if (!delivery) {
    const error = new Error('Delivery record not found');
    error.statusCode = 404;
    throw error;
  }
  await deliveryRepo.assignRider(deliveryId, deliveryPersonId);
  return deliveryRepo.findById(deliveryId);
};

exports.updateDeliveryStatus = async (deliveryId, status, authToken = null) => {
  if (!VALID_DELIVERY_STATUSES.includes(status)) {
    const error = new Error(`Invalid delivery status. Allowed: ${VALID_DELIVERY_STATUSES.join(', ')}`);
    error.statusCode = 400;
    throw error;
  }

  let timestampColumn = null;
  if (status === 'PICKED_UP') timestampColumn = 'pickup_time';
  if (status === 'DELIVERED') timestampColumn = 'delivered_time';

  const updated = await deliveryRepo.updateStatus(deliveryId, status, timestampColumn);
  if (!updated) {
    const error = new Error('Delivery record not found');
    error.statusCode = 404;
    throw error;
  }

  const delivery = await deliveryRepo.findById(deliveryId);

  // Map Delivery status to Order status
  let targetOrderStatus = null;
  if (status === 'PICKED_UP') targetOrderStatus = 'PICKED_UP';
  else if (status === 'ON_THE_WAY') targetOrderStatus = 'ON_THE_WAY';
  else if (status === 'DELIVERED') targetOrderStatus = 'DELIVERED';
  else if (status === 'CANCELLED' || status === 'FAILED') targetOrderStatus = 'CANCELLED';

  if (targetOrderStatus && delivery.order_id) {
    const targetUrl = `${ORDER_SERVICE_URL}/api/orders/${delivery.order_id}/status`;
    console.log(`[DeliveryService] Syncing to: ${targetUrl} with status: ${targetOrderStatus}`);

    try {
      const headers = {
        'Content-Type': 'application/json'
      };

      if (authToken) {
        headers['Authorization'] = authToken.startsWith('Bearer ')
          ? authToken
          : `Bearer ${authToken}`;
      } else {
        console.warn('[DeliveryService] WARNING: No authToken provided for order status sync!');
      }

      const syncRes = await fetch(targetUrl, {
        method: 'PATCH',
        headers: headers,
        body: JSON.stringify({ status: targetOrderStatus })
      });

      const responseBody = await syncRes.json().catch(() => ({}));

      if (!syncRes.ok) {
        console.error(`Sync to Order Service failed with status ${syncRes.status}:`, responseBody);
      } else {
        console.log(`[DeliveryService] Order #${delivery.order_id} successfully synced to ${targetOrderStatus}`);
      }
    } catch (syncErr) {
      console.error('Notice: Failed to sync status to Order Service:', syncErr.message);
    }
  }

  return delivery;
};

exports.getDeliveriesByRider = async (riderId) => deliveryRepo.findByDeliveryPersonId(riderId);
exports.getDeliveryDetails = async (id) => deliveryRepo.findById(id);