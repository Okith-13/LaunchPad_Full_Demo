const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepo = require('../repositories/user.repository');

const VALID_ROLES = ['ADMIN', 'CUSTOMER', 'RESTAURANT_ADMIN', 'DELIVERY_PERSON'];

const generateAccessToken = (user) => {
  return jwt.sign(
    { userId: user.id, email: user.email, role: user.role, status: user.status },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '15m' }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { userId: user.id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '7d' }
  );
};

exports.registerUser = async ({ name, email, password, role }) => {
  const existing = await userRepo.findByEmail(email);
  if (existing) {
    const error = new Error('Email already registered');
    error.statusCode = 409;
    throw error;
  }

  const assignedRole = VALID_ROLES.includes(role) ? role : 'CUSTOMER';
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const newUserId = await userRepo.create({
    name,
    email,
    passwordHash,
    role: assignedRole,
  });

  return userRepo.findById(newUserId);
};

exports.loginUser = async ({ email, password }) => {
  const user = await userRepo.findByEmail(email);
  if (!user) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  if (user.status !== 'ACTIVE') {
    const error = new Error('Account is inactive. Please contact support');
    error.statusCode = 403;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  await userRepo.updateRefreshToken(user.id, refreshToken);

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    },
  };
};

exports.refreshSession = async (incomingRefreshToken) => {
  const user = await userRepo.findByRefreshToken(incomingRefreshToken);
  if (!user) {
    const error = new Error('Invalid or revoked refresh token');
    error.statusCode = 403;
    throw error;
  }

  return new Promise((resolve, reject) => {
    jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET, async (err) => {
      if (err) {
        const error = new Error('Expired or invalid refresh token');
        error.statusCode = 403;
        return reject(error);
      }

      const newAccessToken = generateAccessToken(user);
      const newRefreshToken = generateRefreshToken(user);

      await userRepo.updateRefreshToken(user.id, newRefreshToken);

      resolve({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });
    });
  });
};

exports.deleteUserById = async (id) => {
  const deleted = await userRepo.deleteById(id);
  if (!deleted) {
    const error = new Error(`User with ID ${id} not found`);
    error.statusCode = 404;
    throw error;
  }
  return true;
};