'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Calendar, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Event as EventListItem } from '@/lib/api/events';
import { EVENT_CATEGORIES } from '@/config';

interface EventsGridProps {
  events: EventListItem[];
  statusColors: Record<string, string>;
  statusLabels: Record<string, string>;
}

export function EventsGrid({ events, statusColors, statusLabels }: EventsGridProps) {
  if (events.length === 0) {
    return (
      <div className="text-center py-32">
        <p className="text-gray-500 text-xl">Belum ada event tersedia</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {events.map((event, index) => (
        <motion.div
          key={event.id}
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{
            delay: index * 0.12,
            duration: 0.6,
            ease: [0.21, 0.47, 0.32, 0.98],
          }}
          whileHover={{
            y: -12,
            transition: { duration: 0.3 },
          }}
        >
          <Link
            href={`/events/${event.slug}`}
            className="group relative block"
          >
            {/* Glassmorphism container */}
            <div className="relative overflow-hidden rounded-3xl bg-white/40 backdrop-blur-sm hover:bg-white/60 transition-all duration-500 hover:shadow-2xl">
              {/* Image section */}
              <div className="relative aspect-[16/9] overflow-hidden">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  className="w-full h-full"
                >
                  <Image
                    src={event.coverImage}
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                </motion.div>

                {/* Badges */}
                <div className="absolute top-6 right-6 flex flex-col gap-2">
                  <motion.span
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.12 + 0.2 }}
                    whileHover={{ scale: 1.1 }}
                    className={`px-4 py-2 ${statusColors[event.status]} text-sm font-bold rounded-full shadow-lg`}
                  >
                    {statusLabels[event.status]}
                  </motion.span>
                  {event.featured && (
                    <motion.span
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.12 + 0.3 }}
                      whileHover={{ scale: 1.1 }}
                      className="px-4 py-2 bg-secondary-500 text-white text-sm font-bold rounded-full shadow-lg"
                    >
                      Featured
                    </motion.span>
                  )}
                </div>

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/50 to-transparent" />
              </div>

              {/* Content - overlapping image */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.12 + 0.4 }}
                className="relative -mt-20 p-8"
              >
                {/* Date badge - prominent */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="inline-flex items-center gap-3 px-6 py-3 bg-gray-900 text-white rounded-2xl mb-6 shadow-xl"
                >
                  <Calendar className="w-5 h-5" />
                  <time className="font-bold">
                    {format(new Date(event.startDate), 'd MMM yyyy', { locale: id })}
                  </time>
                </motion.div>

                {/* Category */}
                <div className="text-sm text-primary-600 font-bold mb-3">
                  {EVENT_CATEGORIES[event.category]}
                </div>

                {/* Title - large and bold */}
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 line-clamp-2 group-hover:text-primary-600 transition-colors">
                  {event.title}
                </h2>

                {/* Description */}
                <p className="text-gray-600 mb-6 line-clamp-2 text-base leading-relaxed">
                  {event.description}
                </p>

                {/* Location */}
                <motion.div
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-2 text-gray-700 mb-4"
                >
                  <MapPin className="w-5 h-5 text-primary-600" />
                  <span className="font-medium line-clamp-1">{event.location.name}</span>
                </motion.div>

                {/* Read more indicator */}
                <motion.div
                  className="flex items-center gap-2 text-gray-900 font-semibold"
                  animate={{ x: [0, 4, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  Lihat Detail
                  <motion.svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    className="w-5 h-5"
                  >
                    <path
                      d="M7.5 15L12.5 10L7.5 5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </motion.svg>
                </motion.div>
              </motion.div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
