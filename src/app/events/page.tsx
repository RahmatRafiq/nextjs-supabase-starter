import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { JsonEventRepository } from '@/infrastructure/repositories/JsonEventRepository';
import { EVENT_CATEGORIES } from '@/lib/constants';
import { Calendar, MapPin, Users, ArrowRight, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export const metadata: Metadata = {
  title: 'Event - HMJF UIN Alauddin',
  description: 'Daftar event dan kegiatan dari Himpunan Mahasiswa Jurusan Farmasi UIN Alauddin Makassar',
};

const statusColors = {
  upcoming: 'bg-blue-100 text-blue-700',
  ongoing: 'bg-green-100 text-green-700',
  completed: 'bg-gray-100 text-gray-700',
  cancelled: 'bg-red-100 text-red-700',
};

const statusLabels = {
  upcoming: 'Akan Datang',
  ongoing: 'Berlangsung',
  completed: 'Selesai',
  cancelled: 'Dibatalkan',
};

export default async function EventsPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const eventRepo = new JsonEventRepository();
  const status = searchParams.status;

  const events = status
    ? await eventRepo.getByStatus(status as any)
    : await eventRepo.getAll();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Bold & Minimal */}
      <section className="relative bg-gray-900 text-white py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/50 to-gray-900" />
        <div className="container-custom relative z-10">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
            Event
          </h1>
          <p className="text-2xl text-gray-300 max-w-3xl leading-relaxed">
            Kegiatan dan acara terkini dari HMJF UIN Alauddin Makassar
          </p>
        </div>
      </section>

      {/* Status Filter - Floating Pills */}
      <section className="sticky top-16 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="container-custom py-6">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <Link
              href="/events"
              className={`px-6 py-3 rounded-full font-semibold whitespace-nowrap transition-all ${
                !status
                  ? 'bg-gray-900 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Semua Event
            </Link>
            <Link
              href="/events?status=upcoming"
              className={`px-6 py-3 rounded-full font-semibold whitespace-nowrap transition-all ${
                status === 'upcoming'
                  ? 'bg-gray-900 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Akan Datang
            </Link>
            <Link
              href="/events?status=completed"
              className={`px-6 py-3 rounded-full font-semibold whitespace-nowrap transition-all ${
                status === 'completed'
                  ? 'bg-gray-900 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Selesai
            </Link>
          </div>
        </div>
      </section>

      {/* Events Grid - Modern Layout */}
      <section className="container-custom py-16">
        {events.length === 0 ? (
          <div className="text-center py-32">
            <p className="text-gray-500 text-xl">Belum ada event tersedia</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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

                    {/* Badges */}
                    <div className="absolute top-6 right-6 flex flex-col gap-2">
                      <span className={`px-4 py-2 ${statusColors[event.status]} text-sm font-bold rounded-full shadow-lg`}>
                        {statusLabels[event.status]}
                      </span>
                      {event.featured && (
                        <span className="px-4 py-2 bg-secondary-500 text-white text-sm font-bold rounded-full shadow-lg">
                          Featured
                        </span>
                      )}
                    </div>

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/50 to-transparent" />
                  </div>

                  {/* Content - overlapping image */}
                  <div className="relative -mt-20 p-8">
                    {/* Date badge - prominent */}
                    <div className="inline-flex items-center gap-3 px-6 py-3 bg-gray-900 text-white rounded-2xl mb-6 shadow-xl">
                      <Calendar className="w-5 h-5" />
                      <time className="font-bold">
                        {format(new Date(event.startDate), 'd MMM yyyy', { locale: id })}
                      </time>
                    </div>

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
                    <div className="flex items-center gap-2 text-gray-700 mb-4">
                      <MapPin className="w-5 h-5 text-primary-600" />
                      <span className="font-medium line-clamp-1">{event.location.name}</span>
                    </div>

                    {/* Read more indicator */}
                    <div className="flex items-center gap-2 text-gray-900 font-semibold group-hover:gap-3 transition-all">
                      Lihat Detail
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
