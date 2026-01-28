'use client';

import { useState, useMemo, useCallback } from 'react';
import { Modal } from '@/shared/components/ui/Modal';
import { Select } from '@/shared/components/ui/Select';
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

  // Action Logic
  const executePublish = async (id: string) => {
    try {
      const now = new Date().toISOString();
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
  };

  const executeUnpublish = async (id: string) => {
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
  };

  const executeDelete = async (id: string) => {
    try {
      const { error } = await supabase.from('articles').delete().eq('id', id);

      if (error) throw error;

      toast.success('Article deleted successfully');
      await refetch();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete article';
      toast.error(message);
    }
  };

  // Handlers triggering Modal
  const handlePublish = useCallback((id: string, title: string) => {
    if (!canPublishArticles()) {
      toast.error('You do not have permission to publish articles');
      return;
    }

    setConfirmState({
      isOpen: true,
      title: 'Publish Article',
      description: `Are you sure you want to publish "${title}"?`,
      variant: 'primary',
      isLoading: false,
      onConfirm: async () => await executePublish(id),
    });
  }, [canPublishArticles, refetch]);

  const handleUnpublish = useCallback((id: string, title: string) => {
    if (!canPublishArticles()) {
      toast.error('You do not have permission to unpublish articles');
      return;
    }

    setConfirmState({
      isOpen: true,
      title: 'Unpublish Article',
      description: `Unpublish "${title}"? It will be set to draft.`,
      variant: 'primary',
      isLoading: false,
      onConfirm: async () => await executeUnpublish(id),
    });
  }, [canPublishArticles, refetch]);

  const handleDelete = useCallback((id: string, title: string) => {
    setConfirmState({
      isOpen: true,
      title: 'Delete Article',
      description: `Are you sure you want to delete "${title}"? This action cannot be undone.`,
      variant: 'danger',
      isLoading: false,
      onConfirm: async () => await executeDelete(id),
    });
  }, [refetch]);

  // Handle actual confirmation click
  const onConfirmClick = async () => {
    setConfirmState(prev => ({ ...prev, isLoading: true }));
    await confirmState.onConfirm();
    setConfirmState(prev => ({ ...prev, isOpen: false, isLoading: false }));
  };

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
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <div className="w-full md:w-48">
              <Select
                value={filters.status ?? 'all'}
                onChange={(val) => setFilter('status', val)}
                options={[
                  { value: 'all', label: 'All Status' },
                  { value: 'draft', label: 'Draft' },
                  { value: 'pending', label: 'Pending' },
                  { value: 'published', label: 'Published' },
                  { value: 'archived', label: 'Archived' },
                ]}
              />
            </div>

            <div className="w-full md:w-48">
              <Select
                value={filters.category ?? 'all'}
                onChange={(val) => setFilter('category', val)}
                options={[
                  { value: 'all', label: 'All Categories' },
                  { value: 'post', label: 'Post' },
                  { value: 'blog', label: 'Blog' },
                  { value: 'opinion', label: 'Opinion' },
                  { value: 'publication', label: 'Publication' },
                  { value: 'info', label: 'Info' },
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
