import { HeroSkeleton, EventGridSkeleton } from '@/shared/components/ui/PageSkeletons';

export default function EventsLoading() {
  return (
    <div className="min-h-screen bg-white">
      <HeroSkeleton />

      {/* Status Filter Skeleton */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-custom py-6">
          <div className="flex gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <section className="container-custom py-16">
        <EventGridSkeleton count={6} />
      </section>
    </div>
  );
}
