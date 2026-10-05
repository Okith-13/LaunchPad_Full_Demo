const addressRepo = require('../repositories/address.repository');
const customerRepo = require('../repositories/customer.repository');

exports.addAddress = async (userId, addressData) => {
  const customer = await customerRepo.findByUserId(userId);
  if (!customer) throw new Error('Customer profile not found. Please create profile first');
  const id = await addressRepo.create({ ...addressData, customer_id: customer.id });
  return addressRepo.findByCustomerId(customer.id);
};

exports.getAddresses = async (userId) => {
  const customer = await customerRepo.findByUserId(userId);
  if (!customer) return [];
  return addressRepo.findByCustomerId(customer.id);
};

exports.removeAddress = async (userId, addressId) => {
  const customer = await customerRepo.findByUserId(userId);
  if (!customer) throw new Error('Customer profile not found');
  return addressRepo.deleteAddress(addressId, customer.id);
};