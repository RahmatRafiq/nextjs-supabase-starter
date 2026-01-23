import { Metadata } from 'next';
import { z } from 'zod';
import { getPaginatedArticles, ArticleCategory } from '@/lib/api/articles';
import { ARTICLE_CATEGORIES } from '@/config';
import { ArticlesGrid } from '@/features/articles/components/ArticlesGrid';
import { SegmentedControl } from '@/shared/components/ui/SegmentedControl';
import { Pagination } from '@/shared/components/ui/Pagination';

// Zod schema for validating article category query parameter
const ArticleCategorySchema = z.enum(['post', 'blog', 'opinion', 'publication', 'info']);

const ITEMS_PER_PAGE = 12;

export const metadata: Metadata = {
  title: 'Artikel - HMJF UIN Alauddin',
  description: 'Kumpulan artikel, blog, opini, publikasi, dan informasi dari Himpunan Mahasiswa Jurusan Farmasi UIN Alauddin Makassar',
};

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: { category?: string; page?: string };
}) {
  // Validate and sanitize category parameter
  let validatedCategory: ArticleCategory | undefined;
  if (searchParams.category) {
    const validation = ArticleCategorySchema.safeParse(searchParams.category);
    if (validation.success) {
      validatedCategory = validation.data;
    }
  }

  // Validate page parameter
  const currentPage = Math.max(1, parseInt(searchParams.page ?? '1', 10) || 1);

  // Fetch paginated articles
  const result = await getPaginatedArticles(currentPage, ITEMS_PER_PAGE, validatedCategory);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Bold & Minimal */}
      <section className="relative bg-gray-900 text-white py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/50 to-gray-900" />
        <div className="container-custom relative z-10">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
            Artikel
          </h1>
          <p className="text-2xl text-gray-300 max-w-3xl leading-relaxed">
            Kumpulan artikel, blog, opini, publikasi ilmiah, dan informasi terkini dari HMJF
          </p>
        </div>
      </section>

      {/* Category Filter - Segmented Control */}
      <SegmentedControl
        basePath="/articles"
        paramName="category"
        currentValue={validatedCategory}
        allLabel="Semua"
        options={Object.entries(ARTICLE_CATEGORIES).map(([value, label]) => ({
          value,
          label,
        }))}
      />

      {/* Articles Masonry Grid - Animated */}
      <section className="container-custom py-16">
        {/* Results Count */}
        <p className="text-gray-600 mb-8">
          Menampilkan {result.items.length} dari {result.totalCount} artikel
        </p>

        <ArticlesGrid articles={result.items} />

        {/* Pagination */}
        <Pagination
          currentPage={result.currentPage}
          totalPages={result.totalPages}
          basePath="/articles"
          searchParams={{ category: validatedCategory }}
        />
      </section>
    </div>
  );
}
