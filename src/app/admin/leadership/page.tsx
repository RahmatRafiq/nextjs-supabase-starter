'use client';

import { useState, useMemo, useCallback } from 'react';
import { useAdminTable } from '@/shared/hooks/useAdminTable';
import { Edit, Trash2, Calendar } from 'lucide-react';
import { Modal } from '@/shared/components/ui/Modal';
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

  const handleDelete = useCallback((id: string, name: string) => {
    setConfirmState({
      isOpen: true,
      title: 'Delete Leader',
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
            {row.photo ? (
              <img
                src={row.photo}
                alt={row.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-green-100 text-green-800 flex items-center justify-center font-semibold text-sm">
                {row.name.charAt(0)}
              </div>
            )}
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

  return (
    <div className="space-y-6">
      <AdminDataTable
        config={tableConfig}
        data={leaders}
        createButton={{
          label: 'Add Leader',
          href: '/admin/leadership/new',
        }}
        header={{
          title: 'Leadership',
          description: 'Manage organization leadership',
        }}
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
