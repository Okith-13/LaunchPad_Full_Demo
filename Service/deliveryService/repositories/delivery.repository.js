const db = require('../config/db');

exports.create = async (deliveryData) => {
  const { order_id, restaurant_id, customer_id, pickup_address, delivery_address } = deliveryData;
  const [result] = await db.query(
    `INSERT INTO deliveries 
     (order_id, restaurant_id, customer_id, pickup_address, delivery_address, status) 
     VALUES (?, ?, ?, ?, ?, 'PENDING')`,
    [order_id, restaurant_id, customer_id, pickup_address, delivery_address]
  );
  return result.insertId;
};

exports.findById = async (id) => {
  const [rows] = await db.query('SELECT * FROM deliveries WHERE id = ?', [id]);
  return rows[0];
};

exports.findByOrderId = async (orderId) => {
  const [rows] = await db.query('SELECT * FROM deliveries WHERE order_id = ?', [orderId]);
  return rows[0];
};

exports.findByDeliveryPersonId = async (deliveryPersonId) => {
  const [rows] = await db.query('SELECT * FROM deliveries WHERE delivery_person_id = ? ORDER BY created_at DESC', [deliveryPersonId]);
  return rows;
};

exports.assignRider = async (deliveryId, deliveryPersonId) => {
  const [result] = await db.query(
    `UPDATE deliveries 
     SET delivery_person_id = ?, status = 'ASSIGNED', assigned_time = NOW() 
     WHERE id = ?`,
    [deliveryPersonId, deliveryId]
  );
  return result.affectedRows > 0;
};

exports.updateStatus = async (deliveryId, status, timestampColumn = null) => {
  let query = 'UPDATE deliveries SET status = ?';
  const params = [status];

  if (timestampColumn) {
    query += `, ${timestampColumn} = NOW()`;
  }
  query += ' WHERE id = ?';
  params.push(deliveryId);

  const [result] = await db.query(query, params);
  return result.affectedRows > 0;
};