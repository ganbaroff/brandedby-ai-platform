// Tests for utility functions and data validation
// Path: src/react-app/__tests__/utils/validation.test.ts

import { describe, expect, it } from 'vitest';

// Email validation
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Phone validation
const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[\d\s\-()+]{10,}$/;
  return phoneRegex.test(phone);
};

// URL validation
const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

describe('Validation Utils', () => {
  describe('Email Validation', () => {
    it('should validate correct email', () => {
      expect(validateEmail('user@example.com')).toBe(true);
      expect(validateEmail('test.user@domain.co.uk')).toBe(true);
    });

    it('should reject invalid emails', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('user@')).toBe(false);
      expect(validateEmail('@domain.com')).toBe(false);
      expect(validateEmail('user @domain.com')).toBe(false);
    });
  });

  describe('Phone Validation', () => {
    it('should validate valid phone numbers', () => {
      expect(validatePhone('1234567890')).toBe(true);
      expect(validatePhone('+1-234-567-8900')).toBe(true);
      expect(validatePhone('(123) 456-7890')).toBe(true);
    });

    it('should reject invalid phone numbers', () => {
      expect(validatePhone('123')).toBe(false);
      expect(validatePhone('abc-def-ghij')).toBe(false);
    });
  });

  describe('URL Validation', () => {
    it('should validate correct URLs', () => {
      expect(validateUrl('https://example.com')).toBe(true);
      expect(validateUrl('http://localhost:3000')).toBe(true);
      expect(validateUrl('https://sub.domain.co.uk/path')).toBe(true);
    });

    it('should reject invalid URLs', () => {
      expect(validateUrl('not a url')).toBe(false);
      expect(validateUrl('://malformed')).toBe(false);
      expect(validateUrl('example.com')).toBe(false);
    });
  });
});
