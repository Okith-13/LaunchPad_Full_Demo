const db = require('../config/db');

exports.createOrder = async (orderData, items) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const [orderResult] = await connection.query(
      `INSERT INTO orders (customer_id, restaurant_id, delivery_address, subtotal, delivery_fee, total_amount, order_status)
       VALUES (?, ?, ?, ?, ?, ?, 'PENDING')`,
      [orderData.customer_id, orderData.restaurant_id, orderData.delivery_address, orderData.subtotal, orderData.delivery_fee, orderData.total_amount]
    );

    const orderId = orderResult.insertId;

    for (const item of items) {
      await connection.query(
        `INSERT INTO order_items (order_id, menu_item_id, item_name, quantity, unit_price, total_price)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [orderId, item.menu_item_id, item.item_name, item.quantity, item.unit_price, item.total_price]
      );
    }

    await connection.commit();
    return orderId;
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
};

exports.getOrderWithItems = async (orderId) => {
  const [orderRows] = await db.query('SELECT * FROM orders WHERE id = ?', [orderId]);
  if (orderRows.length === 0) return null;

  const [itemRows] = await db.query('SELECT * FROM order_items WHERE order_id = ?', [orderId]);
  return { ...orderRows[0], items: itemRows };
};

exports.findByCustomerId = async (customerId) => {
  const [rows] = await db.query('SELECT * FROM orders WHERE customer_id = ? ORDER BY created_at DESC', [customerId]);
  return rows;
};

exports.findByRestaurantId = async (restaurantId) => {
  const [rows] = await db.query('SELECT * FROM orders WHERE restaurant_id = ? ORDER BY created_at DESC', [restaurantId]);
  return rows;
};

exports.updateStatus = async (orderId, status) => {
  const [result] = await db.query('UPDATE orders SET order_status = ? WHERE id = ?', [status, orderId]);
  return result.affectedRows > 0;
};