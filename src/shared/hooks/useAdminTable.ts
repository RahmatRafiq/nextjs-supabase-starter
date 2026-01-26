/**
 * useAdminTable Hook
 *
 * Reusable hook for admin CRUD table pages with common functionality:
 * - Data fetching with pagination
 * - Search with debounce
 * - Multiple filters (status, category, etc.)
 * - Delete operations
 * - Permission-based data filtering (kontributor sees only their own data)
 *
 * This hook reduces ~100 lines of duplicate code per admin page.
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/lib/auth/AuthContext';
import { toast } from 'sonner';

// Constraint for query builder type
interface QueryBuilder {
  eq(column: string, value: string): this;
}

interface UseAdminTableOptions {
  /** Table name in Supabase */
  tableName: string;
  /** Columns to select (e.g., 'id, title, slug, status') */
  selectColumns: string;
  /** Default sort column */
  sortColumn?: string;
  /** Sort direction */
  sortAscending?: boolean;
  /** Items per page */
  itemsPerPage?: number;
  /** If true, kontributor can only see their own items */
  filterByAuthor?: boolean;
  /** Author column name (default: 'author_id') */
  authorColumn?: string;
  /** Search columns for OR search (e.g., ['title', 'author->>name']) */
  searchColumns?: string[];
  /** Custom filter function - query type will be inferred */
  customFilter?: <Q extends QueryBuilder>(query: Q, filters: Record<string, string>) => Q;
}

interface UseAdminTableResult<T> {
  // Data state
  items: T[];
  loading: boolean;
  totalCount: number;

  // Pagination
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;

  // Search & filters
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filters: Record<string, string>;
  setFilter: (key: string, value: string) => void;

  // Actions
  refetch: () => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
}

export function useAdminTable<T extends { id: string }>(
  options: UseAdminTableOptions
): UseAdminTableResult<T> {
  const {
    tableName,
    selectColumns,
    sortColumn = 'created_at',
    sortAscending = false,
    itemsPerPage = 20,
    filterByAuthor = false,
    authorColumn = 'author_id',
    searchColumns = [],
    customFilter,
  } = options;

  const { user, profile } = useAuth();

  // State
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Calculated
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  // Fetch function
  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);

      // Build base query
      let query = supabase
        .from(tableName)
        .select(selectColumns, { count: 'exact' })
        .order(sortColumn, { ascending: sortAscending });

      // Filter by author for kontributor role
      if (filterByAuthor && profile?.role === 'kontributor' && user) {
        query = query.eq(authorColumn, user.id);
      }

      // Apply search filter
      if (searchQuery && searchColumns.length > 0) {
        const searchConditions = searchColumns
          .map(col => `${col}.ilike.%${searchQuery}%`)
          .join(',');
        query = query.or(searchConditions);
      }

      // Apply custom filters
      if (customFilter) {
        query = customFilter(query, filters);
      } else {
        // Default filter application (eq for each filter key)
        Object.entries(filters).forEach(([key, value]) => {
          if (value && value !== 'all') {
            query = query.eq(key, value);
          }
        });
      }

      // Pagination
      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;
      query = query.range(from, to);

      // Execute query
      const { data, error, count } = await query;

      if (error) throw error;

      setItems((data as T[]) || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error(`Error fetching ${tableName}:`, error);
      toast.error(`Gagal memuat data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  }, [
    tableName,
    selectColumns,
    sortColumn,
    sortAscending,
    itemsPerPage,
    filterByAuthor,
    authorColumn,
    searchQuery,
    searchColumns,
    filters,
    currentPage,
    profile?.id,
    profile?.role,
    user,
    customFilter,
  ]);

  // Effect: Fetch on mount and when dependencies change
  useEffect(() => {
    // Only fetch if profile is loaded
    if (!profile) return;

    // Debounce search
    const timer = setTimeout(() => {
      fetchItems();
    }, searchQuery ? 300 : 0);

    return () => clearTimeout(timer);
  }, [fetchItems, profile, searchQuery]);

  // Delete function
  const deleteItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Data berhasil dihapus');

      // If last item on page, go to previous page
      if (items.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        await fetchItems();
      }
    } catch (error) {
      console.error(`Error deleting ${tableName}:`, error);
      toast.error(`Gagal menghapus data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Helper to set individual filter
  const setFilter = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page on filter change
  };

  return {
    // Data
    items,
    loading,
    totalCount,

    // Pagination
    currentPage,
    setCurrentPage,
    totalPages,

    // Search & filters
    searchQuery,
    setSearchQuery: (query: string) => {
      setSearchQuery(query);
      setCurrentPage(1); // Reset to first page on search
    },
    filters,
    setFilter,

    // Actions
    refetch: fetchItems,
    deleteItem,
  };
}
