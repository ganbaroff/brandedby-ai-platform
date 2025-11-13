/**
 * Validation utilities and sanitization helpers
 */

import { z } from 'zod';
import { ValidationError } from './errors';

/**
 * Validates data against a Zod schema and throws ValidationError on failure
 */
export function validate<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  errorMessage?: string
): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const details = error.errors.map((err) => ({
        path: err.path.join('.'),
        message: err.message,
      }));
      
      throw new ValidationError(
        errorMessage || 'Validation failed',
        details
      );
    }
    throw error;
  }
}

/**
 * Safely parses data, returning null on validation failure
 */
export function safeParse<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: z.ZodError } {
  const result = schema.safeParse(data);
  return result;
}

/**
 * Sanitizes string input to prevent XSS and injection attacks
 */
export function sanitizeString(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, ''); // Remove event handlers
}

/**
 * Validates and sanitizes email address
 */
export function sanitizeEmail(email: string): string {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const sanitized = sanitizeString(email).toLowerCase();
  
  if (!emailRegex.test(sanitized)) {
    throw new ValidationError('Invalid email format');
  }
  
  return sanitized;
}

/**
 * Validates URL and ensures it's safe
 */
export function sanitizeUrl(url: string): string {
  const sanitized = sanitizeString(url);
  
  try {
    const urlObj = new URL(sanitized);
    
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      throw new ValidationError('URL must use http or https protocol');
    }
    
    return sanitized;
  } catch {
    throw new ValidationError('Invalid URL format');
  }
}

/**
 * Validates file size (in bytes)
 */
export function validateFileSize(
  size: number,
  maxSizeMB: number = 10
): void {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  
  if (size > maxSizeBytes) {
    throw new ValidationError(
      `File size exceeds maximum allowed size of ${maxSizeMB}MB`
    );
  }
}

/**
 * Validates file type against allowed MIME types
 */
export function validateFileType(
  mimeType: string,
  allowedTypes: string[]
): void {
  if (!allowedTypes.includes(mimeType)) {
    throw new ValidationError(
      `File type ${mimeType} is not allowed. Allowed types: ${allowedTypes.join(', ')}`
    );
  }
}

/**
 * Common file type constants
 */
export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
];

export const ALLOWED_VIDEO_TYPES = [
  'video/mp4',
  'video/webm',
  'video/quicktime',
];

export const MAX_FILE_SIZE_MB = 10;
export const MAX_IMAGE_SIZE_MB = 5;
