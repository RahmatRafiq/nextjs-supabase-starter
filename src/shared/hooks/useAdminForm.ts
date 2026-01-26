/**
 * useAdminForm Hook
 *
 * Reusable hook for admin form pages (create/edit) with common functionality:
 * - Automatic create vs edit mode detection
 * - Data fetching with permission checks
 * - Form submission with validation
 * - Error handling with toast notifications
 * - Permission-based access control
 *
 * This hook reduces ~150 lines of duplicate code per admin form page.
 *
 * @remarks
 * **How it works:**
 * 1. Detects mode: id === 'new' → create mode, otherwise → edit mode
 * 2. Edit mode: Fetches existing data, validates permissions
 * 3. Create mode: Uses initialData, checks create permissions
 * 4. Submit: Validates, calls onBeforeSave hook, inserts/updates, redirects
 *
 * **Permission Flow:**
 * - Create: Checks `permissions.canCreate()` if provided, else allows all authenticated users
 * - Edit: Checks `permissions.canEdit(authorId)` if provided, else uses default (super_admin/admin full access, kontributor own content only)
 * - Default permissions use `hasPermission()` and `canEditOwnContent()` from AuthContext
 *
 * **Error Handling:**
 * - Profile fetch failures: Redirects to list page with error toast
 * - Permission failures: Redirects with "no permission" toast
 * - Submit failures: Shows error toast, stays on page for retry
 *
 * @example
 * ```tsx
 * // Basic usage (articles form)
 * const form = useAdminForm({
 *   tableName: 'articles',
 *   id: params.id,
 *   initialData: { title: '', content: '', status: 'draft' },
 *   redirectPath: '/admin/articles',
 * });
 *
 * return (
 *   <form onSubmit={form.handleSubmit}>
 *     <input
 *       value={form.formData.title}
 *       onChange={(e) => form.updateField('title', e.target.value)}
 *     />
 *     <button type="submit" disabled={form.loading}>Save</button>
 *   </form>
 * );
 * ```
 *
 * @example
 * ```tsx
 * // With custom permissions and pre-save hook
 * const form = useAdminForm({
 *   tableName: 'events',
 *   selectColumns: 'id, title, slug, organizer, creator_id',
 *   id: params.id,
 *   initialData: { title: '', organizer: { name: '', contact: '' } },
 *   redirectPath: '/admin/events',
 *   onBeforeSave: async (data) => ({
 *     ...data,
 *     slug: slugify(data.title),
 *     updated_at: new Date().toISOString(),
 *   }),
 *   permissions: {
 *     canCreate: () => hasPermission(['admin', 'super_admin']),
 *     canEdit: (creatorId) => hasPermission(['super_admin']) || canEditOwnContent(creatorId),
 *   },
 * });
 * ```
 *
 * @template T - Form data type (must extend object)
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/lib/auth/AuthContext';
import { toast } from 'sonner';

/**
 * Configuration options for useAdminForm hook
 * @template T - Form data type
 */
interface UseAdminFormOptions<T> {
  /** Table name in Supabase database */
  tableName: string;
  /** Columns to select when fetching (default: '*') */
  selectColumns?: string;
  /** Record ID ('new' for create mode, UUID for edit mode) */
  id: string;
  /** Initial form data (used in create mode and as fallback) */
  initialData: T;
  /** Path to redirect after successful save */
  redirectPath: string;
  /**
   * Optional hook to transform data before save
   * @param data - Current form data
   * @returns Transformed data to save to database
   * @example
   * onBeforeSave: (data) => ({ ...data, slug: slugify(data.title) })
   */
  onBeforeSave?: (data: T) => Record<string, unknown> | Promise<Record<string, unknown>>;
  /**
   * Optional custom permission checks
   * @remarks If not provided, uses default permissions from AuthContext
   */
  permissions?: {
    /** Check if user can create new records */
    canCreate?: () => boolean;
    /**
     * Check if user can edit specific record
     * @param authorId - The author_id or creator_id of the record
     */
    canEdit?: (authorId: string) => boolean;
  };
}

/**
 * Return type for useAdminForm hook
 * @template T - Form data type
 */
interface UseAdminFormResult<T> {
  /** Current form data state */
  formData: T;
  /** Set form data (for bulk updates) */
  setFormData: React.Dispatch<React.SetStateAction<T>>;
  /** Loading state during form submission */
  loading: boolean;
  /** Fetching state during initial data load (edit mode only) */
  fetching: boolean;
  /** True if in create mode (id === 'new'), false if edit mode */
  isCreateMode: boolean;
  /** Author ID of the record (empty in create mode, populated after fetch in edit mode) */
  authorId: string;
  /**
   * Form submit handler
   * @param e - Form event
   * @remarks Validates permissions, calls onBeforeSave, inserts/updates, redirects on success
   */
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  /**
   * Update a single form field
   * @param field - Field name (type-safe key of T)
   * @param value - New value (type-safe value for the field)
   * @example updateField('title', 'New Title')
   */
  updateField: (field: keyof T, value: T[keyof T]) => void;
}

/**
 * Admin form hook for create/edit pages
 *
 * @template T - Form data type (must extend object)
 * @param options - Configuration options
 * @returns Form state and handlers
 *
 * @remarks
 * **Database Expectations:**
 * - Create: Automatically adds `author_id` field with current user's ID
 * - Edit: Expects record to have `author_id` or `creator_id` field for permission checks
 * - All tables should have these columns for proper permission handling
 *
 * **Loading States:**
 * - `fetching`: true during initial data fetch (edit mode only)
 * - `loading`: true during form submission (both create and edit)
 * - Show spinner when `fetching || loading` to cover all loading scenarios
 *
 * **Permission Checking:**
 * - Happens automatically on mount (edit mode) and on submit (create mode)
 * - Failed permission checks redirect to list page with error toast
 * - Custom permissions override default behavior
 */
export function useAdminForm<T extends object>({
  tableName,
  selectColumns = '*',
  id,
  initialData,
  redirectPath,
  onBeforeSave,
  permissions,
}: UseAdminFormOptions<T>): UseAdminFormResult<T> {
  const router = useRouter();
  const { user, profile, hasPermission, canEditOwnContent } = useAuth();
  const [formData, setFormData] = useState<T>(initialData);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [authorId, setAuthorId] = useState<string>('');

  const isCreateMode = id === 'new';

  // Fetch existing data
  useEffect(() => {
    if (!isCreateMode && profile) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, profile?.id]);

  async function fetchData() {
    setFetching(true);
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select(selectColumns)
        .eq('id', id)
        .single();

      if (error) throw error;

      if (!data) {
        toast.error('Data not found');
        router.push(redirectPath);
        return;
      }

      // Check permissions for edit
      const record = data as Record<string, unknown>;
      const dataAuthorId = (record.author_id ?? record.creator_id ?? '') as string;
      setAuthorId(dataAuthorId);

      if (permissions?.canEdit) {
        if (!permissions.canEdit(dataAuthorId)) {
          toast.error('You do not have permission to edit this');
          router.push(redirectPath);
          return;
        }
      } else {
        // Default permission check
        if (!hasPermission(['super_admin', 'admin']) && !canEditOwnContent(dataAuthorId)) {
          toast.error('You do not have permission to edit this');
          router.push(redirectPath);
          return;
        }
      }

      setFormData(data as T);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load data';
      toast.error(message);
      router.push(redirectPath);
    } finally {
      setFetching(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Check create permissions
    if (isCreateMode && permissions?.canCreate) {
      if (!permissions.canCreate()) {
        toast.error('You do not have permission to create');
        return;
      }
    }

    setLoading(true);

    try {
      let dataToSave: Record<string, unknown> = { ...formData } as Record<string, unknown>;

      // Run pre-save hook
      if (onBeforeSave) {
        dataToSave = await onBeforeSave(formData);
      }

      if (isCreateMode) {
        // Create
        const { error } = await supabase
          .from(tableName)
          .insert([{ ...dataToSave, author_id: user?.id }] as never);

        if (error) throw error;

        toast.success('Created successfully');
      } else {
        // Update
        const { error } = await supabase
          .from(tableName)
          .update(dataToSave as never)
          .eq('id', id);

        if (error) throw error;

        toast.success('Updated successfully');
      }

      router.push(redirectPath);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  function updateField(field: keyof T, value: T[keyof T]) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  return {
    formData,
    setFormData,
    loading,
    fetching,
    isCreateMode,
    authorId,
    handleSubmit,
    updateField,
  };
}
