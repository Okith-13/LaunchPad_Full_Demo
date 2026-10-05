const deliveryRepo = require('../repositories/delivery.repository');

const VALID_DELIVERY_STATUSES = [
  'PENDING', 'ASSIGNED', 'PICKUP_PENDING', 'PICKED_UP',
  'ON_THE_WAY', 'DELIVERED', 'FAILED', 'CANCELLED'
];

exports.createDeliveryRecord = async (data) => {
  const existing = await deliveryRepo.findByOrderId(data.order_id);
  if (existing) throw new Error(`Delivery record for order ${data.order_id} already exists`);
  const id = await deliveryRepo.create(data);
  return deliveryRepo.findById(id);
};

exports.assignDeliveryPerson = async (deliveryId, deliveryPersonId) => {
  const delivery = await deliveryRepo.findById(deliveryId);
  if (!delivery) throw new Error('Delivery record not found');
  await deliveryRepo.assignRider(deliveryId, deliveryPersonId);
  return deliveryRepo.findById(deliveryId);
};

exports.updateDeliveryStatus = async (deliveryId, status) => {
  if (!VALID_DELIVERY_STATUSES.includes(status)) {
    throw new Error(`Invalid delivery status. Allowed: ${VALID_DELIVERY_STATUSES.join(', ')}`);
  }

  let timestampColumn = null;
  if (status === 'PICKED_UP') timestampColumn = 'pickup_time';
  if (status === 'DELIVERED') timestampColumn = 'delivered_time';

  const updated = await deliveryRepo.updateStatus(deliveryId, status, timestampColumn);
  if (!updated) throw new Error('Delivery record not found');
  return deliveryRepo.findById(deliveryId);
};

exports.getDeliveriesByRider = async (riderId) => deliveryRepo.findByDeliveryPersonId(riderId);
exports.getDeliveryDetails = async (id) => deliveryRepo.findById(id);