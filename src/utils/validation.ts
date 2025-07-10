// Validation utility functions and schemas

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Email validation
export const validateEmail = (email: string): ValidationError | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!email) {
    return { field: 'email', message: 'Email is required' };
  }
  
  if (!emailRegex.test(email)) {
    return { field: 'email', message: 'Please enter a valid email address' };
  }
  
  return null;
};

// Password validation
export const validatePassword = (password: string): ValidationError | null => {
  if (!password) {
    return { field: 'password', message: 'Password is required' };
  }
  
  if (password.length < 6) {
    return { field: 'password', message: 'Password must be at least 6 characters long' };
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    return { field: 'password', message: 'Password must contain at least one lowercase letter' };
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    return { field: 'password', message: 'Password must contain at least one uppercase letter' };
  }
  
  if (!/(?=.*\d)/.test(password)) {
    return { field: 'password', message: 'Password must contain at least one number' };
  }
  
  return null;
};

// Name validation
export const validateName = (name: string): ValidationError | null => {
  if (!name) {
    return { field: 'name', message: 'Name is required' };
  }
  
  if (name.trim().length < 2) {
    return { field: 'name', message: 'Name must be at least 2 characters long' };
  }
  
  if (name.trim().length > 50) {
    return { field: 'name', message: 'Name cannot exceed 50 characters' };
  }
  
  if (!/^[a-zA-Z\s]+$/.test(name)) {
    return { field: 'name', message: 'Name can only contain letters and spaces' };
  }
  
  return null;
};

// Phone validation
export const validatePhone = (phone: string): ValidationError | null => {
  if (!phone) {
    return { field: 'phone', message: 'Phone number is required' };
  }
  
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  
  if (!phoneRegex.test(cleanPhone)) {
    return { field: 'phone', message: 'Please enter a valid phone number' };
  }
  
  if (cleanPhone.length < 10 || cleanPhone.length > 15) {
    return { field: 'phone', message: 'Phone number must be between 10 and 15 digits' };
  }
  
  return null;
};

// Address validation
export const validateAddress = (address: string): ValidationError | null => {
  if (!address) {
    return { field: 'address', message: 'Address is required' };
  }
  
  if (address.trim().length < 10) {
    return { field: 'address', message: 'Address must be at least 10 characters long' };
  }
  
  if (address.trim().length > 200) {
    return { field: 'address', message: 'Address cannot exceed 200 characters' };
  }
  
  return null;
};

// City validation
export const validateCity = (city: string): ValidationError | null => {
  if (!city) {
    return { field: 'city', message: 'City is required' };
  }
  
  if (city.trim().length < 2) {
    return { field: 'city', message: 'City name must be at least 2 characters long' };
  }
  
  if (!/^[a-zA-Z\s]+$/.test(city)) {
    return { field: 'city', message: 'City name can only contain letters and spaces' };
  }
  
  return null;
};

// State validation
export const validateState = (state: string): ValidationError | null => {
  if (!state) {
    return { field: 'state', message: 'State is required' };
  }
  
  if (state.trim().length < 2) {
    return { field: 'state', message: 'State name must be at least 2 characters long' };
  }
  
  return null;
};

// PIN code validation (Indian format)
export const validatePincode = (pincode: string): ValidationError | null => {
  if (!pincode) {
    return { field: 'pincode', message: 'PIN code is required' };
  }
  
  const pincodeRegex = /^[1-9][0-9]{5}$/;
  
  if (!pincodeRegex.test(pincode)) {
    return { field: 'pincode', message: 'Please enter a valid 6-digit PIN code' };
  }
  
  return null;
};

// Login form validation
export const validateLoginForm = (email: string, password: string): ValidationResult => {
  const errors: ValidationError[] = [];
  
  const emailError = validateEmail(email);
  if (emailError) errors.push(emailError);
  
  if (!password) {
    errors.push({ field: 'password', message: 'Password is required' });
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Registration form validation
export const validateRegistrationForm = (
  name: string,
  email: string,
  password: string,
  confirmPassword: string,
  phone?: string
): ValidationResult => {
  const errors: ValidationError[] = [];
  
  const nameError = validateName(name);
  if (nameError) errors.push(nameError);
  
  const emailError = validateEmail(email);
  if (emailError) errors.push(emailError);
  
  const passwordError = validatePassword(password);
  if (passwordError) errors.push(passwordError);
  
  if (password !== confirmPassword) {
    errors.push({ field: 'confirmPassword', message: 'Passwords do not match' });
  }
  
  if (phone) {
    const phoneError = validatePhone(phone);
    if (phoneError) errors.push(phoneError);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Shipping address validation
export const validateShippingAddress = (address: {
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}): ValidationResult => {
  const errors: ValidationError[] = [];
  
  const nameError = validateName(address.name);
  if (nameError) errors.push(nameError);
  
  const phoneError = validatePhone(address.phone);
  if (phoneError) errors.push(phoneError);
  
  const addressError = validateAddress(address.address);
  if (addressError) errors.push(addressError);
  
  const cityError = validateCity(address.city);
  if (cityError) errors.push(cityError);
  
  const stateError = validateState(address.state);
  if (stateError) errors.push(stateError);
  
  const pincodeError = validatePincode(address.pincode);
  if (pincodeError) errors.push(pincodeError);
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Product review validation
export const validateProductReview = (rating: number, comment: string): ValidationResult => {
  const errors: ValidationError[] = [];
  
  if (!rating || rating < 1 || rating > 5) {
    errors.push({ field: 'rating', message: 'Please select a rating between 1 and 5 stars' });
  }
  
  if (!comment) {
    errors.push({ field: 'comment', message: 'Review comment is required' });
  } else if (comment.trim().length < 10) {
    errors.push({ field: 'comment', message: 'Review comment must be at least 10 characters long' });
  } else if (comment.trim().length > 500) {
    errors.push({ field: 'comment', message: 'Review comment cannot exceed 500 characters' });
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Utility function to get error message for a specific field
export const getFieldError = (errors: ValidationError[], field: string): string | null => {
  const error = errors.find(err => err.field === field);
  return error ? error.message : null;
};

// Utility function to check if a field has an error
export const hasFieldError = (errors: ValidationError[], field: string): boolean => {
  return errors.some(err => err.field === field);
};