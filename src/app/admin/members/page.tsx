'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminTable } from '@/shared/hooks/useAdminTable';
import { useAuth } from '@/lib/auth/AuthContext';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { Member } from '@/types/member';
import { ITEMS_PER_PAGE } from '@/lib/constants/admin';
import { StatusBadge } from '@/shared/components/StatusBadge';

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
  const { profile, hasPermission, loading: authLoading } = useAuth();
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
  const customFilter = useCallback((query: any, filters: Record<string, string>) => {
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

  if (loading || authLoading) {
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

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, NIM, or email..."
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

        {members.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No members found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">NIM</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Batch</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Division</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((member) => (
                    <tr key={member.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-900">{member.name}</td>
                      <td className="py-3 px-4 text-gray-700">{member.nim}</td>
                      <td className="py-3 px-4 text-gray-700">{member.email}</td>
                      <td className="py-3 px-4 text-gray-700">{member.batch}</td>
                      <td className="py-3 px-4">
                        <StatusBadge status={member.status} defaultColor="active" />
                      </td>
                      <td className="py-3 px-4 text-gray-700">{member.division || '-'}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/members/${member.id}/edit`}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(member.id, member.name)}
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
                  {Math.min(currentPage * ITEMS_PER_PAGE, totalCount)} of {totalCount} members
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
