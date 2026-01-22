/**
 * Centralized error handling utility
 * Handles error extraction, logging, and user notifications
 */

import { toast } from 'sonner';

/**
 * Extract error message from various error types
 */
export function getErrorMessage(error: unknown, fallback = 'An unexpected error occurred'): string {
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message);
  }
  
  return fallback;
}

/**
 * Handle API response errors
 */
export async function handleApiError(response: Response, fallback = 'Request failed'): Promise<never> {
  let errorMessage = fallback;
  
  try {
    const result = await response.json();
    errorMessage = result.error || result.message || fallback;
  } catch {
    errorMessage = `${fallback} (${response.status})`;
  }
  
  throw new Error(errorMessage);
}

/**
 * Show error toast and optionally log to console
 */
export function showError(error: unknown, fallback = 'An error occurred', log = true): void {
  const message = getErrorMessage(error, fallback);
  
  if (log && process.env.NODE_ENV === 'development') {
    console.error('[Error]', error);
  }
  
  toast.error(message);
}

/**
 * Show success toast
 */
export function showSuccess(message: string): void {
  toast.success(message);
}
