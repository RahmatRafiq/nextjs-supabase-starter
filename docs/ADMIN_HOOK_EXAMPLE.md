# useAdminTable Hook - Usage Example

## Before (Old Pattern - ~170 lines)

```typescript
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/lib/auth/AuthContext';
import { toast } from 'sonner';

export default function ArticlesPage() {
  const { user, profile } = useAuth();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // ~100 lines of fetch logic with filters, debounce, pagination
  useEffect(() => {
    if (!profile) return;
    const timer = setTimeout(() => {
      fetchArticles();
    }, searchQuery ? 300 : 0);
    return () => clearTimeout(timer);
  }, [searchQuery, statusFilter, categoryFilter, currentPage, profile?.id]);

  async function fetchArticles() {
    try {
      setLoading(true);
      let query = supabase
        .from('articles')
        .select('*', { count: 'exact' })
        .order('published_at', { ascending: false });

      if (profile?.role === 'kontributor') {
        query = query.eq('author_id', user.id);
      }

      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%`);
      }

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      if (categoryFilter !== 'all') {
        query = query.eq('category', categoryFilter);
      }

      const from = (currentPage - 1) * 20;
      const to = from + 19;
      query = query.range(from, to);

      const { data, error, count } = await query;
      if (error) throw error;

      setArticles(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      toast.error('Failed to load');
    } finally {
      setLoading(false);
    }
  }

  // ~30 lines of delete logic
  async function handleDelete(id: string) {
    try {
      await supabase.from('articles').delete().eq('id', id);
      toast.success('Deleted');
      fetchArticles();
    } catch (error) {
      toast.error('Failed to delete');
    }
  }

  return (
    // JSX with table, filters, pagination...
  );
}
```

## After (With Hook - ~70 lines)

```typescript
'use client';

import { useAdminTable } from '@/shared/hooks/useAdminTable';
import { useAuth } from '@/lib/auth/AuthContext';

interface ArticleListItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  status: string;
  author: { name: string };
  published_at: string;
}

export default function ArticlesPage() {
  const { canPublishArticles } = useAuth();

  // All common logic handled by hook ✅
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
    selectColumns: 'id, title, slug, category, status, author, published_at',
    sortColumn: 'published_at',
    sortAscending: false,
    itemsPerPage: 20,
    filterByAuthor: true, // Kontributor sees only their articles
    searchColumns: ['title', 'author->>name'], // Search in title and author name
  });

  // Custom actions (publish/unpublish) stay here
  async function handlePublish(id: string) {
    // ... publish logic
    await refetch(); // Use refetch from hook
  }

  return (
    <div>
      {/* Search */}
      <input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search..."
      />

      {/* Filters */}
      <select value={filters.status} onChange={(e) => setFilter('status', e.target.value)}>
        <option value="all">All Status</option>
        <option value="draft">Draft</option>
        <option value="published">Published</option>
      </select>

      <select value={filters.category} onChange={(e) => setFilter('category', e.target.value)}>
        <option value="all">All Categories</option>
        <option value="blog">Blog</option>
        <option value="news">News</option>
      </select>

      {/* Table */}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table>
          <tbody>
            {articles.map((article) => (
              <tr key={article.id}>
                <td>{article.title}</td>
                <td>{article.status}</td>
                <td>
                  <button onClick={() => deleteItem(article.id)}>Delete</button>
                  {canPublishArticles() && (
                    <button onClick={() => handlePublish(article.id)}>Publish</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Pagination */}
      <div>
        Page {currentPage} of {totalPages}
        <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
          Previous
        </button>
        <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}
```

## Benefits

1. **~100 lines less code** per admin page
2. **Consistent behavior** across all CRUD pages
3. **No more bugs** from copy-paste mistakes
4. **Easy to maintain** - fix once, applies everywhere
5. **Type-safe** - Full TypeScript support
6. **Flexible** - Custom filters via `customFilter` option

## Hook Features

✅ Automatic data fetching with dependencies
✅ Search with 300ms debounce
✅ Multiple filters (status, category, custom)
✅ Pagination (page, items per page, total)
✅ Role-based filtering (kontributor sees only their data)
✅ Delete with confirmation
✅ Optimistic updates
✅ Error handling with toast
✅ Refetch method for custom actions

## Advanced Usage

### Custom Filter Function

```typescript
const { items } = useAdminTable({
  tableName: 'articles',
  selectColumns: 'id, title, status',
  customFilter: (query, filters) => {
    // Custom filter logic
    if (filters.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }
    if (filters.dateRange) {
      query = query.gte('created_at', filters.dateRange.start);
      query = query.lte('created_at', filters.dateRange.end);
    }
    return query;
  },
});
```

### Multiple Tables

Easy to use for events, members, leadership, etc:

```typescript
// Events page
const { items: events } = useAdminTable({
  tableName: 'events',
  selectColumns: 'id, title, date, status',
  sortColumn: 'date',
});

// Members page
const { items: members } = useAdminTable({
  tableName: 'members',
  selectColumns: 'id, name, division, status',
  sortColumn: 'name',
  sortAscending: true,
});
```

## Migration Guide

1. Import the hook: `import { useAdminTable } from '@/shared/hooks/useAdminTable'`
2. Remove state declarations (articles, loading, search, filters, page, count)
3. Remove useEffect and fetchArticles function
4. Call useAdminTable with config
5. Update JSX to use returned values
6. Keep custom actions (publish, archive, etc.) in the component
