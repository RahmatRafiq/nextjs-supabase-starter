'use client';

import { useMemo, useCallback } from 'react';
import { useAdminTable } from '@/shared/hooks/useAdminTable';
import { Plus, Edit, Trash2, Calendar } from 'lucide-react';
import Link from 'next/link';
import { Leadership } from '@/types/leadership';
import { ITEMS_PER_PAGE } from '@/lib/constants/admin';
import { AdminDataTable } from '@/shared/components/datatables/AdminDataTable';

const POSITION_LABELS: Record<string, string> = {
  'ketua': 'Ketua',
  'wakil-ketua': 'Wakil Ketua',
  'sekretaris': 'Sekretaris',
  'bendahara': 'Bendahara',
  'coordinator': 'Koordinator',
  'member': 'Anggota',
};

const DIVISION_LABELS: Record<string, string> = {
  'internal-affairs': 'Internal Affairs',
  'external-affairs': 'External Affairs',
  'academic': 'Academic',
  'student-development': 'Student Development',
  'entrepreneurship': 'Entrepreneurship',
  'media-information': 'Media & Information',
  'sports-arts': 'Sports & Arts',
  'islamic-spirituality': 'Islamic Spirituality',
};

export default function LeadershipPage() {
  // Memoize searchColumns to prevent infinite re-renders
  const searchColumns = useMemo(() => ['name', 'position', 'email'], []);

  const {
    items: leaders,
    loading,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    totalCount,
    totalPages,
    deleteItem,
  } = useAdminTable<Leadership>({
    tableName: 'leadership',
    selectColumns: '*',
    sortColumn: 'order',
    sortAscending: true,
    itemsPerPage: ITEMS_PER_PAGE,
    searchColumns,
  });

  const handleDelete = useCallback(async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;
    await deleteItem(id);
  }, [deleteItem]);

  // Table Configuration
  const tableConfig = useMemo(() => ({
    tableName: 'leadership',
    columns: [
      {
        data: 'order',
        title: 'Order',
        sortable: true,
        responsivePriority: 2,
        className: 'text-gray-700',
      },
      {
        data: 'name',
        title: 'Name',
        sortable: true,
        responsivePriority: 1,
        render: (_: unknown, __: string, row: any) => (
          <div className="flex items-center gap-3">
            <img
              src={row.photo}
              alt={row.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <div className="font-medium text-gray-900">{row.name}</div>
              {row.email && (
                <div className="text-sm text-gray-500">{row.email}</div>
              )}
            </div>
          </div>
        ),
      },
      {
        data: 'position',
        title: 'Position',
        sortable: true,
        render: (val: unknown) => <span className="text-gray-700">{POSITION_LABELS[String(val)] || String(val)}</span>,
      },
      {
        data: 'division',
        title: 'Division',
        sortable: true,
        render: (val: unknown) => <span className="text-gray-700">{val ? DIVISION_LABELS[String(val)] || String(val) : '-'}</span>,
      },
      {
        data: 'period_start', // Using period_start as key
        title: 'Period',
        sortable: true,
        render: (_: unknown, __: string, row: any) => (
          <div className="flex items-center gap-1 text-sm text-gray-700">
            <Calendar className="w-4 h-4" />
            {new Date(row.period_start).getFullYear()} - {new Date(row.period_end).getFullYear()}
          </div>
        ),
      },
      {
        data: 'id',
        title: 'Actions',
        sortable: false,
        className: 'text-right',
        render: (id: unknown, _: string, row: any) => (
          <div className="flex items-center justify-end gap-2">
            <Link
              href={`/admin/leadership/${id}`}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit"
            >
              <Edit className="w-4 h-4" />
            </Link>
            <button
              onClick={() => handleDelete(id as string, row.name)}
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
      placeholder: 'Search by name, position, or email...',
    },
  }), [handleDelete]);

  if (loading) {
    // We let AdminDataTable handle loading state if we want, but if we want full page replacement during initial load:
    // Actually, AdminDataTable rendering Skeleton is better.
    // So removing this block if AdminDataTable handles it nicely.
    // However, the surrounding layout (Add button etc) is nice to see.
    // So I will remove this block and let AdminDataTable show skeleton.
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leadership</h1>
          <p className="text-gray-600 mt-1">Manage organization leadership</p>
        </div>
        <Link
          href="/admin/leadership/new"
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Leader
        </Link>
      </div>

      <AdminDataTable
        config={tableConfig}
        data={leaders}
        isLoading={loading}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
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
