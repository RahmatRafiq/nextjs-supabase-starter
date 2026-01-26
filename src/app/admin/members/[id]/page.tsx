'use client';

import { useParams } from 'next/navigation';
import { useAdminForm } from '@/shared/hooks/useAdminForm';
import { RichTextEditor } from '@/shared/components/RichTextEditor';
import { FormInput } from '@/shared/components/FormInput';
import { FormSelect } from '@/shared/components/FormSelect';
import { FormActions } from '@/shared/components/FormActions';
import { MemberFormData } from '@/types/forms';
import { MemberStatus } from '@/lib/constants/admin';

const STATUSES = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'alumni', label: 'Alumni' },
];

export default function MemberFormPage() {
  const params = useParams();
  const id = params.id as string;

  const {
    formData,
    setFormData,
    loading,
    fetching,
    isCreateMode,
    handleSubmit,
  } = useAdminForm<MemberFormData>({
    tableName: 'members',
    id,
    initialData: {
      name: '',
      nim: '',
      email: '',
      phone: '',
      photo: '',
      batch: '',
      status: 'active',
      division: '',
      position: '',
      joined_at: '',
      graduated_at: '',
      bio: '',
      interests: '',
      achievements: '',
      social_media_instagram: '',
      social_media_linkedin: '',
      social_media_twitter: '',
    },
    redirectPath: '/admin/members',
    permissions: {
      canCreate: () => true,
      canEdit: () => true,
    },
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
        nim: data.nim,
        email: data.email,
        phone: data.phone || null,
        photo: data.photo || null,
        batch: data.batch,
        status: data.status,
        division: data.division || null,
        position: data.position || null,
        joined_at: data.joined_at || null,
        graduated_at: data.graduated_at || null,
        bio: data.bio || null,
        interests: data.interests
          ? (typeof data.interests === 'string' ? data.interests.split(',') : data.interests).map((i: string) => i.trim())
          : null,
        achievements: data.achievements
          ? (typeof data.achievements === 'string' ? data.achievements.split(',') : data.achievements).map((a: string) => a.trim())
          : null,
        social_media: Object.keys(socialMedia).length > 0 ? socialMedia : null,
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
          {isCreateMode ? 'Add New Member' : 'Edit Member'}
        </h1>
        <p className="text-gray-600 mt-1">
          {isCreateMode ? 'Fill in the details to create a new member' : 'Update member information'}
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
              label="NIM"
              id="nim"
              value={formData.nim}
              onChange={(value) => setFormData({ ...formData, nim: value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Email"
              id="email"
              type="email"
              value={formData.email}
              onChange={(value) => setFormData({ ...formData, email: value })}
              required
            />

            <FormInput
              label="Phone Number"
              id="phone"
              value={formData.phone || ''}
              onChange={(value) => setFormData({ ...formData, phone: value })}
              placeholder="08123456789"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Batch"
              id="batch"
              value={formData.batch}
              onChange={(value) => setFormData({ ...formData, batch: value })}
              required
              placeholder="2020"
            />

            <FormSelect
              label="Status"
              id="status"
              value={formData.status}
              onChange={(value) => setFormData({ ...formData, status: value as MemberStatus })}
              options={STATUSES}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Division"
              id="division"
              value={formData.division || ''}
              onChange={(value) => setFormData({ ...formData, division: value })}
              placeholder="e.g., Internal Affairs"
            />

            <FormInput
              label="Position"
              id="position"
              value={formData.position || ''}
              onChange={(value) => setFormData({ ...formData, position: value })}
              placeholder="e.g., Coordinator"
            />
          </div>

          <FormInput
            label="Photo URL"
            id="photo"
            type="url"
            value={formData.photo || ''}
            onChange={(value) => setFormData({ ...formData, photo: value })}
            placeholder="https://example.com/photo.jpg"
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

          <FormInput
            label="Interests"
            id="interests"
            value={formData.interests || ''}
            onChange={(value) => setFormData({ ...formData, interests: value })}
            placeholder="Programming, Design, Writing (comma-separated)"
          />

          <FormInput
            label="Achievements"
            id="achievements"
            value={formData.achievements || ''}
            onChange={(value) => setFormData({ ...formData, achievements: value })}
            placeholder="Award 1, Award 2, Award 3 (comma-separated)"
          />

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
          <FormActions backUrl="/admin/members" loading={loading} isCreateMode={isCreateMode} />
        </div>
      </form>
    </div>
  );
}
