'use client';

import { useMemo, useCallback } from 'react';
import { useAdminTable } from '@/shared/hooks/useAdminTable';
import { useAuth } from '@/lib/auth/AuthContext';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { AdminDataTable } from '@/shared/components/datatables/AdminDataTable';
import { createArticlesConfig } from './articles.config';
import { Article } from '@/types/article';
import { ITEMS_PER_PAGE } from '@/lib/constants/admin';

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

  // Memoize searchColumns to prevent infinite re-renders
  const searchColumns = useMemo(() => ['title', 'author->>name'], []);

  // Fetch articles data with hook
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
    refetch,
  } = useAdminTable<ArticleListItem>({
    tableName: 'articles',
    selectColumns: 'id, title, slug, category, status, author, author_id, published_at',
    sortColumn: 'published_at',
    sortAscending: false,
    itemsPerPage: ITEMS_PER_PAGE,
    filterByAuthor: true, // Kontributor sees only their articles
    searchColumns,
  });

  // Publish article
  const handlePublish = useCallback(async (id: string, title: string) => {
    if (!canPublishArticles()) {
      toast.error('You do not have permission to publish articles');
      return;
    }

    if (!confirm(`Publish "${title}"?`)) return;

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
  }, [canPublishArticles, refetch]);

  // Unpublish article
  const handleUnpublish = useCallback(async (id: string, title: string) => {
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
  }, [canPublishArticles, refetch]);

  // Delete article
  const handleDelete = useCallback(async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const { error } = await supabase.from('articles').delete().eq('id', id);

      if (error) throw error;

      toast.success('Article deleted successfully');
      await refetch();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete article';
      toast.error(message);
    }
  }, [refetch]);

  // Permission checks
  const canEditArticle = useCallback((article: ArticleListItem): boolean => {
    if (hasPermission(['super_admin', 'admin'])) return true;
    if (profile?.role === 'kontributor' && user) {
      return canEditOwnContent(article.author_id) && article.status === 'draft';
    }
    return false;
  }, [hasPermission, profile?.role, user, canEditOwnContent]);

  const canDeleteArticle = useCallback((article: ArticleListItem): boolean => {
    if (hasPermission(['super_admin', 'admin'])) return true;
    if (profile?.role === 'kontributor' && user) {
      return canEditOwnContent(article.author_id) && article.status === 'draft';
    }
    return false;
  }, [hasPermission, profile?.role, user, canEditOwnContent]);

  // Create table configuration with callbacks (memoized)
  const tableConfig = useMemo(() => createArticlesConfig({
    canEditArticle,
    canDeleteArticle,
    canPublishArticles,
    onPublish: handlePublish,
    onUnpublish: handleUnpublish,
    onDelete: handleDelete,
  }), [canEditArticle, canDeleteArticle, canPublishArticles, handlePublish, handleUnpublish, handleDelete]);


  return (
    <div className="space-y-6">
      <AdminDataTable
        config={tableConfig}
        data={articles}
        createButton={{
          label: 'Add Article',
          href: '/admin/articles/new',
        }}
        header={{
          title: 'Articles',
          description: 'Manage articles and publications',
        }}
        isLoading={loading}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filters={
          <div className="flex flex-col md:flex-row gap-4">
            <select
              value={filters.status ?? 'all'}
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
              value={filters.category ?? 'all'}
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
