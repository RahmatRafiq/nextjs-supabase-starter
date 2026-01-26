import { ArticleDetailSkeleton } from '@/shared/components/ui/PageSkeletons';

export default function ArticleDetailLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button Skeleton */}
      <div className="bg-white border-b">
        <div className="container-custom py-4">
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>

      {/* Article Detail */}
      <div className="bg-white">
        <ArticleDetailSkeleton />
      </div>

      {/* Related Articles Skeleton */}
      <section className="bg-gray-50 py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm">
                  <div className="h-40 bg-gray-200 animate-pulse" />
                  <div className="p-4 space-y-2">
                    <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
                    <div className="h-3 w-32 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
