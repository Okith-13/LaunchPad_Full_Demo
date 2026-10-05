const customerRepo = require('../repositories/customer.repository');

exports.createCustomerProfile = async (profileData) => {
  const existing = await customerRepo.findByUserId(profileData.user_id);
  if (existing) throw new Error('Customer profile already exists for this user');
  const id = await customerRepo.create(profileData);
  return customerRepo.findById(id);
};

exports.getProfile = async (userId) => customerRepo.findByUserId(userId);

exports.updateProfile = async (userId, data) => {
  await customerRepo.updateProfile(userId, data);
  return customerRepo.findByUserId(userId);
};