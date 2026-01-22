/**
 * Common types
 * Used across admin panel and public pages
 */

// Pagination metadata
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// API Response wrapper
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// API Error
export interface ApiError {
  error: string;
  status?: number;
  details?: unknown;
}
