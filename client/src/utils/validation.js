export function validateEmail(email) {
  if (!email) return true; // Optional field
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function validatePhone(phone) {
  if (!phone) return true; // Optional field
  const re = /^[\d\s\-\+\(\)]+$/;
  return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

export function validateRequired(value) {
  return value && value.trim().length > 0;
}

export function getValidationError(field, value, rules = {}) {
  if (rules.required && !validateRequired(value)) {
    return `${field} is required`;
  }
  if (value && rules.email && !validateEmail(value)) {
    return `${field} must be a valid email address`;
  }
  if (value && rules.phone && !validatePhone(value)) {
    return `${field} must be a valid phone number`;
  }
  if (value && rules.minLength && value.length < rules.minLength) {
    return `${field} must be at least ${rules.minLength} characters`;
  }
  return null;
}

