'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Calendar, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { useEffect, useState } from 'react';
import type { EventListItem } from '@/core/entities/Event';

export function EventsPreview() {
  const [events, setEvents] = useState<EventListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events/upcoming');
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error('Failed to fetch events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <section className="relative py-32 overflow-hidden bg-white">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50/30 via-transparent to-secondary-50/30" />

      <div className="container-custom relative z-10">
        {/* Header - Large bold text */}
        <div className="max-w-4xl mb-16">
          <h2 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Event <br />
            <span className="text-primary-600">Mendatang</span>
          </h2>
          <div className="flex items-center justify-between">
            <p className="text-xl text-gray-600">Jangan lewatkan kegiatan seru dari HMJF</p>
            <Link
              href="/events"
              className="hidden md:inline-flex items-center gap-2 text-gray-900 font-semibold hover:gap-3 transition-all"
            >
              Lihat Semua
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-24 text-gray-500 text-xl">
            Belum ada event mendatang
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {events.map((event) => (
              <Link
                key={event.id}
                href={`/events/${event.slug}`}
                className="group relative"
              >
                {/* Glassmorphism container */}
                <div className="relative overflow-hidden rounded-3xl bg-white/40 backdrop-blur-sm hover:bg-white/60 transition-all duration-500">
                  {/* Image section */}
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      src={event.coverImage}
                      alt={event.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    {event.featured && (
                      <div className="absolute top-6 right-6">
                        <span className="px-4 py-2 bg-secondary-500 text-white text-sm font-bold rounded-full shadow-lg">
                          Featured
                        </span>
                      </div>
                    )}
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/50 to-transparent" />
                  </div>

                  {/* Content - overlapping image */}
                  <div className="relative -mt-20 p-8">
                    {/* Date badge - prominent */}
                    <div className="inline-flex items-center gap-3 px-6 py-3 bg-gray-900 text-white rounded-2xl mb-6 shadow-xl">
                      <Calendar className="w-5 h-5" />
                      <time className="font-bold">
                        {format(new Date(event.startDate), 'd MMMM yyyy', { locale: id })}
                      </time>
                    </div>

                    {/* Title - large and bold */}
                    <h3 className="text-3xl font-bold text-gray-900 mb-4 line-clamp-2 group-hover:text-primary-600 transition-colors">
                      {event.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 mb-6 line-clamp-2 text-lg leading-relaxed">
                      {event.description}
                    </p>

                    {/* Location */}
                    <div className="flex items-center gap-2 text-gray-700">
                      <MapPin className="w-5 h-5 text-primary-600" />
                      <span className="font-medium line-clamp-1">{event.location.name}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Mobile CTA */}
        <div className="text-center mt-12 md:hidden">
          <Link
            href="/events"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gray-900 text-white font-medium rounded-full hover:bg-primary-600 transition-colors"
          >
            Lihat Semua Event
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
