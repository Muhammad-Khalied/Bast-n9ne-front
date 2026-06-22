'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, X, GripVertical, Loader2, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import api from '@/lib/api';

interface Media {
  id: string;
  url: string;
  publicId: string;
  altText?: string;
  sortOrder: number;
}

interface MediaUploaderProps {
  productId?: string;
  existingMedia?: Media[];
  onMediaChange?: (media: Media[]) => void;
}

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export default function MediaUploader({ productId, existingMedia = [], onMediaChange }: MediaUploaderProps) {
  const [media, setMedia] = useState<Media[]>(existingMedia);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_TYPES.includes(file.type)) return 'Only JPG, PNG, and WebP images are accepted';
    if (file.size > MAX_SIZE) return 'File size must be under 5MB';
    return null;
  };

  const uploadFile = async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');
    setUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);
      if (productId) formData.append('productId', productId);

      const res = await api.post('/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          if (e.total) setUploadProgress(Math.round((e.loaded / e.total) * 100));
        },
      });

      const newMedia = res.data.data;
      const updated = [...media, newMedia];
      setMedia(updated);
      onMediaChange?.(updated);
    } catch {
      setError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) uploadFile(files[0]);
  }, [media, productId]);

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/media/${id}`);
      const updated = media.filter((m) => m.id !== id);
      setMedia(updated);
      onMediaChange?.(updated);
    } catch {
      setError('Failed to delete image');
    }
  };

  const handleDragStart = (index: number) => setDraggedIndex(index);
  const handleDragOverItem = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    const updated = [...media];
    const [moved] = updated.splice(draggedIndex, 1);
    updated.splice(index, 0, moved);
    setDraggedIndex(index);
    setMedia(updated);
  };
  const handleDragEnd = () => {
    setDraggedIndex(null);
    onMediaChange?.(media);
  };

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-brand-lg p-8 text-center cursor-pointer transition-all ${
          dragOver
            ? 'border-brand-sage bg-brand-sage/5'
            : 'border-brand-ivory-dark hover:border-brand-sage/50 hover:bg-brand-ivory-50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => e.target.files?.[0] && uploadFile(e.target.files[0])}
          className="hidden"
        />

        {uploading ? (
          <div className="space-y-3">
            <Loader2 className="w-8 h-8 text-brand-sage animate-spin mx-auto" />
            <div className="w-48 h-2 bg-brand-ivory-dark rounded-full mx-auto overflow-hidden">
              <div
                className="h-full bg-brand-sage rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-sm text-brand-muted">{uploadProgress}% uploaded</p>
          </div>
        ) : (
          <>
            <Upload className="w-8 h-8 text-brand-muted mx-auto mb-3" />
            <p className="text-sm font-medium text-brand-charcoal">Drop images here or click to upload</p>
            <p className="text-xs text-brand-muted mt-1">JPG, PNG, WebP up to 5MB</p>
          </>
        )}
      </div>

      {error && (
        <p className="text-sm text-status-error bg-status-error/10 px-4 py-2 rounded-brand-md">{error}</p>
      )}

      {/* Media Grid */}
      {media.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {media.map((item, index) => (
            <div
              key={item.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOverItem(e, index)}
              onDragEnd={handleDragEnd}
              className={`relative group aspect-[3/4] rounded-brand-md overflow-hidden border border-brand-ivory-dark ${
                draggedIndex === index ? 'opacity-50' : ''
              }`}
            >
              <Image src={item.url} alt={item.altText || ''} fill className="object-cover" />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors">
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                  className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                >
                  <X className="w-3.5 h-3.5 text-status-error" />
                </button>
                <div className="absolute top-2 left-2 p-1.5 bg-white/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-grab">
                  <GripVertical className="w-3.5 h-3.5 text-brand-muted" />
                </div>
                {index === 0 && (
                  <span className="absolute bottom-2 left-2 text-[10px] font-medium bg-brand-sage text-white px-2 py-0.5 rounded-full">
                    Primary
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
