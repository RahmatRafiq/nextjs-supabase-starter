import { LeadershipGridSkeleton } from '@/shared/components/ui/PageSkeletons';

export default function LeadershipLoading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section Skeleton - Cinematic Style */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden bg-black">
        <div className="container-custom relative z-10 text-center">
          <div className="h-24 w-96 max-w-full bg-gray-800 rounded animate-pulse mx-auto mb-6" />
          <div className="h-8 w-128 max-w-2xl bg-gray-800 rounded animate-pulse mx-auto" />
        </div>
      </section>

      {/* Core Team Skeleton */}
      <section className="bg-black py-20 md:py-32">
        <div className="container-custom">
          <LeadershipGridSkeleton count={4} />
        </div>
      </section>

      {/* Division Leadership Skeleton */}
      <section className="bg-white py-20 md:py-32">
        <div className="container-custom space-y-24">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i}>
              {/* Division Header */}
              <div className="flex flex-col md:flex-row md:items-end justify-between border-b-4 border-black pb-6 mb-12">
                <div className="h-16 w-64 bg-gray-200 rounded animate-pulse mb-4 md:mb-0" />
                <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
              </div>

              {/* Division Members */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
                {Array.from({ length: 6 }).map((_, j) => (
                  <div key={j} className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-gray-200 rounded-full animate-pulse flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
                      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
