import { HeroSkeleton, ArticleGridSkeleton } from '@/shared/components/ui/PageSkeletons';

export default function ArticlesLoading() {
  return (
    <div className="min-h-screen bg-white">
      <HeroSkeleton />

      {/* Category Filter Skeleton */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-custom py-6">
          <div className="flex gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <section className="container-custom py-16">
        <ArticleGridSkeleton count={6} />
      </section>
    </div>
  );
}
