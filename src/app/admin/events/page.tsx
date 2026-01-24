'use client';

import { useMemo, useCallback } from 'react';
import { useAdminTable } from '@/shared/hooks/useAdminTable';
import { useAuth } from '@/lib/auth/AuthContext';
import { toast } from 'sonner';
import { Search, Plus, Edit, Trash2, Eye } from 'lucide-react';
import Link from 'next/link';
import { Event } from '@/types/event';
import { ITEMS_PER_PAGE } from '@/lib/constants/admin';
import { StatusBadge } from '@/shared/components/StatusBadge';
import { CategoryBadge } from '@/shared/components/CategoryBadge';

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

  if (loading) {
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

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by title or organizer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

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

        {events.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No events found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Title</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Organizer</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event) => (
                    <tr key={event.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-900">{event.title}</div>
                        <div className="text-sm text-gray-500">{event.slug}</div>
                      </td>
                      <td className="py-3 px-4 text-gray-700">{event.organizer.name}</td>
                      <td className="py-3 px-4"><CategoryBadge category={event.category} colorClass="bg-purple-100 text-purple-800" /></td>
                      <td className="py-3 px-4"><StatusBadge status={event.status} defaultColor="upcoming" /></td>
                      <td className="py-3 px-4 text-gray-700">
                        {new Date(event.start_date).toLocaleDateString('id-ID')}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/events/${event.slug}`}
                            target="_blank"
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>

                          {canEditEvent(event) && (
                            <Link
                              href={`/admin/events/${event.id}/edit`}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>
                          )}

                          {canDeleteEvent(event) && (
                            <button
                              onClick={() => handleDelete(event.id, event.title)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalCount > ITEMS_PER_PAGE && (
              <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{' '}
                  {Math.min(currentPage * ITEMS_PER_PAGE, totalCount)} of {totalCount} events
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
