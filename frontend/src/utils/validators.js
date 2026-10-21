export const validateEmail = (email) => {
  if (!email || !email.trim()) return 'Email is required';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'Invalid email address';
  return '';
};

export const validatePassword = (password) => {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters';
  return '';
};

export const validateRequired = (val, fieldName = 'Field') => {
  if (val === undefined || val === null || String(val).trim() === '') {
    return `${fieldName} is required`;
  }
  return '';
};

export const validatePositiveNumber = (val, fieldName = 'Value') => {
  if (val === undefined || val === null || String(val).trim() === '') {
    return `${fieldName} is required`;
  }
  const num = Number(val);
  if (isNaN(num) || num <= 0) return `${fieldName} must be a number greater than 0`;
  return '';
};