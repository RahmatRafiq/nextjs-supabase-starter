'use client';

import { ErrorState } from '@/shared/components/ui/ErrorState';

export default function EventsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-white">
      <ErrorState
        title="Failed to load events"
        message="We couldn't load the events. Please try again."
        error={error}
        onRetry={reset}
        showDetails={process.env.NODE_ENV === 'development'}
      />
    </div>
  );
}
