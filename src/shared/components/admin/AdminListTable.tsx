/**
 * AdminListTable - Simple table component for admin list pages
 *
 * Works with server-side pagination from useAdminTable hook.
 * Renders table HTML without client-side filtering/sorting/pagination.
 *
 * @remarks
 * This component is designed to work with the useAdminTable hook pattern:
 * - Server-side pagination, filtering, and sorting
 * - Simple table rendering without heavy dependencies
 * - Consistent UI across all admin CRUD pages
 *
 * @example
 * ```tsx
 * const { items, loading, currentPage, setCurrentPage, totalPages } = useAdminTable(...);
 *
 * <AdminListTable
 *   columns={[
 *     { key: 'title', header: 'Title', render: (item) => <strong>{item.title}</strong> },
 *     { key: 'status', header: 'Status', render: (item) => <StatusBadge status={item.status} /> },
 *     { key: 'actions', header: 'Actions', render: (item) => <ActionButtons item={item} /> },
 *   ]}
 *   data={items}
 *   loading={loading}
 *   pagination={{
 *     currentPage,
 *     totalPages,
 *     onPageChange: setCurrentPage,
 *   }}
 * />
 * ```
 */

import React from 'react';

/**
 * Column configuration for the table
 * @template T - Data item type
 */
export interface AdminListTableColumn<T> {
  /** Unique key for the column */
  key: string;
  /** Header label */
  header: string;
  /**
   * Custom render function for the cell
   * @param item - The row data
   * @returns React node to render in the cell
   */
  render: (item: T) => React.ReactNode;
  /** Optional CSS class for the column */
  className?: string;
}

/**
 * Pagination configuration
 */
export interface AdminListTablePagination {
  /** Current page number (1-indexed) */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Total number of items */
  totalCount?: number;
  /** Items per page */
  itemsPerPage?: number;
  /** Callback when page changes */
  onPageChange: (page: number) => void;
}

/**
 * Props for AdminListTable component
 * @template T - Data item type (must have an 'id' field)
 */
export interface AdminListTableProps<T extends { id: string }> {
  /** Column definitions */
  columns: AdminListTableColumn<T>[];
  /** Data array to display */
  data: T[];
  /** Loading state */
  loading?: boolean;
  /** Pagination configuration (optional) */
  pagination?: AdminListTablePagination;
  /** Empty state message */
  emptyMessage?: string;
}

/**
 * AdminListTable Component
 *
 * Simple table component that renders data with server-side pagination.
 * Designed to work seamlessly with useAdminTable hook.
 */
export function AdminListTable<T extends { id: string }>({
  columns,
  data,
  loading = false,
  pagination,
  emptyMessage = 'No data found',
}: AdminListTableProps<T>): JSX.Element {
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  const showPagination = pagination && pagination.totalPages > 1;

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`text-left py-3 px-4 font-semibold text-gray-700 ${column.className ?? ''}`}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-12 text-gray-500">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                  {columns.map((column) => (
                    <td key={column.key} className={`py-3 px-4 ${column.className ?? ''}`}>
                      {column.render(item)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {showPagination && (
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
          {pagination.totalCount && pagination.itemsPerPage && (
            <div className="text-sm text-gray-600">
              Showing {(pagination.currentPage - 1) * pagination.itemsPerPage + 1} to{' '}
              {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalCount)} of{' '}
              {pagination.totalCount} items
            </div>
          )}
          <div className="flex gap-2">
            <button
              onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-sm text-gray-600">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <button
              onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage >= pagination.totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </>
  );
}
