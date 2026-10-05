const db = require('../config/db');

exports.create = async ({ user_id, first_name, last_name, phone_number, profile_image }) => {
  const [result] = await db.query(
    `INSERT INTO customers (user_id, first_name, last_name, phone_number, profile_image)
     VALUES (?, ?, ?, ?, ?)`,
    [user_id, first_name, last_name, phone_number, profile_image || null]
  );
  return result.insertId;
};

exports.findByUserId = async (userId) => {
  const [rows] = await db.query('SELECT * FROM customers WHERE user_id = ?', [userId]);
  return rows[0];
};

exports.findById = async (id) => {
  const [rows] = await db.query('SELECT * FROM customers WHERE id = ?', [id]);
  return rows[0];
};

exports.updateProfile = async (userId, { first_name, last_name, phone_number, profile_image }) => {
  const [result] = await db.query(
    `UPDATE customers 
     SET first_name = ?, last_name = ?, phone_number = ?, profile_image = ? 
     WHERE user_id = ?`,
    [first_name, last_name, phone_number, profile_image, userId]
  );
  return result.affectedRows > 0;
};