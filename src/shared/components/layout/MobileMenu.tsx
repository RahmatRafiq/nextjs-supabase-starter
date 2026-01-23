'use client';

/**
 * MobileMenu Component
 * Modern off-canvas mobile navigation (slides from right)
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ROUTES, SITE_CONFIG } from '@/config';
import { cn } from '@/shared/utils/cn';
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Info, FileText, Calendar, Users, UserCircle, X } from 'lucide-react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { label: 'Beranda', href: ROUTES.home, icon: Home },
  { label: 'Tentang', href: ROUTES.about, icon: Info },
  { label: 'Artikel', href: ROUTES.articles, icon: FileText },
  { label: 'Event', href: ROUTES.events, icon: Calendar },
  { label: 'Kepengurusan', href: ROUTES.leadership, icon: Users },
  { label: 'Anggota', href: ROUTES.members, icon: UserCircle },
];

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const pathname = usePathname();

  // Close menu on route change
  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99] md:hidden"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Off-canvas Menu Panel - Slides from right */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-white z-[100] md:hidden shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h2 className="font-bold text-lg text-gray-900">{SITE_CONFIG.name}</h2>
                <p className="text-xs text-gray-500 mt-0.5">UIN Alauddin Makassar</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex flex-col p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-88px)]">
              {navItems.map((item, index) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-medium transition-all',
                        isActive
                          ? 'bg-gradient-to-r from-primary-50 to-primary-100/50 text-primary-700 shadow-sm'
                          : 'text-gray-700 hover:bg-gray-50 active:bg-gray-100'
                      )}
                    >
                      <Icon className={cn('w-5 h-5', isActive ? 'text-primary-600' : 'text-gray-400')} />
                      <span>{item.label}</span>
                      {isActive && (
                        <motion.div
                          layoutId="activeMobile"
                          className="ml-auto w-1.5 h-1.5 bg-primary-600 rounded-full"
                        />
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            {/* Footer Info */}
            <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-100 bg-gray-50">
              <p className="text-xs text-gray-500 text-center leading-relaxed">
                Himpunan Mahasiswa Jurusan Farmasi
                <br />
                UIN Alauddin Makassar
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
