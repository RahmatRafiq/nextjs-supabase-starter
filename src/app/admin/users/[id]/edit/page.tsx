'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { useAuth, UserRole } from '@/lib/auth/AuthContext';
import { ArrowLeft, Upload, X } from 'lucide-react';
import Link from 'next/link';
import { UserFormData } from '@/types';
import { showError, showSuccess, handleApiError } from '@/lib/utils/error-handler';
import { FormSkeleton } from '@/components/ui/Skeleton';

const ROLES: { value: UserRole; label: string; description: string }[] = [
  {
    value: 'super_admin',
    label: 'Super Admin',
    description: 'Full access to all features including user management',
  },
  {
    value: 'admin',
    label: 'Admin',
    description: 'Can manage content, members, and leadership',
  },
  {
    value: 'kontributor',
    label: 'Kontributor',
    description: 'Can create and edit own content',
  },
];

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const { profile, hasPermission } = useAuth();

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [formData, setFormData] = useState<UserFormData>({
    email: '',
    full_name: '',
    role: 'kontributor',
    avatar_url: '',
  });

  useEffect(() => {
    if (!hasPermission(['super_admin'])) {
      router.push('/admin/dashboard');
      return;
    }

    if (id) {
      fetchUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function fetchUser() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        showError('Not authenticated');
        router.push('/admin/users');
        return;
      }

      const response = await fetch(`/api/admin/users/${id}`, {
        headers: { 'Authorization': `Bearer ${session.access_token}` },
      });

      if (!response.ok) {
        await handleApiError(response, 'Failed to load user');
      }

      const result = await response.json();
      const userData = result.user;

      if (!userData) {
        showError('User not found');
        router.push('/admin/users');
        return;
      }

      setFormData({
        email: userData.email || '',
        full_name: userData.full_name || '',
        role: userData.role || 'kontributor',
        avatar_url: userData.avatar_url || '',
      });
      setAvatarPreview(userData.avatar_url || '');
    } catch (error) {
      showError(error, 'Failed to load user');
      router.push('/admin/users');
    } finally {
      setInitialLoading(false);
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showError('Please upload an image file');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      showError('Image size must be less than 2MB');
      return;
    }

    try {
      setLoading(true);

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('public-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('public-images')
        .getPublicUrl(filePath);

      setFormData((prev) => ({ ...prev, avatar_url: publicUrl }));
      setAvatarPreview(publicUrl);
      showSuccess('Avatar uploaded successfully');
    } catch (error) {
      showError(error, 'Failed to upload avatar');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveAvatar = () => {
    setFormData((prev) => ({ ...prev, avatar_url: '' }));
    setAvatarPreview('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (id === profile?.id) {
      showError('You cannot change your own role');
      return;
    }

    if (!formData.full_name || !formData.role) {
      showError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        showError('Not authenticated');
        setLoading(false);
        return;
      }

      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: formData.full_name,
          role: formData.role,
          avatar_url: formData.avatar_url || null,
        }),
      });

      if (!response.ok) {
        await handleApiError(response, 'Failed to update user');
      }

      showSuccess('User updated successfully');
      router.push('/admin/users');
    } catch (error) {
      showError(error, 'Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse" />
          <div className="space-y-2">
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-64 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
        <FormSkeleton />
      </div>
    );
  }

  // Check if trying to edit own account
  const isEditingSelf = id === profile?.id;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/users"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit User</h1>
          <p className="text-gray-600 mt-1">Update user information and permissions</p>
        </div>
      </div>

      {isEditingSelf && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            You are editing your own account. You cannot change your own role.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="space-y-6">
          {/* Avatar Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Avatar</label>
            {avatarPreview ? (
              <div className="relative w-24 h-24">
                <img
                  src={avatarPreview}
                  alt="Avatar preview"
                  className="w-full h-full rounded-full object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveAvatar}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="relative w-24 h-24">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                  id="avatar-upload"
                />
                <label
                  htmlFor="avatar-upload"
                  className="flex items-center justify-center w-full h-full border-2 border-dashed border-gray-300 rounded-full cursor-pointer hover:border-green-500 transition-colors"
                >
                  <Upload className="w-6 h-6 text-gray-400" />
                </label>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email (readonly) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role <span className="text-red-500">*</span>
            </label>
            <div className="space-y-3">
              {ROLES.map((role) => (
                <label
                  key={role.value}
                  className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    formData.role === role.value
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  } ${isEditingSelf ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={role.value}
                    checked={formData.role === role.value}
                    onChange={handleChange}
                    disabled={isEditingSelf}
                    className="mt-1"
                  />
                  <div>
                    <div className="font-medium text-gray-900">{role.label}</div>
                    <div className="text-sm text-gray-600">{role.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
            <Link
              href="/admin/users"
              className="px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Updating...' : 'Update User'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
