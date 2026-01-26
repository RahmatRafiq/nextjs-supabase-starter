'use client';

import { useMemo, useCallback } from 'react';
import { useAdminTable } from '@/shared/hooks/useAdminTable';
import { useAuth } from '@/lib/auth/AuthContext';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
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

  const handleDelete = useCallback(async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    await deleteItem(id);
  }, [deleteItem]);

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Events</h1>
          <p className="text-gray-600 mt-1">Manage events and activities</p>
        </div>
        <Link
          href="/admin/events/new"
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Event
        </Link>
      </div>

      <AdminDataTable
        config={tableConfig}
        data={events}
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
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <select
              value={filters.category || 'all'}
              onChange={(e) => setFilter('category', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="seminar">Seminar</option>
              <option value="workshop">Workshop</option>
              <option value="community-service">Community Service</option>
              <option value="competition">Competition</option>
              <option value="training">Training</option>
              <option value="other">Other</option>
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
