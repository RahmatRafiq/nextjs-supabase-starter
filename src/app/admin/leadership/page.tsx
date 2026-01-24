'use client';

import { useMemo, useCallback } from 'react';
import { useAdminTable } from '@/shared/hooks/useAdminTable';
import { Search, Plus, Edit, Trash2, Calendar } from 'lucide-react';
import Link from 'next/link';
import { Leadership } from '@/types/leadership';
import { ITEMS_PER_PAGE } from '@/lib/constants/admin';

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

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, position, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {leaders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No leaders found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Order</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Position</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Division</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Period</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {leaders.map((leader) => (
                    <tr key={leader.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-700">{leader.order}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={leader.photo}
                            alt={leader.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <div className="font-medium text-gray-900">{leader.name}</div>
                            {leader.email && (
                              <div className="text-sm text-gray-500">{leader.email}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        {POSITION_LABELS[leader.position] || leader.position}
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        {leader.division ? DIVISION_LABELS[leader.division] || leader.division : '-'}
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="w-4 h-4" />
                          {new Date(leader.period_start).getFullYear()} - {new Date(leader.period_end).getFullYear()}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/leadership/${leader.id}`}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(leader.id, leader.name)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
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
                  {Math.min(currentPage * ITEMS_PER_PAGE, totalCount)} of {totalCount} leaders
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
