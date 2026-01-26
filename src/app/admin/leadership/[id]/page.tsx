'use client';

import { useParams } from 'next/navigation';
import { useAdminForm } from '@/shared/hooks/useAdminForm';
import { RichTextEditor } from '@/shared/components/RichTextEditor';
import { FormInput } from '@/shared/components/FormInput';
import { FormSelect } from '@/shared/components/FormSelect';
import { FormActions } from '@/shared/components/FormActions';
import { LeadershipFormData } from '@/types/forms';

const POSITIONS = [
  { value: 'ketua', label: 'Ketua' },
  { value: 'wakil-ketua', label: 'Wakil Ketua' },
  { value: 'sekretaris', label: 'Sekretaris' },
  { value: 'bendahara', label: 'Bendahara' },
  { value: 'coordinator', label: 'Koordinator' },
  { value: 'member', label: 'Anggota' },
];

const DIVISIONS = [
  { value: 'internal-affairs', label: 'Internal Affairs' },
  { value: 'external-affairs', label: 'External Affairs' },
  { value: 'academic', label: 'Academic' },
  { value: 'student-development', label: 'Student Development' },
  { value: 'entrepreneurship', label: 'Entrepreneurship' },
  { value: 'media-information', label: 'Media & Information' },
  { value: 'sports-arts', label: 'Sports & Arts' },
  { value: 'islamic-spirituality', label: 'Islamic Spirituality' },
];

export default function LeadershipFormPage() {
  const params = useParams();
  const id = params.id as string;

  const {
    formData,
    setFormData,
    loading,
    fetching,
    isCreateMode,
    handleSubmit,
  } = useAdminForm<LeadershipFormData>({
    tableName: 'leadership',
    id,
    initialData: {
      name: '',
      position: '',
      division: '',
      photo: '',
      email: '',
      phone: '',
      nim: '',
      batch: '',
      bio: '',
      social_media_instagram: '',
      social_media_linkedin: '',
      social_media_twitter: '',
      period_start: '',
      period_end: '',
      order: 1,
    },
    redirectPath: '/admin/leadership',
    onBeforeSave: (data) => {
      const socialMedia: Record<string, string> = {};
      if (data.social_media_instagram) {
        socialMedia.instagram = data.social_media_instagram;
      }
      if (data.social_media_linkedin) {
        socialMedia.linkedin = data.social_media_linkedin;
      }
      if (data.social_media_twitter) {
        socialMedia.twitter = data.social_media_twitter;
      }

      return {
        name: data.name,
        position: data.position,
        division: data.division,
        photo: data.photo || '',
        email: data.email || null,
        phone: data.phone || null,
        nim: data.nim || null,
        batch: data.batch || null,
        bio: data.bio || null,
        social_media: Object.keys(socialMedia).length > 0 ? socialMedia : null,
        period_start: data.period_start || null,
        period_end: data.period_end || null,
        order: data.order,
      };
    },
  });

  const handleNameChange = (value: string) => {
    const isPhotoEmptyOrAuto = !formData.photo || formData.photo.includes('ui-avatars.com');
    const newPhoto = isPhotoEmptyOrAuto && value.trim()
      ? `https://ui-avatars.com/api/?name=${encodeURIComponent(value)}&background=random`
      : formData.photo;

    setFormData({
      ...formData,
      name: value,
      photo: newPhoto || '',
    });
  };

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
          {isCreateMode ? 'Add New Leader' : 'Edit Leader'}
        </h1>
        <p className="text-gray-600 mt-1">
          {isCreateMode ? 'Fill in the leadership details' : 'Update leadership information'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Full Name"
              id="name"
              value={formData.name}
              onChange={handleNameChange}
              required
            />

            <FormInput
              label="Email"
              id="email"
              type="email"
              value={formData.email || ''}
              onChange={(value) => setFormData({ ...formData, email: value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormSelect
              label="Position"
              id="position"
              value={formData.position}
              onChange={(value) => setFormData({ ...formData, position: value })}
              options={POSITIONS}
              required
            />

            <FormSelect
              label="Division"
              id="division"
              value={formData.division}
              onChange={(value) => setFormData({ ...formData, division: value })}
              options={DIVISIONS}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="NIM"
              id="nim"
              value={formData.nim || ''}
              onChange={(value) => setFormData({ ...formData, nim: value })}
              required
            />

            <FormInput
              label="Batch"
              id="batch"
              value={formData.batch || ''}
              onChange={(value) => setFormData({ ...formData, batch: value })}
              required
              placeholder="2020"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Phone"
              id="phone"
              value={formData.phone || ''}
              onChange={(value) => setFormData({ ...formData, phone: value })}
              placeholder="08123456789"
            />

            <FormInput
              label="Photo URL"
              id="photo"
              type="url"
              value={formData.photo || ''}
              onChange={(value) => setFormData({ ...formData, photo: value })}
              placeholder="https://example.com/photo.jpg"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Period Start"
              id="period_start"
              value={formData.period_start || ''}
              onChange={(value) => setFormData({ ...formData, period_start: value })}
              required
              placeholder="2024"
            />

            <FormInput
              label="Period End"
              id="period_end"
              value={formData.period_end || ''}
              onChange={(value) => setFormData({ ...formData, period_end: value })}
              required
              placeholder="2025"
            />
          </div>

          <FormInput
            label="Order"
            id="order"
            type="number"
            value={(formData.order || 1).toString()}
            onChange={(value) => setFormData({ ...formData, order: parseInt(value) || 1 })}
            required
            placeholder="1"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio
            </label>
            <RichTextEditor
              value={formData.bio || ''}
              onChange={(value) => setFormData({ ...formData, bio: value })}
              placeholder="Short biography..."
              height="300px"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Instagram Username"
              id="social_media_instagram"
              value={formData.social_media_instagram || ''}
              onChange={(value) => setFormData({ ...formData, social_media_instagram: value })}
              placeholder="username (without @)"
            />

            <FormInput
              label="LinkedIn URL"
              id="social_media_linkedin"
              type="url"
              value={formData.social_media_linkedin || ''}
              onChange={(value) => setFormData({ ...formData, social_media_linkedin: value })}
              placeholder="https://linkedin.com/in/username"
            />
          </div>

          <FormInput
            label="Twitter URL"
            id="social_media_twitter"
            type="url"
            value={formData.social_media_twitter || ''}
            onChange={(value) => setFormData({ ...formData, social_media_twitter: value })}
            placeholder="https://twitter.com/username"
          />
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <FormActions backUrl="/admin/leadership" loading={loading} isCreateMode={isCreateMode} />
        </div>
      </form>
    </div>
  );
}
