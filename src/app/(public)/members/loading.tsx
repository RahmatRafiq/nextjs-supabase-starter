import { HeroSkeleton, MemberGridSkeleton } from '@/shared/components/ui/PageSkeletons';

export default function MembersLoading() {
  return (
    <div className="min-h-screen bg-white">
      <HeroSkeleton />

      {/* Batch Filter Skeleton */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-custom py-6">
          <div className="flex gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-10 w-28 bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </div>

      {/* Count Display Skeleton */}
      <section className="container-custom py-16">
        <div className="mb-12">
          <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
        </div>

        {/* Members Grid */}
        <MemberGridSkeleton count={12} />
      </section>
    </div>
  );
}
