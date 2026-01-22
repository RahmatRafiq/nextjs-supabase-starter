/**
 * Event types
 * Used in admin panel and public pages
 */

export interface Event {
  id: string;
  title: string;
  slug: string;
  description: string;
  cover_image: string | null;
  location: string;
  event_date: string;
  start_time: string | null;
  end_time: string | null;
  registration_link: string | null;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  max_participants: number | null;
  current_participants: number;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
}
