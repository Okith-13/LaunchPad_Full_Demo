const db = require('../config/db');

exports.findByEmail = async (email) => {
  const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
};

exports.findById = async (id) => {
  const [rows] = await db.query(
    'SELECT id, name, email, role, status, created_at, updated_at FROM users WHERE id = ?',
    [id]
  );
  return rows[0];
};

exports.findByRefreshToken = async (refreshToken) => {
  const [rows] = await db.query('SELECT * FROM users WHERE refresh_token = ?', [refreshToken]);
  return rows[0];
};

exports.create = async ({ name, email, passwordHash, role }) => {
  const [result] = await db.query(
    'INSERT INTO users (name, email, password_hash, role, status) VALUES (?, ?, ?, ?, "ACTIVE")',
    [name, email, passwordHash, role]
  );
  return result.insertId;
};

exports.updateRefreshToken = async (userId, refreshToken) => {
  await db.query('UPDATE users SET refresh_token = ? WHERE id = ?', [refreshToken, userId]);
};

exports.deleteById = async (id) => {
  const [result] = await db.query('DELETE FROM users WHERE id = ?', [id]);
  return result.affectedRows > 0;
};