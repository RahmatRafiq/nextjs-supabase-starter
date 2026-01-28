'use client';

import { useState, useMemo, useCallback } from 'react';
import { useAdminTable } from '@/shared/hooks/useAdminTable';
import { useAuth } from '@/lib/auth/AuthContext';
import { Edit, Trash2, Eye } from 'lucide-react';
import { Modal } from '@/shared/components/ui/Modal';
import { Select } from '@/shared/components/ui/Select';
import Link from 'next/link';
import { Event } from '@/types/event';
import { ITEMS_PER_PAGE } from '@/lib/constants/admin';
import { StatusBadge } from '@/shared/components/StatusBadge';
import { CategoryBadge } from '@/shared/components/CategoryBadge';
import { AdminDataTable } from '@/shared/components/datatables/AdminDataTable';

interface EventListItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  status: Event['status'];
  start_date: string;
  end_date: string;
  creator_id: string;
  organizer: {
    name: string;
  };
}

export default function EventsPage() {
  const { user, profile, hasPermission, canEditOwnContent } = useAuth();

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
  const searchColumns = useMemo(() => ['title', 'organizer->>name'], []);

  // All common CRUD logic handled by hook
  const {
    items: events,
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
  } = useAdminTable<EventListItem>({
    tableName: 'events',
    selectColumns: 'id, title, slug, category, status, start_date, end_date, creator_id, organizer',
    sortColumn: 'start_date',
    sortAscending: false,
    itemsPerPage: ITEMS_PER_PAGE,
    filterByAuthor: true,
    authorColumn: 'creator_id',
    searchColumns,
  });

  const handleDelete = useCallback((id: string, title: string) => {
    setConfirmState({
      isOpen: true,
      title: 'Delete Event',
      description: `Are you sure you want to delete "${title}"? This action cannot be undone.`,
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

  const canEditEvent = useCallback((event: EventListItem): boolean => {
    if (hasPermission(['super_admin', 'admin'])) return true;
    if (profile?.role === 'kontributor' && user) {
      return canEditOwnContent(event.creator_id);
    }
    return false;
  }, [hasPermission, profile?.role, user, canEditOwnContent]);

  const canDeleteEvent = useCallback((event: EventListItem): boolean => {
    if (hasPermission(['super_admin', 'admin'])) return true;
    if (profile?.role === 'kontributor' && user) {
      return canEditOwnContent(event.creator_id);
    }
    return false;
  }, [hasPermission, profile?.role, user, canEditOwnContent]);

  // Create table configuration with callbacks (memoized)
  const tableConfig = useMemo(() => ({
    tableName: 'events',
    columns: [
      {
        data: 'title',
        title: 'Title',
        sortable: true,
        responsivePriority: 1,
        render: (_: unknown, __: string, row: any) => (
          <div>
            <div className="font-medium text-gray-900">{row.title}</div>
            <div className="text-sm text-gray-500">{row.slug}</div>
          </div>
        ),
      },
      {
        data: 'organizer.name',
        title: 'Organizer',
        sortable: true,
        render: (val: unknown) => <span className="text-gray-700">{String(val)}</span>,
      },
      {
        data: 'category',
        title: 'Category',
        sortable: true,
        render: (val: unknown) => <CategoryBadge category={val as string} colorClass="bg-purple-100 text-purple-800" />,
      },
      {
        data: 'status',
        title: 'Status',
        sortable: true,
        render: (val: unknown) => <StatusBadge status={val as Event['status']} defaultColor="upcoming" />,
      },
      {
        data: 'start_date',
        title: 'Date',
        sortable: true,
        render: (val: unknown) => (
          <span className="text-gray-700">
            {new Date(val as string).toLocaleDateString('id-ID')}
          </span>
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
              href={`/events/${row.slug}`}
              target="_blank"
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="View"
            >
              <Eye className="w-4 h-4" />
            </Link>

            {canEditEvent(row as EventListItem) && (
              <Link
                href={`/admin/events/${id}`}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Edit"
              >
                <Edit className="w-4 h-4" />
              </Link>
            )}

            {canDeleteEvent(row as EventListItem) && (
              <button
                onClick={() => handleDelete(id as string, row.title)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ),
      },
    ],
    pageLength: ITEMS_PER_PAGE,
    search: {
      placeholder: 'Search by title or organizer...',
    },
  }), [canEditEvent, canDeleteEvent, handleDelete]);

  return (
    <div className="space-y-6">
      <AdminDataTable
        config={tableConfig}
        data={events}
        createButton={{
          label: 'Add Event',
          href: '/admin/events/new',
        }}
        header={{
          title: 'Events',
          description: 'Manage events and activities',
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
                  { value: 'upcoming', label: 'Upcoming' },
                  { value: 'ongoing', label: 'Ongoing' },
                  { value: 'completed', label: 'Completed' },
                  { value: 'cancelled', label: 'Cancelled' },
                ]}
              />
            </div>

            <div className="w-full md:w-48">
              <Select
                value={filters.category || 'all'}
                onChange={(val) => setFilter('category', val)}
                options={[
                  { value: 'all', label: 'All Categories' },
                  { value: 'seminar', label: 'Seminar' },
                  { value: 'workshop', label: 'Workshop' },
                  { value: 'community-service', label: 'Community Service' },
                  { value: 'competition', label: 'Competition' },
                  { value: 'training', label: 'Training' },
                  { value: 'other', label: 'Other' },
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
