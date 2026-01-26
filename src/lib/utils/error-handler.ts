/**
 * Centralized Error Handling Utility
 *
 * Provides unified error handling across the application with:
 * - Consistent error message extraction
 * - Integration with toast notifications
 * - Proper logging via logger utility
 * - API error handling with proper types
 * - Supabase error handling
 *
 * @remarks
 * **Usage Pattern:**
 * ```ts
 * try {
 *   await someOperation();
 * } catch (error) {
 *   handleError(error, 'Operation failed', { context: 'ComponentName' });
 * }
 * ```
 *
 * **Benefits:**
 * - Consistent UX: All errors show toast notifications
 * - Better debugging: All errors logged with context in development
 * - Production ready: Errors sent to monitoring service via logger
 * - Type safe: Handles Error, string, objects, and unknown types
 */

import { toast } from 'sonner';
import { logger } from './logger';

/**
 * Supabase-specific error codes
 * @see {@link https://supabase.com/docs/guides/database/postgres/errors}
 */
export const SUPABASE_ERROR_CODES = {
  /** Record not found (404) */
  PGRST116: 'Record not found',
  /** Unique constraint violation (409) */
  PGRST23505: 'A record with this value already exists',
  /** Foreign key violation (409) */
  PGRST23503: 'Cannot delete - record is referenced elsewhere',
  /** Permission denied (403) */
  PGRST42501: 'Permission denied',
} as const;

/**
 * Extract user-friendly error message from various error types
 *
 * @param error - Error of any type (Error, string, object, unknown)
 * @param fallback - Default message if extraction fails
 * @returns User-friendly error message
 *
 * @example
 * ```ts
 * const message = getErrorMessage(error, 'Failed to load data');
 * toast.error(message);
 * ```
 */
export function getErrorMessage(error: unknown, fallback = 'An unexpected error occurred'): string {
  // Handle Error instances
  if (error instanceof Error) {
    return error.message;
  }

  // Handle string errors
  if (typeof error === 'string') {
    return error;
  }

  // Handle Supabase errors with error codes
  if (error && typeof error === 'object' && 'code' in error) {
    const errorCode = String(error.code);
    if (errorCode in SUPABASE_ERROR_CODES) {
      return SUPABASE_ERROR_CODES[errorCode as keyof typeof SUPABASE_ERROR_CODES];
    }
  }

  // Handle objects with message property
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message);
  }

  // Fallback
  return fallback;
}

/**
 * Handle API response errors with proper error extraction
 *
 * @param response - Fetch API response object
 * @param fallback - Fallback error message
 * @throws Error with extracted message from response
 *
 * @example
 * ```ts
 * const response = await fetch('/api/users');
 * if (!response.ok) {
 *   await handleApiError(response, 'Failed to fetch users');
 * }
 * ```
 */
export async function handleApiError(response: Response, fallback = 'Request failed'): Promise<never> {
  let errorMessage = fallback;

  try {
    const result = await response.json();
    errorMessage = result.error || result.message || fallback;
  } catch {
    errorMessage = `${fallback} (${response.status} ${response.statusText})`;
  }

  throw new Error(errorMessage);
}

/**
 * Handle errors with toast notification and logging
 *
 * This is the main error handling function - use it for all error scenarios.
 * It will:
 * 1. Extract user-friendly message
 * 2. Show toast notification to user
 * 3. Log to console in development
 * 4. Send to monitoring service in production (via logger)
 *
 * @param error - Error of any type
 * @param fallback - Fallback error message
 * @param options - Additional options (context for logging, silent mode)
 *
 * @example
 * ```ts
 * try {
 *   await updateProfile(data);
 *   showSuccess('Profile updated');
 * } catch (error) {
 *   handleError(error, 'Failed to update profile', {
 *     context: 'ProfileSettings',
 *     silent: false,
 *   });
 * }
 * ```
 */
export function handleError(
  error: unknown,
  fallback = 'An error occurred',
  options?: {
    /** Context for logging (e.g., component name, operation) */
    context?: string;
    /** If true, don't show toast (log only) */
    silent?: boolean;
    /** Additional data to log */
    data?: Record<string, unknown>;
  }
): void {
  const message = getErrorMessage(error, fallback);

  // Log error with context
  logger.error(
    options?.context ? `[${options.context}] ${message}` : message,
    error,
    { data: options?.data }
  );

  // Show toast notification unless silent
  if (!options?.silent) {
    toast.error(message);
  }
}

/**
 * Legacy function for backward compatibility
 * @deprecated Use handleError() instead
 */
export function showError(error: unknown, fallback = 'An error occurred', log = true): void {
  const message = getErrorMessage(error, fallback);

  if (log) {
    logger.error(message, error);
  }

  toast.error(message);
}

/**
 * Show success toast notification
 *
 * @param message - Success message to display
 *
 * @example
 * ```ts
 * await saveData();
 * showSuccess('Data saved successfully');
 * ```
 */
export function showSuccess(message: string): void {
  toast.success(message);
}

/**
 * Show info toast notification
 *
 * @param message - Info message to display
 */
export function showInfo(message: string): void {
  toast.info(message);
}

/**
 * Show warning toast notification
 *
 * @param message - Warning message to display
 */
export function showWarning(message: string): void {
  toast.warning(message);
}
