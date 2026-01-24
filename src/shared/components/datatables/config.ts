/**
 * Tailwind CSS classes for AdminDataTable
 * Matches current admin panel theme (green color scheme)
 */
export const dataTableClasses = {
  // Wrapper
  wrapper: 'bg-white rounded-xl shadow-sm border border-gray-200 p-6',

  // Table
  table: 'w-full',

  // Header
  thead: '',
  theadTr: 'border-b border-gray-200',
  theadTh: 'text-left py-3 px-4 font-semibold text-gray-700',

  // Body
  tbody: '',
  tbodyTr: 'border-b border-gray-100 hover:bg-gray-50 transition-colors',
  tbodyTd: 'py-3 px-4 text-gray-700',

  // Search input
  searchWrapper: 'mb-6',
  searchInputWrapper: 'relative',
  searchIcon: 'absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5',
  searchInput:
    'w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent',

  // Pagination
  paginationWrapper: 'flex items-center justify-between mt-6 pt-6 border-t border-gray-200',
  paginationInfo: 'text-sm text-gray-600',
  paginationButtons: 'flex gap-2',
  paginationButton:
    'px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors',
  paginationButtonActive: 'bg-green-600 text-white border-green-600 hover:bg-green-700',
  paginationPageInfo: 'px-4 py-2 text-sm text-gray-600',

  // Loading state
  loadingWrapper: 'flex items-center justify-center min-h-[400px]',
  loadingSpinner: 'animate-spin rounded-full h-8 w-8 border-b-2 border-green-600',

  // Empty state
  emptyWrapper: 'text-center py-12',
  emptyText: 'text-gray-500',
};
