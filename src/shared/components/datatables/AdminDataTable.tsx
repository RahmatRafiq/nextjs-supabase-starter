'use client';

import { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  SortingState,
  ColumnDef,
} from '@tanstack/react-table';
import { Search, Plus, ChevronDown, ChevronRight, ChevronUp } from 'lucide-react';
import Link from 'next/link';
import { TableSkeleton } from '@/shared/components/ui/Skeleton';
import { dataTableClasses } from './config';
import { AdminDataTableProps } from './types';

export function AdminDataTable({
  config,
  data = [],
  createButton,
  header,
  isLoading,
  manualPagination,
  searchQuery,
  onSearchChange,
  filters,
}: AdminDataTableProps): JSX.Element {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  // Use controlled search query if provided, otherwise local state
  const currentSearch = searchQuery ?? globalFilter;
  const handleSearchChange = (val: string) => {
    if (onSearchChange) {
      onSearchChange(val);
    } else {
      setGlobalFilter(val);
    }
  };

  // Convert config columns to TanStack Table columns
  const columns = useMemo<ColumnDef<unknown>[]>(() => {
    return config.columns.map((col) => {
      // Handle nested accessors (e.g., 'author.name')
      const hasNestedPath = col.data.includes('.');

      return {
        id: col.data,
        accessorFn: hasNestedPath
          ? (row) => {
            const keys = col.data.split('.');
            return keys.reduce((obj, key) => (obj as Record<string, unknown>)?.[key], row);
          }
          : undefined,
        accessorKey: hasNestedPath ? undefined : col.data,
        header: col.title,
        enableSorting: col.sortable ?? true,
        enableGlobalFilter: col.searchable ?? true,
        meta: {
          className: col.className,
          responsivePriority: col.responsivePriority,
        },
        cell: col.render
          ? ({ row, getValue }) => col.render?.(getValue(), 'display', row.original as Record<string, unknown>)
          : ({ getValue }) => String(getValue() ?? ''),
      };
    });
  }, [config.columns]);

  const table = useReactTable({
    data,
    columns,
    pageCount: manualPagination?.pageCount,
    state: {
      sorting,
      globalFilter: currentSearch,
      pagination: manualPagination ? {
        pageIndex: manualPagination.currentPage - 1,
        pageSize: config.pageLength ?? 20,
      } : undefined,
    },
    manualPagination: !!manualPagination,
    manualFiltering: !!manualPagination, // Disable client-side filtering if server-side pagination is on
    onSortingChange: setSorting,
    onGlobalFilterChange: (updater) => {
      // Handle TanStack's updater pattern
      const val = typeof updater === 'function' ? updater(currentSearch) : updater;
      handleSearchChange(val);
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: manualPagination ? (updater) => {
      if (typeof updater === 'function') {
        const newState = updater({
          pageIndex: manualPagination.currentPage - 1,
          pageSize: config.pageLength ?? 20,
        });
        manualPagination.onPageChange(newState.pageIndex + 1);
      } else {
        manualPagination.onPageChange(updater.pageIndex + 1);
      }
    } : undefined,
    initialState: {
      pagination: {
        pageSize: config.pageLength ?? 20,
      },
    },
  });

  // Toggle row expansion for mobile
  const toggleRowExpansion = (rowId: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [rowId]: !prev[rowId],
    }));
  };

  // Get columns by priority for responsive

  const secondaryColumns = columns.filter(
    (col) => (col.meta as { responsivePriority?: number })?.responsivePriority === 2
  );
  const hiddenColumns = columns.filter(
    (col) =>
      (col.meta as { responsivePriority?: number })?.responsivePriority === undefined ||
      ((col.meta as { responsivePriority?: number })?.responsivePriority ?? 0) > 2
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      {(header ?? createButton) && (
        <div className="flex items-center justify-between">
          {header && (
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{header.title}</h1>
              <p className="text-gray-600 mt-1">{header.description}</p>
            </div>
          )}
          {createButton && (
            <Link
              href={createButton.href}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              {createButton.label}
            </Link>
          )}
        </div>
      )}

      {/* Table wrapper */}
      <div className={dataTableClasses.wrapper}>
        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className={dataTableClasses.searchInputWrapper}>
              <Search className={dataTableClasses.searchIcon} />
              <input
                type="text"
                placeholder={config.search?.placeholder ?? 'Search...'}
                value={currentSearch}
                onChange={(e) => handleSearchChange(e.target.value)}
                className={dataTableClasses.searchInput}
              />
            </div>
          </div>
          {filters}
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="p-6">
            <TableSkeleton rows={10} />
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className={dataTableClasses.table}>
                <thead className={dataTableClasses.thead}>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id} className={dataTableClasses.theadTr}>
                      {headerGroup.headers.map((header) => (
                        <th key={header.id} className={dataTableClasses.theadTh}>
                          {header.isPlaceholder ? null : (
                            <div
                              className={
                                header.column.getCanSort()
                                  ? 'cursor-pointer select-none flex items-center gap-2'
                                  : ''
                              }
                              onClick={header.column.getToggleSortingHandler()}
                            >
                              {flexRender(header.column.columnDef.header, header.getContext())}
                              {header.column.getCanSort() && (
                                <span className="text-gray-400">
                                  {{
                                    asc: <ChevronUp className="w-4 h-4" />,
                                    desc: <ChevronDown className="w-4 h-4" />,
                                  }[header.column.getIsSorted() as string] ?? null}
                                </span>
                              )}
                            </div>
                          )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody className={dataTableClasses.tbody}>
                  {table.getRowModel().rows.length === 0 ? (
                    <tr>
                      <td colSpan={columns.length} className="text-center py-12 text-gray-500">
                        No data found
                      </td>
                    </tr>
                  ) : (
                    table.getRowModel().rows.map((row) => (
                      <tr key={row.id} className={dataTableClasses.tbodyTr}>
                        {row.getVisibleCells().map((cell) => (
                          <td
                            key={cell.id}
                            className={`${dataTableClasses.tbodyTd} ${(cell.column.columnDef.meta as { className?: string })?.className ?? ''
                              }`}
                          >
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Accordion */}
            <div className="block md:hidden">
              {table.getRowModel().rows.length === 0 ? (
                <div className="text-center py-12 text-gray-500">No data found</div>
              ) : (
                <div className="space-y-3">
                  {table.getRowModel().rows.map((row) => {
                    const isExpanded = expandedRows[row.id];
                    const cells = row.getVisibleCells();

                    return (
                      <div key={row.id} className="border border-gray-200 rounded-lg p-4 bg-white">
                        {/* Priority columns always visible */}
                        <div className="space-y-2">
                          {cells
                            .filter((cell) =>
                              (cell.column.columnDef.meta as { responsivePriority?: number })?.responsivePriority === 1
                            )
                            .map((cell) => (
                              <div key={cell.id}>
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                              </div>
                            ))}
                        </div>

                        {/* Expand button if there are hidden columns */}
                        {(hiddenColumns.length > 0 || secondaryColumns.length > 0) && (
                          <button
                            onClick={() => toggleRowExpansion(row.id)}
                            className="mt-3 flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                          >
                            {isExpanded ? (
                              <>
                                <ChevronDown className="w-4 h-4" />
                                Hide details
                              </>
                            ) : (
                              <>
                                <ChevronRight className="w-4 h-4" />
                                Show details
                              </>
                            )}
                          </button>
                        )}

                        {/* Expanded content */}
                        {isExpanded && (
                          <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                            {cells
                              .filter(
                                (cell) =>
                                  (cell.column.columnDef.meta as { responsivePriority?: number })?.responsivePriority !== 1
                              )
                              .map((cell) => (
                                <div key={cell.id}>
                                  <div className="text-xs font-medium text-gray-500 mb-1">
                                    {String(cell.column.columnDef.header)}
                                  </div>
                                  <div>{flexRender(cell.column.columnDef.cell, cell.getContext())}</div>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Pagination */}
            {table.getPageCount() > 1 && (
              <div className={dataTableClasses.paginationWrapper}>
                <div className={dataTableClasses.paginationInfo}>
                  Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
                  {manualPagination ? (
                    Math.min(
                      (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                      manualPagination.totalRecords
                    )
                  ) : (
                    Math.min(
                      (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                      table.getFilteredRowModel().rows.length
                    )
                  )}{' '}
                  of {manualPagination ? manualPagination.totalRecords : table.getFilteredRowModel().rows.length} entries
                </div>
                <div className={dataTableClasses.paginationButtons}>
                  <button
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    className={dataTableClasses.paginationButton}
                  >
                    Previous
                  </button>
                  <span className={dataTableClasses.paginationPageInfo}>
                    Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                  </span>
                  <button
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    className={dataTableClasses.paginationButton}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
