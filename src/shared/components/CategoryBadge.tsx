interface CategoryBadgeProps {
  category: string;
  colorClass?: string;
}

export function CategoryBadge({ category, colorClass = 'bg-blue-100 text-blue-800' }: CategoryBadgeProps) {
  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${colorClass}`}>
      {category}
    </span>
  );
}
