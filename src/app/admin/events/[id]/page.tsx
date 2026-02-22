'use client';

import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { useAdminForm } from '@/shared/hooks/useAdminForm';
import { RichTextEditor } from '@/shared/components/RichTextEditor';
import { FormInput } from '@/shared/components/FormInput';
import { FormSelect } from '@/shared/components/FormSelect';
import { FormCheckbox } from '@/shared/components/FormCheckbox';
import { FormActions } from '@/shared/components/FormActions';
import { FormField } from '@/shared/components/FormField';
import { CreateableSelect } from '@/shared/components/ui/CreateableSelect';
import { generateSlug } from '@/lib/utils/slug';
import { EventFormData } from '@/types/forms';
import { EventLocation, EventOrganizer } from '@/types/event';
import { EventStatus } from '@/lib/constants/admin';

const CATEGORIES = [
  { value: 'seminar', label: 'Seminar' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'community-service', label: 'Community Service' },
  { value: 'competition', label: 'Competition' },
  { value: 'training', label: 'Training' },
  { value: 'other', label: 'Other' },
];

const STATUSES = [
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'ongoing', label: 'Ongoing' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

const LOCATION_TYPES = [
  { value: 'offline', label: 'Offline' },
  { value: 'online', label: 'Online' },
  { value: 'hybrid', label: 'Hybrid' },
];

// Convert ISO datetime to datetime-local format (yyyy-MM-ddThh:mm)
function toDatetimeLocal(isoString: string | null | undefined): string {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export default function EventFormPage() {
  const params = useParams();
  const id = params.id as string;

  const {
    formData,
    setFormData,
    loading,
    fetching,
    isCreateMode,
    handleSubmit,
  } = useAdminForm<EventFormData>({
    tableName: 'events',
    id,
    initialData: {
      title: '',
      slug: '',
      description: '',
      content: '',
      category: 'seminar',
      status: 'upcoming',
      start_date: '',
      end_date: '',
      location_type: 'offline',
      location_address: '',
      cover_image: '',
      organizer_name: '',
      registration_url: '',
      registration_deadline: '',
      max_participants: '',
      tags: '',
      featured: false,
      location: '',
      location_maps_url: '',
      organizer_contact: '',
    },
    redirectPath: '/admin/events',
    onBeforeSave: (data) => {
      const location: EventLocation = {
        type: data.location_type as EventLocation['type'],
        address: data.location_address,
      };

      const organizer: EventOrganizer = {
        name: data.organizer_name,
      };

      return {
        title: data.title,
        slug: data.slug,
        description: data.description,
        content: data.content,
        category: data.category,
        status: data.status,
        start_date: new Date(data.start_date).toISOString(),
        end_date: new Date(data.end_date).toISOString(),
        location,
        cover_image: data.cover_image || null,
        organizer,
        registration_url: data.registration_url || null,
        registration_deadline: data.registration_deadline
          ? new Date(data.registration_deadline).toISOString()
          : null,
        max_participants: data.max_participants ? parseInt(data.max_participants) : null,
        tags: Array.isArray(data.tags)
          ? data.tags
          : data.tags
            ? String(data.tags).split(',').map((t) => t.trim())
            : null,
        featured: data.featured,
        current_participants: 0,
      };
    },
  });

  // Convert datetime fields when data is loaded from database
  useEffect(() => {
    if (!fetching && !isCreateMode && formData.start_date) {
      // Check if dates need conversion (they're in ISO format from DB)
      if (formData.start_date.includes('T') && formData.start_date.length > 16) {
        setFormData((prev) => ({
          ...prev,
          start_date: toDatetimeLocal(prev.start_date),
          end_date: toDatetimeLocal(prev.end_date),
          registration_deadline: toDatetimeLocal(prev.registration_deadline),
        }));
      }
    }
  }, [fetching, isCreateMode, formData.start_date]);

  function handleTitleChange(value: string) {
    setFormData({
      ...formData,
      title: value,
      slug: generateSlug(value),
    });
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {isCreateMode ? 'Create Event' : 'Edit Event'}
        </h1>
        <p className="text-gray-600 mt-1">
          {isCreateMode ? 'Add a new event or activity' : 'Update event information'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="space-y-6">
          <FormInput
            label="Title"
            id="title"
            value={formData.title}
            onChange={handleTitleChange}
            required
          />

          <FormInput
            label="Slug"
            id="slug"
            value={formData.slug}
            onChange={(value) => setFormData({ ...formData, slug: value })}
            required
            placeholder="Auto-generated from title. Used in URL."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormSelect
              label="Category"
              id="category"
              value={formData.category}
              onChange={(value) => setFormData({ ...formData, category: value as EventFormData['category'] })}
              options={CATEGORIES}
              required
            />

            <FormSelect
              label="Status"
              id="status"
              value={formData.status}
              onChange={(value) => setFormData({ ...formData, status: value as EventStatus })}
              options={STATUSES}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Start Date"
              id="start_date"
              type="datetime-local"
              value={formData.start_date}
              onChange={(value) => setFormData({ ...formData, start_date: value })}
              required
            />

            <FormInput
              label="End Date"
              id="end_date"
              type="datetime-local"
              value={formData.end_date}
              onChange={(value) => setFormData({ ...formData, end_date: value })}
              required
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="text-sm font-medium text-gray-900 mb-4">Event Location & Access</h3>
            <div className="grid grid-cols-1 gap-4">
              <FormSelect
                label="Location Type"
                id="location_type"
                value={formData.location_type}
                onChange={(value) => setFormData({ ...formData, location_type: value })}
                options={LOCATION_TYPES}
                required
              />

              <FormInput
                label={formData.location_type === 'online' ? 'Meeting URL' : 'Venue Address'}
                id="location_address"
                value={formData.location_address || ''}
                onChange={(value) => setFormData({ ...formData, location_address: value })}
                required
                placeholder={formData.location_type === 'online' ? 'https://zoom.us/...' : 'Full address of the venue'}
              />

              {formData.location_type !== 'online' && (
                <FormInput
                  label="Google Maps URL"
                  id="location_maps_url"
                  value={formData.location_maps_url || ''}
                  onChange={(value) => setFormData({ ...formData, location_maps_url: value })}
                  placeholder="https://maps.google.com/..."
                />
              )}
            </div>
          </div>

          <FormInput
            label="Organizer Name"
            id="organizer_name"
            value={formData.organizer_name}
            onChange={(value) => setFormData({ ...formData, organizer_name: value })}
            required
          />

          <FormInput
            label="Cover Image URL"
            id="cover_image"
            type="url"
            value={formData.cover_image || ''}
            onChange={(value) => setFormData({ ...formData, cover_image: value })}
            required
            placeholder="https://example.com/image.jpg"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <RichTextEditor
              value={formData.description}
              onChange={(value) => setFormData({ ...formData, description: value })}
              placeholder="Brief description..."
              height="200px"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Content <span className="text-red-500">*</span>
            </label>
            <RichTextEditor
              value={formData.content}
              onChange={(value) => setFormData({ ...formData, content: value })}
              placeholder="Detailed information about the event..."
              height="400px"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Registration URL"
              id="registration_url"
              type="url"
              value={formData.registration_url || ''}
              onChange={(value) => setFormData({ ...formData, registration_url: value })}
              placeholder="https://forms.gle/..."
            />

            <FormInput
              label="Registration Deadline"
              id="registration_deadline"
              type="datetime-local"
              value={formData.registration_deadline || ''}
              onChange={(value) => setFormData({ ...formData, registration_deadline: value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Max Participants"
              id="max_participants"
              type="number"
              value={formData.max_participants || ''}
              onChange={(value) => setFormData({ ...formData, max_participants: value })}
              placeholder="Leave empty for unlimited"
            />

            <FormField label="Tags" id="tags">
              <CreateableSelect
                value={
                  Array.isArray(formData.tags)
                    ? formData.tags
                    : formData.tags
                      ? String(formData.tags).split(',').filter(t => t.trim())
                      : []
                }
                onChange={(tags) => setFormData({ ...formData, tags: tags.join(',') })}
                placeholder="Type tag and press Enter"
              />
            </FormField>
          </div>

          <FormCheckbox
            label="Featured Event"
            id="featured"
            checked={formData.featured}
            onChange={(checked) => setFormData({ ...formData, featured: checked })}
          />
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <FormActions backUrl="/admin/events" loading={loading} isCreateMode={isCreateMode} />
        </div>
      </form>
    </div>
  );
}
