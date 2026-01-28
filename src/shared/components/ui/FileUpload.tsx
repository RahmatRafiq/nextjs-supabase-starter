'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface FileUploadProps {
    value?: string;
    onChange: (url: string) => void;
    onUpload: (file: File) => Promise<string>;
    accept?: string;
    maxSizeMB?: number;
    className?: string;
    label?: string;
}

export function FileUpload({
    value,
    onChange,
    onUpload,
    accept = 'image/*',
    maxSizeMB = 5,
    className = '',
    label = 'Upload Image',
}: FileUploadProps) {
    const [loading, setLoading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFile = async (file: File) => {
        // Validate size
        if (file.size > maxSizeMB * 1024 * 1024) {
            toast.error(`File too large. Max size is ${maxSizeMB}MB`);
            return;
        }

        // Validate type
        if (accept && !file.type.match(accept.replace('*', '.*'))) {
            toast.error('Invalid file type');
            return;
        }

        try {
            setLoading(true);
            const url = await onUpload(file);
            onChange(url);
            toast.success('Upload successful');
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Failed to upload file');
        } finally {
            setLoading(false);
        }
    };

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleRemove = () => {
        onChange('');
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    return (
        <div className={`space-y-2 ${className}`}>
            {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}

            {!value ? (
                <div
                    className={`
            relative group cursor-pointer border-2 border-dashed rounded-xl p-8 transition-all duration-200 ease-in-out text-center
            ${dragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'}
            ${loading ? 'opacity-50 cursor-wait' : ''}
          `}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => !loading && inputRef.current?.click()}
                >
                    <input
                        ref={inputRef}
                        type="file"
                        className="hidden"
                        accept={accept}
                        onChange={handleChange}
                        disabled={loading}
                    />

                    <div className="flex flex-col items-center justify-center gap-3">
                        {loading ? (
                            <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
                        ) : (
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Upload className="w-6 h-6 text-gray-500" />
                            </div>
                        )}

                        <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-900">
                                {loading ? 'Uploading...' : 'Click or drop file to upload'}
                            </p>
                            <p className="text-xs text-gray-500">
                                Max file size: {maxSizeMB}MB
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="relative group rounded-xl overflow-hidden border border-gray-200">
                    <div className="aspect-video w-full bg-gray-50 relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={value}
                            alt="Uploaded file"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                            <button
                                type="button"
                                onClick={handleRemove}
                                className="bg-white/90 p-2 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-200 hover:bg-white hover:text-red-500"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        {/* Overlay for "Change" action could be added here if needed */}
                    </div>
                    <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/60 text-white text-xs rounded backdrop-blur-sm">
                        Uploaded
                    </div>
                </div>
            )}
        </div>
    );
}
