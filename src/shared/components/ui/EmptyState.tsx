/**
 * Reusable Empty State Component
 * Used when no data is available
 */

import { LucideIcon, FileText, Calendar, Users, User } from 'lucide-react';
import Link from 'next/link';

interface EmptyStateProps {
  icon?: LucideIcon;
  title?: string;
  message?: string;
  actionLabel?: string;
  actionHref?: string;
  variant?: 'articles' | 'events' | 'members' | 'leadership' | 'default';
}

const VARIANTS = {
  articles: {
    icon: FileText,
    title: 'No articles yet',
    message: 'Check back later for new articles and updates.',
  },
  events: {
    icon: Calendar,
    title: 'No events scheduled',
    message: 'There are no upcoming events at the moment.',
  },
  members: {
    icon: Users,
    title: 'No members found',
    message: 'No members match your current filters.',
  },
  leadership: {
    icon: User,
    title: 'No leadership data',
    message: 'Leadership information will be available soon.',
  },
  default: {
    icon: FileText,
    title: 'No data available',
    message: 'There is no content to display at this time.',
  },
};

export function EmptyState({
  icon,
  title,
  message,
  actionLabel,
  actionHref,
  variant = 'default',
}: EmptyStateProps) {
  const config = VARIANTS[variant];
  const Icon = icon || config.icon;
  const displayTitle = title || config.title;
  const displayMessage = message || config.message;

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] px-4 py-16">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
          <Icon className="w-8 h-8 text-gray-400" />
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {displayTitle}
        </h3>
        
        <p className="text-gray-600 mb-6">
          {displayMessage}
        </p>

        {actionLabel && actionHref && (
          <Link
            href={actionHref}
            className="inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
          >
            {actionLabel}
          </Link>
        )}
      </div>
    </div>
  );
}
