const db = require('../config/db');

exports.findByRestaurantId = async (restaurantId) => {
  const [rows] = await db.query(
    'SELECT * FROM menu_items WHERE restaurant_id = ? ORDER BY category, item_name',
    [restaurantId]
  );
  return rows;
};

exports.findById = async (id) => {
  const [rows] = await db.query('SELECT * FROM menu_items WHERE id = ?', [id]);
  return rows[0] || null;
};

exports.create = async (itemData) => {
  const { restaurant_id, item_name, description, price, category, availability } = itemData;
  const isAvailable = availability !== undefined ? availability : true;

  const [result] = await db.query(
    `INSERT INTO menu_items (restaurant_id, item_name, description, price, category, availability)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [restaurant_id, item_name, description || '', price, category || 'General', isAvailable]
  );
  return result.insertId;
};

exports.update = async (id, data) => {
  const fields = [];
  const values = [];

  if (data.item_name !== undefined) {
    fields.push('item_name = ?');
    values.push(data.item_name);
  }
  if (data.description !== undefined) {
    fields.push('description = ?');
    values.push(data.description);
  }
  if (data.price !== undefined) {
    fields.push('price = ?');
    values.push(data.price);
  }
  if (data.category !== undefined) {
    fields.push('category = ?');
    values.push(data.category);
  }
  if (data.availability !== undefined || data.is_available !== undefined) {
    fields.push('availability = ?');
    values.push(Boolean(data.availability ?? data.is_available));
  }

  if (fields.length === 0) return true;

  values.push(id);
  const [result] = await db.query(
    `UPDATE menu_items SET ${fields.join(', ')} WHERE id = ?`,
    values
  );
  return result.affectedRows > 0;
};

exports.delete = async (id) => {
  const [result] = await db.query('DELETE FROM menu_items WHERE id = ?', [id]);
  return result.affectedRows > 0;
};