const db = require('../config/db');

exports.create = async (menuData) => {
  const { restaurant_id, item_name, description, category, price, availability, image_url } = menuData;
  const [result] = await db.query(
    `INSERT INTO menu_items (restaurant_id, item_name, description, category, price, availability, image_url)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [restaurant_id, item_name, description, category, price, availability !== undefined ? availability : true, image_url]
  );
  return result.insertId;
};

exports.findByRestaurantId = async (restaurantId) => {
  const [rows] = await db.query('SELECT * FROM menu_items WHERE restaurant_id = ?', [restaurantId]);
  return rows;
};

exports.findById = async (id) => {
  const [rows] = await db.query('SELECT * FROM menu_items WHERE id = ?', [id]);
  return rows[0];
};

exports.updateAvailability = async (id, availability) => {
  const [result] = await db.query('UPDATE menu_items SET availability = ? WHERE id = ?', [availability, id]);
  return result.affectedRows > 0;
};