const db = require('../config/db');

exports.findByOwnerId = async (ownerId) => {
  const [rows] = await db.query(
    'SELECT * FROM restaurants WHERE owner_id = ? LIMIT 1',
    [ownerId]
  );
  return rows[0] || null;
};

exports.findAll = async () => {
  const [rows] = await db.query('SELECT * FROM restaurants ORDER BY created_at DESC');
  return rows;
};

exports.findById = async (id) => {
  const [rows] = await db.query('SELECT * FROM restaurants WHERE id = ?', [id]);
  return rows[0] || null;
};

exports.create = async (restaurantData) => {
  const contactNumber = restaurantData.contact_number || restaurantData.phone || restaurantData.phone_number || '';
  const { name, description, address, email, opening_time, closing_time, cuisine_type, owner_id } = restaurantData;
  
  let status = 'OPEN';
  if (restaurantData.status) {
    const s = String(restaurantData.status).toUpperCase();
    if (['CLOSED', 'CLOSE', 'INACTIVE'].includes(s)) {
      status = 'CLOSED';
    } else if (['OPEN', 'ACTIVE'].includes(s)) {
      status = 'OPEN';
    }
  }

  const [result] = await db.query(
    `INSERT INTO restaurants (name, description, address, contact_number, email, opening_time, closing_time, cuisine_type, owner_id, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [name, description || '', address, contactNumber, email, opening_time, closing_time, cuisine_type, owner_id, status]
  );
  return result.insertId;
};

exports.update = async (id, data) => {
  const fields = [];
  const values = [];

  if (data.name !== undefined) {
    fields.push('name = ?');
    values.push(data.name);
  }
  if (data.description !== undefined) {
    fields.push('description = ?');
    values.push(data.description);
  }
  if (data.address !== undefined) {
    fields.push('address = ?');
    values.push(data.address);
  }
  if (data.email !== undefined) {
    fields.push('email = ?');
    values.push(data.email);
  }
  if (data.opening_time !== undefined) {
    fields.push('opening_time = ?');
    values.push(data.opening_time);
  }
  if (data.closing_time !== undefined) {
    fields.push('closing_time = ?');
    values.push(data.closing_time);
  }
  if (data.cuisine_type !== undefined) {
    fields.push('cuisine_type = ?');
    values.push(data.cuisine_type);
  }
  if (data.contact_number !== undefined || data.phone !== undefined || data.phone_number !== undefined) {
    fields.push('contact_number = ?');
    values.push(data.contact_number || data.phone || data.phone_number);
  }

  // Map to strictly allowed ENUM values ('OPEN' or 'CLOSED')
  if (data.status !== undefined) {
    const s = String(data.status).toUpperCase();
    let validatedStatus = 'OPEN';

    if (['CLOSED', 'CLOSE', 'INACTIVE'].includes(s)) {
      validatedStatus = 'CLOSED';
    } else if (['OPEN', 'ACTIVE'].includes(s)) {
      validatedStatus = 'OPEN';
    }

    fields.push('status = ?');
    values.push(validatedStatus);
  }

  if (fields.length === 0) return true;

  values.push(id);
  const [result] = await db.query(
    `UPDATE restaurants SET ${fields.join(', ')} WHERE id = ?`,
    values
  );
  return result.affectedRows > 0;
};

exports.delete = async (id) => {
  const [result] = await db.query('DELETE FROM restaurants WHERE id = ?', [id]);
  return result.affectedRows > 0;
};