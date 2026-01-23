'use client';

/**
 * Navigation Component
 * Modern desktop navigation with smooth animations
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ROUTES } from '@/config';
import { cn } from '@/shared/utils/cn';
import { motion } from 'framer-motion';

const navItems = [
  { label: 'Beranda', href: ROUTES.home },
  { label: 'Tentang', href: ROUTES.about },
  { label: 'Artikel', href: ROUTES.articles },
  { label: 'Event', href: ROUTES.events },
  { label: 'Kepengurusan', href: ROUTES.leadership },
  { label: 'Anggota', href: ROUTES.members },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-2">
      {navItems.map((item) => {
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className="relative px-4 py-2 group"
          >
            <span
              className={cn(
                'relative z-10 text-sm font-medium transition-colors duration-200',
                isActive
                  ? 'text-primary-700'
                  : 'text-gray-700 group-hover:text-primary-600'
              )}
            >
              {item.label}
            </span>

            {/* Active indicator */}
            {isActive && (
              <motion.div
                layoutId="activeNav"
                className="absolute inset-0 bg-primary-50 rounded-xl"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}

            {/* Hover background */}
            <div
              className={cn(
                'absolute inset-0 bg-gray-100 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200',
                isActive && 'opacity-0 group-hover:opacity-0'
              )}
            />

            {/* Active dot indicator */}
            {isActive && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-primary-600 rounded-full"
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
