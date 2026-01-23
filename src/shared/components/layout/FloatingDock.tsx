'use client';

/**
 * FloatingDock Component
 * "Liquid Glass" navigation pill that floats at the bottom of the screen.
 * Replaces the traditional top navbar.
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ROUTES } from '@/config';
import { cn } from '@/shared/utils/cn';
import { motion } from 'framer-motion';
import { Home, Info, Users, Mic, Calendar, UserCircle } from 'lucide-react';

const NAV_ITEMS = [
    { label: 'Home', href: ROUTES.home, icon: Home },
    { label: 'About', href: ROUTES.about, icon: Info },
    { label: 'Events', href: ROUTES.events, icon: Calendar },
    { label: 'Articles', href: ROUTES.articles, icon: Mic },
    { label: 'Leadership', href: ROUTES.leadership, icon: Users },
    { label: 'Members', href: ROUTES.members, icon: UserCircle },
];

export function FloatingDock() {
    const pathname = usePathname();

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[999] md:bottom-auto md:top-8">
            <div className="relative group">
                {/* Liquid Glass Container */}
                <div
                    className={cn(
                        "flex items-center gap-1 md:gap-2 px-2 py-2 md:px-3 md:py-2.5",
                        "bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl",
                        "rounded-full transition-all duration-300",
                        "hover:bg-white/20 hover:scale-[1.02] hover:border-white/30"
                    )}
                    style={{
                        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
                    }}
                >
                    {NAV_ITEMS.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="relative"
                            >
                                <div
                                    className={cn(
                                        "relative flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full transition-all duration-300",
                                        "hover:bg-white/20",
                                        isActive && "text-white"
                                    )}
                                >
                                    {/* Active Background Pill */}
                                    {isActive && (
                                        <motion.div
                                            layoutId="active-pill"
                                            className="absolute inset-0 bg-primary-600 rounded-full shadow-[0_0_20px_rgba(22,163,74,0.5)]"
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        />
                                    )}

                                    {/* Icon */}
                                    <div className={cn(
                                        "relative z-10 flex items-center justify-center transition-colors duration-200",
                                        isActive ? "text-white" : "text-gray-600 group-hover:text-gray-800"
                                    )}>
                                        <Icon className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2} />
                                    </div>

                                    {/* Tooltip (Desktop) */}
                                    <div className={cn(
                                        "absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/80 text-white text-[10px] rounded opacity-0 transition-opacity pointer-events-none whitespace-nowrap backdrop-blur-sm",
                                        "md:top-full md:mt-2 md:-top-auto", // Position below on desktop
                                        "group-hover:opacity-100 hidden md:block" // Only show on desktop hover
                                    )}>
                                        {item.label}
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
