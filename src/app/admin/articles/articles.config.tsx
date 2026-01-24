import { AdminDataTableConfig } from '@/shared/components/datatables/types';
import { StatusBadge } from '@/shared/components/StatusBadge';
import { CategoryBadge } from '@/shared/components/CategoryBadge';
import { Edit, Trash2, Eye, CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface ArticleRow {
  id: string;
  title: string;
  slug: string;
  category: string;
  status: 'draft' | 'pending' | 'published' | 'archived';
  author: {
    name: string;
    email: string;
  };
  author_id: string;
  published_at: string;
}

interface ArticlesConfigOptions {
  canEditArticle: (article: ArticleRow) => boolean;
  canDeleteArticle: (article: ArticleRow) => boolean;
  canPublishArticles: () => boolean;
  onPublish: (id: string, title: string) => void;
  onUnpublish: (id: string, title: string) => void;
  onDelete: (id: string, title: string) => void;
}

export function createArticlesConfig(options: ArticlesConfigOptions): AdminDataTableConfig {
  return {
    tableName: 'articles',
    
    columns: [
      {
        data: 'title',
        title: 'Title',
        searchable: true,
        sortable: true,
        responsivePriority: 1,
        render: (data: unknown, _type: string, row: Record<string, unknown>) => {
          const title = String(data);
          const slug = String((row as unknown as ArticleRow).slug);
          return (
            <div>
              <div className="font-medium text-gray-900">{title}</div>
              <div className="text-sm text-gray-500">{slug}</div>
            </div>
          );
        },
      },
      {
        data: 'author.name',
        title: 'Author',
        searchable: true,
        sortable: true,
        render: (data: unknown) => {
          return <span className="text-gray-700">{String(data)}</span>;
        },
      },
      {
        data: 'category',
        title: 'Category',
        searchable: true,
        sortable: true,
        render: (data: unknown) => {
          return <CategoryBadge category={String(data)} />;
        },
      },
      {
        data: 'status',
        title: 'Status',
        searchable: true,
        sortable: true,
        render: (data: unknown) => {
          return <StatusBadge status={data as 'draft' | 'pending' | 'published' | 'archived'} />;
        },
      },
      {
        data: 'published_at',
        title: 'Date',
        searchable: false,
        sortable: true,
        render: (data: unknown) => {
          const date = new Date(String(data));
          return <span className="text-gray-700">{date.toLocaleDateString('id-ID')}</span>;
        },
      },
      {
        data: 'id',
        title: 'Actions',
        searchable: false,
        sortable: false,
        responsivePriority: 2,
        className: 'text-right',
        render: (_data: unknown, _type: string, row: Record<string, unknown>) => {
          const article = row as unknown as ArticleRow;
          
          return (
            <div className="flex items-center justify-end gap-2">
              {/* View published article */}
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

              {/* Publish button (for non-published articles) */}
              {article.status !== 'published' && options.canPublishArticles() && (
                <button
                  onClick={() => options.onPublish(article.id, article.title)}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  title="Publish"
                >
                  <CheckCircle className="w-4 h-4" />
                </button>
              )}

              {/* Unpublish button (for published articles) */}
              {article.status === 'published' && options.canPublishArticles() && (
                <button
                  onClick={() => options.onUnpublish(article.id, article.title)}
                  className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                  title="Unpublish"
                >
                  <CheckCircle className="w-4 h-4" />
                </button>
              )}

              {/* Edit button */}
              {options.canEditArticle(article) && (
                <Link
                  href={`/admin/articles/${article.id}`}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit"
                >
                  <Edit className="w-4 h-4" />
                </Link>
              )}

              {/* Delete button */}
              {options.canDeleteArticle(article) && (
                <button
                  onClick={() => options.onDelete(article.id, article.title)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          );
        },
      },
    ],

    // Search configuration
    search: {
      fields: ['title', 'author->>name'], // Search in title and nested author name
      placeholder: 'Search by title or author...',
      debounce: 300,
    },

    // Default sort by published date (descending)
    order: [[4, 'desc']], // Column index 4 is published_at

    // Items per page
    pageLength: 20,

    // Responsive mode with accordion
    responsive: {
      details: {
        type: 'column',
        target: 0, // First column (title) becomes expand button
      },
    },
  };
}
