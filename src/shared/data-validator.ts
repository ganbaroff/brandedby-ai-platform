/**
 * Data Validation and Sanitization System
 * Comprehensive validation for user inputs and data integrity
 */

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  sanitizedValue?: unknown;
  warnings?: string[];
}

interface ValidationRule {
  required?: boolean;
  type?: 'string' | 'number' | 'email' | 'url' | 'date' | 'array' | 'object';
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  customValidator?: (value: unknown) => string | null;
  sanitizer?: (value: unknown) => unknown;
}

interface ValidationSchema {
  [key: string]: ValidationRule;
}

class DataValidator {
  /**
   * Validate a single value against a rule
   */
  static validateValue(value: unknown, rule: ValidationRule): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    let sanitizedValue = value;

    // Apply sanitization first if provided
    if (rule.sanitizer && value !== null && value !== undefined) {
      try {
        sanitizedValue = rule.sanitizer(value);
      } catch (error) {
        errors.push(`Sanitization failed: ${error}`);
        return { isValid: false, errors, sanitizedValue: value };
      }
    }

    // Check if required
    if (rule.required && (sanitizedValue === null || sanitizedValue === undefined || sanitizedValue === '')) {
      errors.push('This field is required');
      return { isValid: false, errors, sanitizedValue };
    }

    // If value is empty and not required, it's valid
    if (!rule.required && (sanitizedValue === null || sanitizedValue === undefined || sanitizedValue === '')) {
      return { isValid: true, errors: [], sanitizedValue };
    }

    // Type validation
    if (rule.type) {
      const typeError = this.validateType(sanitizedValue, rule.type);
      if (typeError) {
        errors.push(typeError);
      }
    }

    // String-specific validations
    if (typeof sanitizedValue === 'string') {
      if (rule.minLength && sanitizedValue.length < rule.minLength) {
        errors.push(`Must be at least ${rule.minLength} characters long`);
      }
      if (rule.maxLength && sanitizedValue.length > rule.maxLength) {
        errors.push(`Must be no more than ${rule.maxLength} characters long`);
      }
      if (rule.pattern && !rule.pattern.test(sanitizedValue)) {
        errors.push('Invalid format');
      }
    }

    // Number-specific validations
    if (typeof sanitizedValue === 'number') {
      if (rule.min !== undefined && sanitizedValue < rule.min) {
        errors.push(`Must be at least ${rule.min}`);
      }
      if (rule.max !== undefined && sanitizedValue > rule.max) {
        errors.push(`Must be no more than ${rule.max}`);
      }
    }

    // Custom validation
    if (rule.customValidator) {
      const customError = rule.customValidator(sanitizedValue);
      if (customError) {
        errors.push(customError);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedValue,
      warnings: warnings.length > 0 ? warnings : undefined
    };
  }

  /**
   * Validate an object against a schema
   */
  static validateObject(obj: Record<string, unknown>, schema: ValidationSchema): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const sanitizedObject: Record<string, unknown> = { ...obj };

    for (const [field, rule] of Object.entries(schema)) {
      const result = this.validateValue(obj[field], rule);
      
      if (!result.isValid) {
        errors.push(...result.errors.map(error => `${field}: ${error}`));
      }
      
      if (result.warnings) {
        warnings.push(...result.warnings.map(warning => `${field}: ${warning}`));
      }
      
      if (result.sanitizedValue !== undefined) {
        sanitizedObject[field] = result.sanitizedValue;
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedValue: sanitizedObject,
      warnings: warnings.length > 0 ? warnings : undefined
    };
  }

  /**
   * Validate celebrity data
   */
  static validateCelebrity(celebrity: Record<string, unknown>): ValidationResult {
    const schema: ValidationSchema = {
      name: {
        required: true,
        type: 'string',
        minLength: 2,
        maxLength: 100,
        sanitizer: (value: unknown) => typeof value === 'string' ? value.trim() : value,
        customValidator: (value: unknown) => {
          if (typeof value === 'string' && !/^[a-zA-Z\s\-'.]+$/.test(value)) {
            return 'Name can only contain letters, spaces, hyphens, apostrophes, and periods';
          }
          return null;
        }
      },
      role: {
        required: true,
        type: 'string',
        minLength: 2,
        maxLength: 200,
        sanitizer: (value: unknown) => typeof value === 'string' ? value.trim() : value
      },
      description: {
        required: true,
        type: 'string',
        minLength: 10,
        maxLength: 1000,
        sanitizer: (value: unknown) => typeof value === 'string' ? this.sanitizeHTML(value.trim()) : value
      },
      image_url: {
        required: true,
        type: 'url',
        sanitizer: (value: unknown) => typeof value === 'string' ? value.trim() : value
      },
      rating: {
        required: true,
        type: 'number',
        min: 0,
        max: 10
      },
      popularity: {
        required: true,
        type: 'number',
        min: 0,
        max: 100
      },
      niches: {
        required: true,
        type: 'string',
        customValidator: (value: unknown) => {
          try {
            if (typeof value !== 'string') return 'Niches must be a string';
            const parsed = JSON.parse(value);
            if (!Array.isArray(parsed)) {
              return 'Niches must be a JSON array';
            }
            if (parsed.length === 0) {
              return 'At least one niche is required';
            }
            if (parsed.some(niche => typeof niche !== 'string')) {
              return 'All niches must be strings';
            }
            return null;
          } catch {
            return 'Invalid JSON format for niches';
          }
        }
      }
    };

    return this.validateObject(celebrity, schema);
  }

  /**
   * Validate blog post data
   */
  static validateBlogPost(post: Record<string, unknown>): ValidationResult {
    const schema: ValidationSchema = {
      title: {
        required: true,
        type: 'string',
        minLength: 5,
        maxLength: 200,
        sanitizer: (value: unknown) => typeof value === 'string' ? value.trim() : value
      },
      content: {
        required: true,
        type: 'string',
        minLength: 50,
        maxLength: 50000,
        sanitizer: (value: unknown) => typeof value === 'string' ? this.sanitizeHTML(value) : value
      },
      excerpt: {
        required: true,
        type: 'string',
        minLength: 20,
        maxLength: 500,
        sanitizer: (value: unknown) => typeof value === 'string' ? this.sanitizeHTML(value.trim()) : value
      },
      author: {
        required: true,
        type: 'string',
        minLength: 2,
        maxLength: 100,
        sanitizer: (value: unknown) => typeof value === 'string' ? value.trim() : value
      },
      category: {
        required: true,
        type: 'string',
        customValidator: (value: unknown) => {
          if (typeof value !== 'string') return 'Category must be a string';
          const validCategories = ['News', 'Technology', 'Entertainment', 'Business', 'Health', 'Sports'];
          if (!validCategories.includes(value)) {
            return `Category must be one of: ${validCategories.join(', ')}`;
          }
          return null;
        }
      },
      image_url: {
        type: 'url',
        sanitizer: (value: unknown) => typeof value === 'string' ? (value ? value.trim() : '') : value
      },
      publishedAt: {
        required: true,
        type: 'date'
      }
    };

    return this.validateObject(post, schema);
  }

  /**
   * Sanitize HTML content to prevent XSS
   */
  static sanitizeHTML(html: string): string {
    // Create a temporary div to parse HTML
    const temp = document.createElement('div');
    temp.innerHTML = html;

    // Remove dangerous elements
    const dangerousElements = temp.querySelectorAll('script, object, embed, iframe, form, input, button');
    dangerousElements.forEach(el => el.remove());

    // Remove dangerous attributes
    const allElements = temp.querySelectorAll('*');
    allElements.forEach(el => {
      Array.from(el.attributes).forEach(attr => {
        if (attr.name.startsWith('on') || 
            attr.name === 'javascript:' || 
            attr.value.includes('javascript:') ||
            attr.value.includes('data:')) {
          el.removeAttribute(attr.name);
        }
      });
    });

    return temp.innerHTML;
  }

  /**
   * Validate URL format
   */
  static validateURL(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return ['http:', 'https:'].includes(urlObj.protocol);
    } catch {
      return false;
    }
  }

  /**
   * Validate email format
   */
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate date format
   */
  static validateDate(date: unknown): boolean {
    try {
      const parsedDate = new Date(date as string | number | Date);
      return !isNaN(parsedDate.getTime());
    } catch {
      return false;
    }
  }

  /**
   * Type validation helper
   */
  private static validateType(value: unknown, expectedType: string): string | null {
    switch (expectedType) {
      case 'string':
        if (typeof value !== 'string') {
          return 'Must be a string';
        }
        break;
      case 'number':
        if (typeof value !== 'number' || isNaN(value)) {
          return 'Must be a valid number';
        }
        break;
      case 'email':
        if (typeof value !== 'string' || !this.validateEmail(value)) {
          return 'Must be a valid email address';
        }
        break;
      case 'url':
        if (typeof value !== 'string' || !this.validateURL(value)) {
          return 'Must be a valid URL';
        }
        break;
      case 'date':
        if (!this.validateDate(value)) {
          return 'Must be a valid date';
        }
        break;
      case 'array':
        if (!Array.isArray(value)) {
          return 'Must be an array';
        }
        break;
      case 'object':
        if (typeof value !== 'object' || value === null || Array.isArray(value)) {
          return 'Must be an object';
        }
        break;
    }
    return null;
  }

  /**
   * Validate file upload
   */
  static validateFile(file: File, options: {
    maxSize?: number; // in bytes
    allowedTypes?: string[];
    allowedExtensions?: string[];
  } = {}): ValidationResult {
    const errors: string[] = [];
    const { maxSize = 5 * 1024 * 1024, allowedTypes = [], allowedExtensions = [] } = options;

    // Check file size
    if (file.size > maxSize) {
      errors.push(`File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`);
    }

    // Check file type
    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      errors.push(`File type must be one of: ${allowedTypes.join(', ')}`);
    }

    // Check file extension
    if (allowedExtensions.length > 0) {
      const extension = file.name.split('.').pop()?.toLowerCase();
      if (!extension || !allowedExtensions.includes(extension)) {
        errors.push(`File extension must be one of: ${allowedExtensions.join(', ')}`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedValue: file
    };
  }

  /**
   * Validate bulk import data
   */
  static validateBulkImport(data: unknown[], type: 'celebrities' | 'blogPosts'): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const sanitizedData: unknown[] = [];

    if (!Array.isArray(data)) {
      return {
        isValid: false,
        errors: ['Data must be an array']
      };
    }

    if (data.length === 0) {
      return {
        isValid: false,
        errors: ['No data provided']
      };
    }

    if (data.length > 1000) {
      warnings.push('Large dataset detected. Consider importing in smaller batches for better performance.');
    }

    data.forEach((item, index) => {
      let result: ValidationResult;
      
      if (type === 'celebrities') {
        result = this.validateCelebrity(item as Record<string, unknown>);
      } else {
        result = this.validateBlogPost(item as Record<string, unknown>);
      }

      if (!result.isValid) {
        errors.push(`Item ${index + 1}: ${result.errors.join(', ')}`);
      } else {
        sanitizedData.push(result.sanitizedValue);
      }

      if (result.warnings) {
        warnings.push(`Item ${index + 1}: ${result.warnings.join(', ')}`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedValue: sanitizedData,
      warnings: warnings.length > 0 ? warnings : undefined
    };
  }
}

export { DataValidator, type ValidationResult, type ValidationRule, type ValidationSchema };
