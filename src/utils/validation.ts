export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
}

export interface ValidationRule<T> {
  name: string;
  test: (value: T) => boolean;
  message: string;
  severity?: 'error' | 'warning';
}

// Email validation
export function validateEmail(email: string): ValidationResult {
  const errors: string[] = [];
  
  if (!email) {
    errors.push('Email is required');
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push('Please enter a valid email address');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Password validation
export function validatePassword(password: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  if (!password) {
    errors.push('Password is required');
  } else {
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      warnings.push('Password should contain at least one special character for better security');
    }
    
    if (password.length < 12) {
      warnings.push('Consider using a password with 12+ characters for better security');
    }
    
    // Check for common patterns
    const commonPatterns = [
      /123456/,
      /password/i,
      /qwerty/i,
      /abc123/i,
      /admin/i,
    ];
    
    if (commonPatterns.some(pattern => pattern.test(password))) {
      errors.push('Password contains common patterns and is not secure');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

// URL validation
export function validateUrl(url: string): ValidationResult {
  const errors: string[] = [];
  
  if (!url) {
    errors.push('URL is required');
  } else {
    try {
      new URL(url.startsWith('http') ? url : `https://${url}`);
    } catch {
      errors.push('Please enter a valid URL');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Phone number validation
export function validatePhoneNumber(phone: string): ValidationResult {
  const errors: string[] = [];
  
  if (!phone) {
    errors.push('Phone number is required');
  } else {
    const cleaned = phone.replace(/\D/g, '');
    
    if (cleaned.length < 10) {
      errors.push('Phone number must be at least 10 digits');
    } else if (cleaned.length > 15) {
      errors.push('Phone number cannot exceed 15 digits');
    }
    
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(cleaned)) {
      errors.push('Please enter a valid phone number');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Required field validation
export function validateRequired(value: any, fieldName: string = 'Field'): ValidationResult {
  const errors: string[] = [];
  
  if (value === null || value === undefined || value === '') {
    errors.push(`${fieldName} is required`);
  } else if (typeof value === 'string' && value.trim() === '') {
    errors.push(`${fieldName} cannot be empty`);
  } else if (Array.isArray(value) && value.length === 0) {
    errors.push(`${fieldName} must have at least one item`);
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

// String length validation
export function validateStringLength(
  value: string,
  min: number = 0,
  max: number = Infinity,
  fieldName: string = 'Field'
): ValidationResult {
  const errors: string[] = [];
  
  if (typeof value !== 'string') {
    errors.push(`${fieldName} must be a string`);
  } else {
    const length = value.length;
    
    if (length < min) {
      errors.push(`${fieldName} must be at least ${min} characters long`);
    }
    
    if (length > max) {
      errors.push(`${fieldName} cannot exceed ${max} characters`);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Number validation
export function validateNumber(
  value: any,
  min: number = -Infinity,
  max: number = Infinity,
  fieldName: string = 'Field'
): ValidationResult {
  const errors: string[] = [];
  
  const num = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(num) || typeof num !== 'number') {
    errors.push(`${fieldName} must be a valid number`);
  } else {
    if (num < min) {
      errors.push(`${fieldName} must be at least ${min}`);
    }
    
    if (num > max) {
      errors.push(`${fieldName} cannot exceed ${max}`);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Date validation
export function validateDate(
  value: any,
  minDate?: Date,
  maxDate?: Date,
  fieldName: string = 'Date'
): ValidationResult {
  const errors: string[] = [];
  
  let date: Date;
  
  if (value instanceof Date) {
    date = value;
  } else if (typeof value === 'string') {
    date = new Date(value);
  } else {
    errors.push(`${fieldName} must be a valid date`);
    return { isValid: false, errors };
  }
  
  if (isNaN(date.getTime())) {
    errors.push(`${fieldName} must be a valid date`);
  } else {
    if (minDate && date < minDate) {
      errors.push(`${fieldName} cannot be before ${minDate.toDateString()}`);
    }
    
    if (maxDate && date > maxDate) {
      errors.push(`${fieldName} cannot be after ${maxDate.toDateString()}`);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Array validation
export function validateArray<T>(
  value: any,
  minLength: number = 0,
  maxLength: number = Infinity,
  itemValidator?: (item: T) => ValidationResult,
  fieldName: string = 'Field'
): ValidationResult {
  const errors: string[] = [];
  
  if (!Array.isArray(value)) {
    errors.push(`${fieldName} must be an array`);
  } else {
    if (value.length < minLength) {
      errors.push(`${fieldName} must have at least ${minLength} items`);
    }
    
    if (value.length > maxLength) {
      errors.push(`${fieldName} cannot have more than ${maxLength} items`);
    }
    
    if (itemValidator) {
      value.forEach((item, index) => {
        const result = itemValidator(item);
        if (!result.isValid) {
          errors.push(`${fieldName}[${index}]: ${result.errors.join(', ')}`);
        }
      });
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Custom validation with rules
export function validateWithRules<T>(
  value: T,
  rules: ValidationRule<T>[],
  fieldName: string = 'Field'
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  for (const rule of rules) {
    if (!rule.test(value)) {
      const message = rule.message.replace('{field}', fieldName);
      
      if (rule.severity === 'warning') {
        warnings.push(message);
      } else {
        errors.push(message);
      }
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

// Opportunity validation
export function validateOpportunity(opportunity: any): ValidationResult {
  const errors: string[] = [];
  
  // Required fields
  const requiredFields = [
    { field: 'title', value: opportunity.title },
    { field: 'description', value: opportunity.description },
    { field: 'source', value: opportunity.source },
    { field: 'url', value: opportunity.url },
    { field: 'category', value: opportunity.category },
  ];
  
  requiredFields.forEach(({ field, value }) => {
    const result = validateRequired(value, field);
    if (!result.isValid) {
      errors.push(...result.errors);
    }
  });
  
  // Title length
  if (opportunity.title) {
    const titleResult = validateStringLength(opportunity.title, 1, 200, 'Title');
    if (!titleResult.isValid) {
      errors.push(...titleResult.errors);
    }
  }
  
  // Description length
  if (opportunity.description) {
    const descResult = validateStringLength(opportunity.description, 10, 5000, 'Description');
    if (!descResult.isValid) {
      errors.push(...descResult.errors);
    }
  }
  
  // URL validation
  if (opportunity.url) {
    const urlResult = validateUrl(opportunity.url);
    if (!urlResult.isValid) {
      errors.push(...urlResult.errors);
    }
  }
  
  // Value validation
  if (opportunity.value !== undefined && opportunity.value !== null) {
    const valueResult = validateNumber(opportunity.value, 0, Infinity, 'Value');
    if (!valueResult.isValid) {
      errors.push(...valueResult.errors);
    }
  }
  
  // Deadline validation
  if (opportunity.deadline) {
    const deadlineResult = validateDate(opportunity.deadline, new Date(), undefined, 'Deadline');
    if (!deadlineResult.isValid) {
      errors.push(...deadlineResult.errors);
    }
  }
  
  // Match score validation
  if (opportunity.matchScore !== undefined) {
    const scoreResult = validateNumber(opportunity.matchScore, 0, 100, 'Match Score');
    if (!scoreResult.isValid) {
      errors.push(...scoreResult.errors);
    }
  }
  
  // Tags validation
  if (opportunity.tags) {
    const tagsResult = validateArray(opportunity.tags, 0, 10, undefined, 'Tags');
    if (!tagsResult.isValid) {
      errors.push(...tagsResult.errors);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

// User validation
export function validateUser(user: any): ValidationResult {
  const errors: string[] = [];
  
  // Required fields
  const nameResult = validateRequired(user.name, 'Name');
  if (!nameResult.isValid) {
    errors.push(...nameResult.errors);
  }
  
  const emailResult = validateEmail(user.email);
  if (!emailResult.isValid) {
    errors.push(...emailResult.errors);
  }
  
  // Name length
  if (user.name) {
    const nameLength = validateStringLength(user.name, 1, 100, 'Name');
    if (!nameLength.isValid) {
      errors.push(...nameLength.errors);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Criteria validation
export function validateCriteria(criteria: any): ValidationResult {
  const errors: string[] = [];
  
  // Required fields
  const nameResult = validateRequired(criteria.name, 'Name');
  if (!nameResult.isValid) {
    errors.push(...nameResult.errors);
  }
  
  const keywordsResult = validateArray(criteria.keywords, 1, 50, undefined, 'Keywords');
  if (!keywordsResult.isValid) {
    errors.push(...keywordsResult.errors);
  }
  
  // Value range validation
  if (criteria.minValue !== undefined && criteria.maxValue !== undefined) {
    if (criteria.minValue > criteria.maxValue) {
      errors.push('Minimum value cannot be greater than maximum value');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Form validation helper
export function validateForm(formData: Record<string, any>, validators: Record<string, (value: any) => ValidationResult>): {
  isValid: boolean;
  errors: Record<string, string[]>;
  warnings: Record<string, string[]>;
} {
  const errors: Record<string, string[]> = {};
  const warnings: Record<string, string[]> = {};
  let isValid = true;
  
  Object.entries(validators).forEach(([field, validator]) => {
    const result = validator(formData[field]);
    
    if (!result.isValid) {
      isValid = false;
      errors[field] = result.errors;
    }
    
    if (result.warnings && result.warnings.length > 0) {
      warnings[field] = result.warnings;
    }
  });
  
  return {
    isValid,
    errors,
    warnings,
  };
}

// Export validation utilities
export const validationUtils = {
  validateEmail,
  validatePassword,
  validateUrl,
  validatePhoneNumber,
  validateRequired,
  validateStringLength,
  validateNumber,
  validateDate,
  validateArray,
  validateWithRules,
  validateOpportunity,
  validateUser,
  validateCriteria,
  validateForm,
}; 