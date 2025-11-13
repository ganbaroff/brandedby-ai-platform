/**
 * Standardized error types and utilities for consistent error handling
 */

export enum ErrorCode {
  // Authentication errors
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  
  // Validation errors
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',
  
  // Resource errors
  NOT_FOUND = 'NOT_FOUND',
  ALREADY_EXISTS = 'ALREADY_EXISTS',
  
  // Server errors
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
  
  // Payment errors
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  PAYMENT_PROCESSING_ERROR = 'PAYMENT_PROCESSING_ERROR',
  
  // File errors
  FILE_UPLOAD_ERROR = 'FILE_UPLOAD_ERROR',
  FILE_NOT_FOUND = 'FILE_NOT_FOUND',
  FILE_TOO_LARGE = 'FILE_TOO_LARGE',
}

export interface AppError extends Error {
  code: ErrorCode;
  statusCode: number;
  details?: unknown;
  timestamp: string;
}

export class BaseAppError extends Error implements AppError {
  code: ErrorCode;
  statusCode: number;
  details?: unknown;
  timestamp: string;

  constructor(
    message: string,
    code: ErrorCode,
    statusCode: number = 500,
    details?: unknown
  ) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    this.timestamp = new Date().toISOString();
    
    // Maintains proper stack trace for where error was thrown (V8/Node.js feature)
    const ErrorConstructor = Error as typeof Error & {
      captureStackTrace?: (error: Error, constructorOpt?: Function) => void;
    };
    if (typeof ErrorConstructor.captureStackTrace === 'function') {
      ErrorConstructor.captureStackTrace(this, this.constructor);
    }
  }
}

export class ValidationError extends BaseAppError {
  constructor(message: string, details?: unknown) {
    super(message, ErrorCode.VALIDATION_ERROR, 400, details);
  }
}

export class NotFoundError extends BaseAppError {
  constructor(resource: string, identifier?: string) {
    const message = identifier 
      ? `${resource} with identifier '${identifier}' not found`
      : `${resource} not found`;
    super(message, ErrorCode.NOT_FOUND, 404, { resource, identifier });
  }
}

export class UnauthorizedError extends BaseAppError {
  constructor(message: string = 'Authentication required') {
    super(message, ErrorCode.UNAUTHORIZED, 401);
  }
}

export class ForbiddenError extends BaseAppError {
  constructor(message: string = 'Access denied') {
    super(message, ErrorCode.FORBIDDEN, 403);
  }
}

export class DatabaseError extends BaseAppError {
  constructor(message: string, details?: unknown) {
    super(message, ErrorCode.DATABASE_ERROR, 500, details);
  }
}

export class PaymentError extends BaseAppError {
  constructor(message: string, details?: unknown) {
    super(message, ErrorCode.PAYMENT_FAILED, 402, details);
  }
}

export class FileUploadError extends BaseAppError {
  constructor(message: string, details?: unknown) {
    super(message, ErrorCode.FILE_UPLOAD_ERROR, 400, details);
  }
}

/**
 * Error response formatter for API responses
 */
export interface ErrorResponse {
  success: false;
  error: {
    code: ErrorCode;
    message: string;
    details?: unknown;
    timestamp: string;
  };
}

export function formatErrorResponse(error: unknown): ErrorResponse {
  if (error instanceof BaseAppError) {
    return {
      success: false,
      error: {
        code: error.code,
        message: error.message,
        details: error.details,
        timestamp: error.timestamp,
      },
    };
  }

  if (error instanceof Error) {
    return {
      success: false,
      error: {
        code: ErrorCode.INTERNAL_ERROR,
        message: error.message || 'An unexpected error occurred',
        timestamp: new Date().toISOString(),
      },
    };
  }

  return {
    success: false,
    error: {
      code: ErrorCode.INTERNAL_ERROR,
      message: 'An unexpected error occurred',
      timestamp: new Date().toISOString(),
    },
  };
}

/**
 * Type guard to check if error is an AppError
 */
export function isAppError(error: unknown): error is AppError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'statusCode' in error &&
    'timestamp' in error
  );
}
