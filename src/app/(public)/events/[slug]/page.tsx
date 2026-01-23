import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getEventBySlug, getEventsByCategory } from '@/lib/api/events';
import { EVENT_CATEGORIES } from '@/config';
import { EVENT_STATUS_COLORS, EVENT_STATUS_LABELS } from '@/lib/constants/event';
import { MarkdownContent } from '@/shared/components/ui/MarkdownContent';
import { Calendar, MapPin, Users, ArrowLeft, ExternalLink, Clock, User } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const event = await getEventBySlug(params.slug);

  if (!event) {
    return {
      title: 'Event Tidak Ditemukan',
    };
  }

  return {
    title: `${event.title} - HMJF UIN Alauddin`,
    description: event.description,
  };
}

export default async function EventDetailPage({ params }: Props) {
  const event = await getEventBySlug(params.slug);

  if (!event) {
    notFound();
  }

  const relatedEvents = await getEventsByCategory(event.category);
  const filteredRelated = relatedEvents.filter((e) => e.id !== event.id).slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b">
        <div className="container-custom py-4">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Event
          </Link>
        </div>
      </div>

      {/* Event Header */}
      <div className="bg-white">
        <div className="container-custom py-12">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                {/* Status & Category */}
                <div className="flex items-center gap-2 mb-4">
                  <span className={`px-4 py-2 ${EVENT_STATUS_COLORS[event.status]} font-medium rounded-lg`}>
                    {EVENT_STATUS_LABELS[event.status]}
                  </span>
                  <span className="px-4 py-2 bg-primary-100 text-primary-700 font-medium rounded-lg">
                    {EVENT_CATEGORIES[event.category]}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">{event.title}</h1>

                {/* Cover Image */}
                <div className="relative w-full h-[400px] rounded-2xl overflow-hidden mb-8">
                  <Image src={event.coverImage} alt={event.title} fill className="object-cover" priority />
                </div>

                {/* Description */}
                <div className="mb-8">
                  <p className="text-xl text-gray-700 mb-6">{event.description}</p>
                  <MarkdownContent content={event.content} />
                </div>

                {/* Additional Images */}
                {event.images && event.images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                    {event.images.map((img, idx) => (
                      <div key={idx} className="relative h-48 rounded-lg overflow-hidden">
                        <Image src={img} alt={`${event.title} ${idx + 1}`} fill className="object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-gray-50 rounded-2xl p-6 sticky top-24">
                  <h3 className="font-bold text-lg mb-4">Informasi Event</h3>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-primary-600 mt-1" />
                      <div>
                        <p className="text-sm text-gray-500">Tanggal</p>
                        <p className="font-medium">{format(new Date(event.startDate), 'd MMMM yyyy', { locale: id })}</p>
                        {event.startDate !== event.endDate && (
                          <p className="text-sm text-gray-600">s/d {format(new Date(event.endDate), 'd MMMM yyyy', { locale: id })}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-primary-600 mt-1" />
                      <div>
                        <p className="text-sm text-gray-500">Lokasi</p>
                        <p className="font-medium">{event.location.name}</p>
                        <p className="text-sm text-gray-600">{event.location.address}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <User className="w-5 h-5 text-primary-600 mt-1" />
                      <div>
                        <p className="text-sm text-gray-500">Penyelenggara</p>
                        <p className="font-medium">{event.organizer.name}</p>
                        <p className="text-sm text-gray-600">{event.organizer.contact}</p>
                      </div>
                    </div>

                    {event.maxParticipants && (
                      <div className="flex items-start gap-3">
                        <Users className="w-5 h-5 text-primary-600 mt-1" />
                        <div>
                          <p className="text-sm text-gray-500">Peserta</p>
                          <p className="font-medium">{event.currentParticipants || 0} / {event.maxParticipants}</p>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div
                              className="bg-primary-600 h-2 rounded-full"
                              style={{ width: `${((event.currentParticipants || 0) / event.maxParticipants) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {event.registrationDeadline && new Date(event.registrationDeadline) > new Date() && (
                      <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 text-primary-600 mt-1" />
                        <div>
                          <p className="text-sm text-gray-500">Batas Pendaftaran</p>
                          <p className="font-medium">{format(new Date(event.registrationDeadline), 'd MMMM yyyy', { locale: id })}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {event.registrationUrl && event.status === 'upcoming' && (
                    <Link
                      href={event.registrationUrl}
                      target="_blank"
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      Daftar Sekarang
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  )}

                  {event.status === 'completed' && (
                    <div className="w-full px-6 py-3 bg-gray-200 text-gray-600 text-center font-medium rounded-lg">
                      Event Telah Selesai
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Events */}
      {filteredRelated.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="container-custom">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Event Terkait</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filteredRelated.map((related) => (
                  <Link key={related.id} href={`/events/${related.slug}`} className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all">
                    <div className="relative h-40 overflow-hidden">
                      <Image src={related.coverImage} alt={related.title} fill className="object-cover group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div className="p-4">
                      <p className="text-xs text-primary-600 font-medium mb-2">{EVENT_CATEGORIES[related.category]}</p>
                      <h3 className="font-bold text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors">{related.title}</h3>
                      <p className="text-sm text-gray-600 mt-2 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(related.startDate), 'd MMM yyyy', { locale: id })}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
