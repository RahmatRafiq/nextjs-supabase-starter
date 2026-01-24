import { STATUS_COLORS } from '@/lib/constants/admin';

interface StatusBadgeProps {
  status: string;
  defaultColor?: keyof typeof STATUS_COLORS;
}

export function StatusBadge({ status, defaultColor = 'draft' }: StatusBadgeProps) {
  const colorClass = STATUS_COLORS[status as keyof typeof STATUS_COLORS] || STATUS_COLORS[defaultColor];

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${colorClass}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
