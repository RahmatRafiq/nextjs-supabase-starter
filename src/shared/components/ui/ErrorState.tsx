/**
 * Reusable Error State Component
 * Used when data fetching or operations fail
 */

import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  error?: Error;
  onRetry?: () => void;
  showDetails?: boolean;
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'An error occurred while loading this content.',
  error,
  onRetry,
  showDetails = false,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] px-4">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {title}
        </h2>
        
        <p className="text-gray-600 mb-6">
          {error?.message || message}
        </p>

        {showDetails && error && (
          <details className="text-left mb-6 p-4 bg-gray-50 rounded-lg">
            <summary className="cursor-pointer text-sm font-medium text-gray-700 mb-2">
              Error Details
            </summary>
            <pre className="text-xs text-gray-600 overflow-auto">
              {error.stack || error.message}
            </pre>
          </details>
        )}

        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}
