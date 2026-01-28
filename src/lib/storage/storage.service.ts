'use client';

import { supabase } from '@/lib/supabase/client';
import { v4 as uuidv4 } from 'uuid';

export class StorageService {
    private static BUCKET = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || 'media';

    /**
     * Upload a file to Supabase Storage
     * @param file - The file object to upload
     * @param folder - Optional folder path (e.g., 'articles', 'avatars')
     * @returns The public URL of the uploaded file
     */
    static async uploadFile(file: File, folder: string = 'general'): Promise<{ url: string | null; error: Error | null }> {
        try {
            let fileToUpload = file;
            let fileExt = file.name.split('.').pop();
            const isImage = file.type.startsWith('image/');

            // Compress image if it's an image
            if (isImage) {
                try {
                    const compressedBlob = await this.compressImage(file);
                    fileToUpload = new File([compressedBlob], file.name.replace(/\.[^/.]+$/, ".webp"), {
                        type: 'image/webp',
                        lastModified: Date.now(),
                    });
                    fileExt = 'webp';
                } catch (compressionError) {
                    console.warn('Image compression failed, uploading original file:', compressionError);
                }
            }

            // Create a unique file name
            const fileName = `${uuidv4()}.${fileExt}`;
            const filePath = `${folder}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from(this.BUCKET)
                .upload(filePath, fileToUpload, {
                    cacheControl: '3600',
                    upsert: false,
                    contentType: fileToUpload.type,
                });

            if (uploadError) throw uploadError;

            const { data } = supabase.storage
                .from(this.BUCKET)
                .getPublicUrl(filePath);

            return { url: data.publicUrl, error: null };
        } catch (error) {
            console.error('Error uploading file:', error);
            return { url: null, error: error as Error };
        }
    }

    /**
     * Compress image using Canvas API
     * Converts to WebP with 0.8 quality
     */
    private static compressImage(file: File): Promise<Blob> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            const reader = new FileReader();

            reader.onload = (e) => {
                img.src = e.target?.result as string;
            };

            reader.onerror = (e) => reject(e);

            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // Max width/height to avoid massive images (e.g. 1920px)
                const MAX_SIZE = 1920;
                if (width > height) {
                    if (width > MAX_SIZE) {
                        height *= MAX_SIZE / width;
                        width = MAX_SIZE;
                    }
                } else {
                    if (height > MAX_SIZE) {
                        width *= MAX_SIZE / height;
                        height = MAX_SIZE;
                    }
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error('Failed to get canvas context'));
                    return;
                }

                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob(
                    (blob) => {
                        if (blob) resolve(blob);
                        else reject(new Error('Canvas to Blob failed'));
                    },
                    'image/webp',
                    0.8
                );
            };

            reader.readAsDataURL(file);
        });
    }

    /**
     * Delete a file from storage from its full URL
     * @param url - The full public URL of the file
     */
    static async deleteFile(url: string): Promise<{ error: Error | null }> {
        try {
            // Extract path from URL
            // URL format: https://<project>.supabase.co/storage/v1/object/public/<bucket>/<path>
            const path = url.split(`${this.BUCKET}/`).pop();

            if (!path) throw new Error('Invalid file URL');

            const { error } = await supabase.storage
                .from(this.BUCKET)
                .remove([path]);

            if (error) throw error;

            return { error: null };
        } catch (error) {
            console.error('Error deleting file:', error);
            return { error: error as Error };
        }
    }
}
