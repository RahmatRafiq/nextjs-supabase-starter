'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/lib/auth/AuthContext';
import { toast } from 'sonner';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface Member {
  id: string;
  name: string;
  nim: string;
  email: string;
  batch: string;
  status: string;
  division: string | null;
  position: string | null;
}

type StatusFilter = 'all' | 'active' | 'inactive' | 'alumni';

const ITEMS_PER_PAGE = 20;

export default function MembersPage() {
  const router = useRouter();
  const { profile, hasPermission, loading: authLoading } = useAuth();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [batchFilter, setBatchFilter] = useState<string>('all');
  const [batches, setBatches] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    // Wait for auth to load
    if (authLoading) return;

    // Check permissions
    if (!hasPermission(['super_admin', 'admin'])) {
      router.push('/admin/dashboard');
      return;
    }

    fetchBatches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, profile?.id]);

  // Initial fetch and refetch when filters/pagination change
  useEffect(() => {
    // Wait for auth to load
    if (authLoading) return;

    // Only fetch if user has permission
    if (!hasPermission(['super_admin', 'admin'])) return;

    const timer = setTimeout(() => {
      fetchMembers();
    }, searchQuery ? 300 : 0); // Debounce only for search

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, searchQuery, statusFilter, batchFilter, currentPage, profile?.id]);

  async function fetchBatches() {
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
  }

  async function fetchMembers() {
    try {
      setLoading(true);

      // Build query with server-side filtering
      let query = supabase
        .from('members')
        .select('id, name, nim, email, batch, status, division, position', { count: 'exact' })
        .order('name');

      // Server-side search filter
      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,nim.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`);
      }

      // Server-side status filter
      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      // Server-side batch filter
      if (batchFilter !== 'all') {
        query = query.eq('batch', batchFilter);
      }

      // Pagination
      const from = (currentPage - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      setMembers((data || []) as Member[]);
      setTotalCount(count || 0);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load members';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;

    // Optimistic update
    const previousMembers = [...members];
    setMembers(members.filter((m) => m.id !== id));
    setTotalCount((prev) => prev - 1);

    try {
      const { error } = await supabase.from('members').delete().eq('id', id);

      if (error) throw error;

      toast.success('Member deleted successfully');
    } catch (error) {
      // Rollback on error
      setMembers(previousMembers);
      setTotalCount((prev) => prev + 1);
      const message = error instanceof Error ? error.message : 'Failed to delete member';
      toast.error(message);
    }
  }

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
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
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
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          member.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : member.status === 'alumni'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {member.status}
                      </span>
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
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 text-sm text-gray-600">
                    Page {currentPage} of {Math.ceil(totalCount / ITEMS_PER_PAGE)}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(Math.ceil(totalCount / ITEMS_PER_PAGE), p + 1))
                    }
                    disabled={currentPage >= Math.ceil(totalCount / ITEMS_PER_PAGE)}
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
