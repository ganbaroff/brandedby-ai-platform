/**
 * API helper utilities for consistent responses and error handling
 */

import { formatErrorResponse } from './errors';
import type { ApiResponse } from './types';

/**
 * Creates a successful API response
 */
export function successResponse<T>(data: T): ApiResponse<T> {
  return {
    success: true,
    data,
  };
}

/**
 * Creates an error API response
 */
export function errorResponse(error: unknown): ApiResponse {
  return formatErrorResponse(error);
}

/**
 * Wraps an async handler with error handling
 */
export function asyncHandler<T>(
  handler: (c: T) => Promise<Response> | Response
) {
  return async (c: T): Promise<Response> => {
    try {
      return await handler(c);
    } catch (error) {
      const errorResponse = formatErrorResponse(error);
      const statusCode = error instanceof Error && 'statusCode' in error 
        ? (error as { statusCode: number }).statusCode 
        : 500;
      
      return new Response(JSON.stringify(errorResponse), {
        status: statusCode,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  };
}

/**
 * Validates environment variables
 */
export function validateEnvVar(
  name: string,
  value: string | undefined
): string {
  if (!value) {
    throw new Error(`Environment variable ${name} is not set`);
  }
  return value;
}
