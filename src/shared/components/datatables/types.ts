import { ReactNode } from 'react';

/**
 * Column definition for AdminDataTable
 */
export interface AdminTableColumn {
  /** Column data key (for object data) or index (for array data) */
  data: string;

  /** Column title to display in header */
  title: string;

  /** Whether this column is searchable */
  searchable?: boolean;

  /** Whether this column is sortable */
  sortable?: boolean;

  /** Custom class name for the column */
  className?: string;

  /** Responsive priority (1 = highest, always visible) */
  responsivePriority?: number;

  /** Custom render function for cell content */
  render?: (data: unknown, type: string, row: Record<string, unknown>) => ReactNode;

  /** Width of the column */
  width?: string;
}

/**
 * Search configuration
 */
export interface SearchConfig {
  /** Fields to search in (for server-side) */
  fields?: string[];

  /** Debounce delay in ms */
  debounce?: number;

  /** Placeholder text */
  placeholder?: string;
}

/**
 * Main configuration for AdminDataTable
 */
export interface AdminDataTableConfig {
  /** Supabase table name (for server-side processing) */
  tableName: string;

  /** Column definitions */
  columns: AdminTableColumn[];

  /** Search configuration */
  search?: SearchConfig;

  /** Default ordering [[columnIndex, 'asc'|'desc']] */
  order?: [number, 'asc' | 'desc'][];

  /** Items per page */
  pageLength?: number;

  /** Enable responsive mode */
  responsive?: boolean | {
    details?: {
      type?: 'column' | 'inline';
      target?: number | string;
    };
  };

  /** Row click handler */
  onRowClick?: (row: Record<string, unknown>) => void;

  /** Custom actions column renderer */
  actionsRenderer?: (row: Record<string, unknown>) => ReactNode;
}

/**
 * Props for AdminDataTable component
 */
export interface AdminDataTableProps {
  /** Table configuration */
  config: AdminDataTableConfig;

  /** Optional: Pre-loaded data (for client-side mode) */
  data?: unknown[];

  /** Optional: Additional class name for wrapper */
  className?: string;

  /** Optional: Show create button */
  createButton?: {
    label: string;
    href: string;
  };

  /** Optional: Title and description */
  header?: {
    title: string;
    description: string;
  };

  /** Optional: Loading state */
  isLoading?: boolean;

  /** Optional: Manual pagination (for server-side) */
  manualPagination?: {
    pageCount: number;
    currentPage: number;
    totalRecords: number;
    onPageChange: (page: number) => void;
  };

  /** Optional: Controlled search state */
  searchQuery?: string;
  onSearchChange?: (query: string) => void;

  /** Optional: Filters to display alongside search */
  filters?: ReactNode;
}
