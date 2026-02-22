'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAdminForm } from '@/shared/hooks/useAdminForm';
import { RichTextEditor } from '@/shared/components/RichTextEditor';
import { FormInput } from '@/shared/components/FormInput';
import { FormTextarea } from '@/shared/components/FormTextarea';
import { FormSelect } from '@/shared/components/FormSelect';
import { FormCheckbox } from '@/shared/components/FormCheckbox';
import { FormActions } from '@/shared/components/FormActions';
import { FormField } from '@/shared/components/FormField';
import { CreateableSelect } from '@/shared/components/ui/CreateableSelect';
import { FileUpload } from '@/shared/components/ui/FileUpload';
import { StorageService } from '@/lib/storage/storage.service';
import { generateSlug } from '@/lib/utils/slug';
import { ArticleFormData } from '@/types/forms';

const CATEGORIES = [
  { value: 'post', label: 'Post' },
  { value: 'blog', label: 'Blog' },
  { value: 'opinion', label: 'Opinion' },
  { value: 'publication', label: 'Publication' },
  { value: 'info', label: 'Info' },
];

export default function ArticlePage() {
  const params = useParams();
  const id = params.id as string;
  const [initialCoverImage, setInitialCoverImage] = useState<string | null>(null);

  const {
    formData,
    setFormData,
    loading,
    fetching,
    isCreateMode,
    handleSubmit,
    updateField,
  } = useAdminForm<ArticleFormData>({
    tableName: 'articles',
    selectColumns: 'id, title, slug, excerpt, content, category, cover_image, tags, featured, status, author_id',
    id,
    initialData: {
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      category: 'post',
      cover_image: '',
      tags: '',
      featured: false,
      status: 'draft',
    },
    redirectPath: '/admin/articles',
    onBeforeSave: async (data) => {
      // Cleanup old image if changed
      if (initialCoverImage && data.cover_image && data.cover_image !== initialCoverImage) {
        try {
          await StorageService.deleteFile(initialCoverImage);
        } catch (error) {
          console.error('Failed to delete old image:', error);
          // Continue saving even if deletion fails
        }
      }

      let formattedTags: string[] = [];
      if (Array.isArray(data.tags)) {
        formattedTags = data.tags;
      } else if (typeof data.tags === 'string') {
        formattedTags = data.tags ? (data.tags as string).split(',').map((t: string) => t.trim()) : [];
      }

      return {
        ...data,
        tags: formattedTags,
        author: {
          name: data.title,
          email: '',
        },
        published_at: new Date().toISOString(),
      };
    },
  });

  function handleTitleChange(value: string) {
    setFormData({
      ...formData,
      title: value,
      slug: generateSlug(value),
    });
  }

  // Capture initial cover image when data is loaded
  useEffect(() => {
    if (!fetching && !isCreateMode && formData.cover_image && initialCoverImage === null) {
      setInitialCoverImage(formData.cover_image);
    }
  }, [fetching, isCreateMode, formData.cover_image, initialCoverImage]);

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
          {isCreateMode ? 'Create Article' : 'Edit Article'}
        </h1>
        <p className="text-gray-600 mt-1">
          {isCreateMode ? 'Write a new article or publication' : 'Update article information'}
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
            onChange={(value) => updateField('slug', value)}
            required
            placeholder="Auto-generated from title. Used in URL."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormSelect
              label="Category"
              id="category"
              value={formData.category}
              onChange={(value) => updateField('category', value)}
              options={CATEGORIES}
              required
            />

            <FileUpload
              label="Cover Image"
              value={formData.cover_image || ''}
              onChange={(url) => updateField('cover_image', url)}
              onUpload={(file) => StorageService.uploadFile(file, 'articles').then(res => {
                if (res.error) throw res.error;
                return res.url!;
              })}
              accept="image/*"
            />
          </div>

          <FormTextarea
            label="Excerpt"
            id="excerpt"
            value={formData.excerpt || ''}
            onChange={(value) => updateField('excerpt', value)}
            required
            rows={3}
            placeholder="Brief summary of the article..."
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
              onChange={(tags) => updateField('tags', tags.join(','))}
              placeholder="Type tag and press Enter"
            />
          </FormField>

          <FormCheckbox
            label="Featured Article"
            id="featured"
            checked={formData.featured}
            onChange={(checked) => updateField('featured', checked)}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content <span className="text-red-500">*</span>
            </label>
            <RichTextEditor
              value={formData.content || ''}
              onChange={(value) => updateField('content', value)}
              placeholder="Write your article content..."
              height="500px"
              showPreview={true}
            />
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <FormActions backUrl="/admin/articles" loading={loading} isCreateMode={isCreateMode} />
        </div>
      </form>
    </div>
  );
}
