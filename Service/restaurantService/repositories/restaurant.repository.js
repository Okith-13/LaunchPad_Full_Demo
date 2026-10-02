const db = require('../config/db');

exports.create = async (restaurantData) => {
  const { owner_id, name, description, address, contact_number, email, cuisine_type, opening_time, closing_time } = restaurantData;
  const [result] = await db.query(
    `INSERT INTO restaurants 
     (owner_id, name, description, address, contact_number, email, cuisine_type, opening_time, closing_time) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [owner_id, name, description, address, contact_number, email, cuisine_type, opening_time, closing_time]
  );
  return result.insertId;
};

exports.findAll = async () => {
  const [rows] = await db.query('SELECT * FROM restaurants');
  return rows;
};

exports.findById = async (id) => {
  const [rows] = await db.query('SELECT * FROM restaurants WHERE id = ?', [id]);
  return rows[0];
};

exports.updateStatus = async (id, status) => {
  const [result] = await db.query('UPDATE restaurants SET status = ? WHERE id = ?', [status, id]);
  return result.affectedRows > 0;
};

exports.deleteById = async (id) => {
  const [result] = await db.query('DELETE FROM restaurants WHERE id = ?', [id]);
  return result.affectedRows > 0;
};