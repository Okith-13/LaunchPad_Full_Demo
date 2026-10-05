const db = require('../config/db');

exports.create = async (addressData) => {
  const { customer_id, address_name, address_lines, city, postal_code, latitude, longitude, is_default } = addressData;
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    if (is_default) {
      await connection.query('UPDATE customer_addresses SET is_default = FALSE WHERE customer_id = ?', [customer_id]);
    }

    const [result] = await connection.query(
      `INSERT INTO customer_addresses 
       (customer_id, address_name, address_lines, city, postal_code, latitude, longitude, is_default)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [customer_id, address_name, address_lines, city, postal_code, latitude || null, longitude || null, is_default || false]
    );

    await connection.commit();
    return result.insertId;
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
};

exports.findByCustomerId = async (customerId) => {
  const [rows] = await db.query('SELECT * FROM customer_addresses WHERE customer_id = ?', [customerId]);
  return rows;
};

exports.deleteAddress = async (addressId, customerId) => {
  const [result] = await db.query('DELETE FROM customer_addresses WHERE id = ? AND customer_id = ?', [addressId, customerId]);
  return result.affectedRows > 0;
};