'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminTable } from '@/shared/hooks/useAdminTable';
import { useAuth } from '@/lib/auth/AuthContext';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { Plus, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { AdminDataTable } from '@/shared/components/datatables/AdminDataTable';
import { Member } from '@/types/member';
import { ITEMS_PER_PAGE } from '@/lib/constants/admin';
import { StatusBadge } from '@/shared/components/StatusBadge';

// Constraint for query builder type
interface QueryBuilder {
  eq(column: string, value: string): this;
}

interface MemberListItem {
  id: string;
  name: string;
  nim: string;
  email: string;
  batch: string;
  status: Member['status'];
  division: string | null;
  position: string | null;
}

export default function MembersPage() {
  const router = useRouter();
  const { hasPermission, loading: authLoading } = useAuth();
  const [batches, setBatches] = useState<string[]>([]);
  const [batchFilter, setBatchFilter] = useState<string>('all');

  // Check permissions
  useEffect(() => {
    if (authLoading) return;
    if (!hasPermission(['super_admin', 'admin'])) {
      router.push('/admin/dashboard');
    }
  }, [authLoading, hasPermission, router]);

  // Fetch available batches (memoized)
  const fetchBatches = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('members')
        .select('batch')
        .order('batch');

      if (error) throw error;

      const uniqueBatches = [...new Set((data || []).map((m) => (m as { batch: string }).batch))].sort();
      setBatches(uniqueBatches);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load batches';
      toast.error(message);
    }
  }, []);

  useEffect(() => {
    if (authLoading || !hasPermission(['super_admin', 'admin'])) return;
    fetchBatches();
  }, [authLoading, hasPermission, fetchBatches]);

  // Memoize searchColumns to prevent infinite re-renders
  const searchColumns = useMemo(() => ['name', 'nim', 'email'], []);

  // Memoize customFilter to prevent infinite re-renders
  const customFilter = useCallback(<Q extends QueryBuilder>(query: Q, filters: Record<string, string>): Q => {
    // Apply custom batch filter
    if (batchFilter !== 'all') {
      query = query.eq('batch', batchFilter);
    }
    // Apply status filter
    if (filters.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }
    return query;
  }, [batchFilter]);

  // All common CRUD logic handled by hook
  const {
    items: members,
    loading,
    totalCount,
    currentPage,
    setCurrentPage,
    totalPages,
    searchQuery,
    setSearchQuery,
    filters,
    setFilter,
    deleteItem,
  } = useAdminTable<MemberListItem>({
    tableName: 'members',
    selectColumns: 'id, name, nim, email, batch, status, division, position',
    sortColumn: 'name',
    sortAscending: true,
    itemsPerPage: ITEMS_PER_PAGE,
    filterByAuthor: false,
    searchColumns,
    customFilter,
  });

  const handleDelete = useCallback(async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;
    await deleteItem(id);
  }, [deleteItem]);

  // Table Configuration
  const tableConfig = useMemo(() => ({
    tableName: 'members',
    columns: [
      {
        data: 'name',
        title: 'Name',
        sortable: true,
        responsivePriority: 1,
        className: 'font-medium text-gray-900',
      },
      {
        data: 'nim',
        title: 'NIM',
        sortable: true,
        responsivePriority: 2,
      },
      {
        data: 'email',
        title: 'Email',
        sortable: true,
      },
      {
        data: 'batch',
        title: 'Batch',
        sortable: true,
      },
      {
        data: 'status',
        title: 'Status',
        sortable: true,
        render: (val: unknown) => <StatusBadge status={val as Member['status']} defaultColor="active" />,
      },
      {
        data: 'division',
        title: 'Division',
        sortable: true,
        render: (val: unknown) => val ? String(val) : '-',
      },
      {
        data: 'id', // Using ID for actions column
        title: 'Actions',
        sortable: false,
        className: 'text-right',
        render: (id: unknown, _: string, row: Record<string, unknown>) => (
          <div className="flex items-center justify-end gap-2">
            <Link
              href={`/admin/members/${id}`}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit"
            >
              <Edit className="w-4 h-4" />
            </Link>
            <button
              onClick={() => handleDelete(id as string, row.name as string)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ),
      },
    ],
    pageLength: ITEMS_PER_PAGE,
    search: {
      placeholder: 'Search by name, NIM, or email...',
    },
  }), [handleDelete]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Members</h1>
          <p className="text-gray-600 mt-1">Manage organization members</p>
        </div>
        <Link
          href="/admin/members/new"
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Member
        </Link>
      </div>

      <AdminDataTable
        config={tableConfig}
        data={members}
        isLoading={loading}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filters={
          <div className="flex flex-col md:flex-row gap-4">
            <select
              value={filters.status || 'all'}
              onChange={(e) => setFilter('status', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="alumni">Alumni</option>
            </select>

            <select
              value={batchFilter}
              onChange={(e) => setBatchFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Batches</option>
              {batches.map((batch) => (
                <option key={batch} value={batch}>
                  Batch {batch}
                </option>
              ))}
            </select>
          </div>
        }
        manualPagination={{
          currentPage,
          pageCount: totalPages,
          totalRecords: totalCount,
          onPageChange: setCurrentPage,
        }}
      />
    </div>
  );
}
