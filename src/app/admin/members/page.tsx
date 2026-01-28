'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminTable } from '@/shared/hooks/useAdminTable';
import { useAuth } from '@/lib/auth/AuthContext';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { Edit, Trash2 } from 'lucide-react';
import { Modal } from '@/shared/components/ui/Modal';
import { Select } from '@/shared/components/ui/Select';
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

  // Confirmation Modal State
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => Promise<void>;
    variant: 'danger' | 'primary';
    isLoading: boolean;
  }>({
    isOpen: false,
    title: '',
    description: '',
    onConfirm: async () => { },
    variant: 'primary',
    isLoading: false,
  });

  const closeConfirm = () => setConfirmState(prev => ({ ...prev, isOpen: false }));

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

  const handleDelete = useCallback((id: string, name: string) => {
    setConfirmState({
      isOpen: true,
      title: 'Delete Member',
      description: `Are you sure you want to delete ${name}? This action cannot be undone.`,
      variant: 'danger',
      isLoading: false,
      onConfirm: async () => await deleteItem(id),
    });
  }, [deleteItem]);

  // Handle actual confirmation click
  const onConfirmClick = async () => {
    setConfirmState(prev => ({ ...prev, isLoading: true }));
    await confirmState.onConfirm();
    setConfirmState(prev => ({ ...prev, isOpen: false, isLoading: false }));
  };

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
      <AdminDataTable
        config={tableConfig}
        data={members}
        createButton={{
          label: 'Add Member',
          href: '/admin/members/new',
        }}
        header={{
          title: 'Members',
          description: 'Manage organization members',
        }}
        isLoading={loading}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filters={
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <div className="w-full md:w-48">
              <Select
                value={filters.status || 'all'}
                onChange={(val) => setFilter('status', val)}
                options={[
                  { value: 'all', label: 'All Status' },
                  { value: 'active', label: 'Active' },
                  { value: 'inactive', label: 'Inactive' },
                  { value: 'alumni', label: 'Alumni' },
                ]}
              />
            </div>

            <div className="w-full md:w-48">
              <Select
                value={batchFilter}
                onChange={(val) => setBatchFilter(val)}
                options={[
                  { value: 'all', label: 'All Batches' },
                  ...batches.map((batch) => ({ value: batch, label: `Batch ${batch}` })),
                ]}
              />
            </div>
          </div>
        }
        manualPagination={{
          currentPage,
          pageCount: totalPages,
          totalRecords: totalCount,
          onPageChange: setCurrentPage,
        }}
      />

      {/* Confirmation Modal */}
      <Modal
        isOpen={confirmState.isOpen}
        onClose={closeConfirm}
        title={confirmState.title}
      >
        <div className="space-y-4">
          <p className="text-gray-600">{confirmState.description}</p>
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={closeConfirm}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              disabled={confirmState.isLoading}
            >
              Cancel
            </button>
            <button
              onClick={onConfirmClick}
              disabled={confirmState.isLoading}
              className={`px-4 py-2 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed
                ${confirmState.variant === 'danger'
                  ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                  : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                }`}
            >
              {confirmState.isLoading ? 'Processing...' : 'Confirm'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
