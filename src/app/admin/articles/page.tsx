'use client';

import { useAdminTable } from '@/shared/hooks/useAdminTable';
import { useAuth } from '@/lib/auth/AuthContext';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { Search, Plus, Edit, Trash2, Eye, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { Article } from '@/types/article';
import { ITEMS_PER_PAGE } from '@/lib/constants/admin';
import { StatusBadge } from '@/shared/components/StatusBadge';
import { CategoryBadge } from '@/shared/components/CategoryBadge';

interface ArticleListItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  status: Article['status'];
  author: {
    name: string;
    email: string;
  };
  author_id: string;
  published_at: string;
}

export default function ArticlesPage() {
  const { user, profile, hasPermission, canEditOwnContent, canPublishArticles } = useAuth();

  // All common CRUD logic handled by hook
  const {
    items: articles,
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
    refetch,
  } = useAdminTable<ArticleListItem>({
    tableName: 'articles',
    selectColumns: 'id, title, slug, category, status, author, author_id, published_at',
    sortColumn: 'published_at',
    sortAscending: false,
    itemsPerPage: ITEMS_PER_PAGE,
    filterByAuthor: true, // Kontributor sees only their articles
    searchColumns: ['title', 'author->>name'], // Search in title and author name
  });

  // Custom actions (publish/unpublish) stay here
  async function handlePublish(id: string, title: string) {
    if (!canPublishArticles()) {
      toast.error('You do not have permission to publish articles');
      return;
    }

    if (!confirm(`Publish "${title}"?`)) return;

    // Optimistic update
    const now = new Date().toISOString();

    try {
      const { error } = await supabase
        .from('articles')
        .update({ status: 'published' as const, published_at: now } as unknown as never)
        .eq('id', id);

      if (error) throw error;

      toast.success('Article published successfully');
      await refetch();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to publish article';
      toast.error(message);
    }
  }

  async function handleUnpublish(id: string, title: string) {
    if (!canPublishArticles()) {
      toast.error('You do not have permission to unpublish articles');
      return;
    }

    if (!confirm(`Unpublish "${title}"? It will be set to draft.`)) return;

    try {
      const { error } = await supabase
        .from('articles')
        .update({ status: 'draft' as const } as unknown as never)
        .eq('id', id);

      if (error) throw error;

      toast.success('Article unpublished successfully');
      await refetch();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to unpublish article';
      toast.error(message);
    }
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    await deleteItem(id);
  }

  function canEditArticle(article: ArticleListItem): boolean {
    if (hasPermission(['super_admin', 'admin'])) return true;
    if (profile?.role === 'kontributor' && user) {
      return canEditOwnContent(article.author_id) && article.status === 'draft';
    }
    return false;
  }

  function canDeleteArticle(article: ArticleListItem): boolean {
    if (hasPermission(['super_admin', 'admin'])) return true;
    if (profile?.role === 'kontributor' && user) {
      return canEditOwnContent(article.author_id) && article.status === 'draft';
    }
    return false;
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
          <h1 className="text-2xl font-bold text-gray-900">Articles</h1>
          <p className="text-gray-600 mt-1">Manage articles and publications</p>
        </div>
        <Link
          href="/admin/articles/new"
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Article
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by title or author..."
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
            <option value="draft">Draft</option>
            <option value="pending">Pending</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>

          <select
            value={filters.category || 'all'}
            onChange={(e) => setFilter('category', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            <option value="post">Post</option>
            <option value="blog">Blog</option>
            <option value="opinion">Opinion</option>
            <option value="publication">Publication</option>
            <option value="info">Info</option>
          </select>
        </div>

        {articles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No articles found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Title</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Author</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {articles.map((article) => (
                    <tr key={article.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-900">{article.title}</div>
                        <div className="text-sm text-gray-500">{article.slug}</div>
                      </td>
                      <td className="py-3 px-4 text-gray-700">{article.author.name}</td>
                      <td className="py-3 px-4"><CategoryBadge category={article.category} /></td>
                      <td className="py-3 px-4"><StatusBadge status={article.status} /></td>
                      <td className="py-3 px-4 text-gray-700">
                        {new Date(article.published_at).toLocaleDateString('id-ID')}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          {article.status === 'published' && (
                            <Link
                              href={`/articles/${article.slug}`}
                              target="_blank"
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="View"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                          )}

                          {article.status !== 'published' && canPublishArticles() && (
                            <button
                              onClick={() => handlePublish(article.id, article.title)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Publish"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}

                          {article.status === 'published' && canPublishArticles() && (
                            <button
                              onClick={() => handleUnpublish(article.id, article.title)}
                              className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                              title="Unpublish"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}

                          {canEditArticle(article) && (
                            <Link
                              href={`/admin/articles/${article.id}`}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>
                          )}

                          {canDeleteArticle(article) && (
                            <button
                              onClick={() => handleDelete(article.id, article.title)}
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
                  {Math.min(currentPage * ITEMS_PER_PAGE, totalCount)} of {totalCount} articles
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
