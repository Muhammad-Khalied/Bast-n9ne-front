"use client";

import { useState } from "react";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import api from "../../lib/api";
import { toast } from "react-hot-toast";

interface ProductMediaManagerProps {
  productId?: string;
  initialMedia?: any[];
  onMediaChange?: (media: any[]) => void;
}

export function ProductMediaManager({ productId, initialMedia = [], onMediaChange }: ProductMediaManagerProps) {
  const [media, setMedia] = useState<any[]>(initialMedia);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    if (productId) {
      formData.append("productId", productId);
    }

    setIsUploading(true);
    try {
      const res = await api.post("/media/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      const newMedia = [...media, res.data.data];
      setMedia(newMedia);
      onMediaChange?.(newMedia);
      toast.success("Image uploaded");
    } catch (err) {
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/media/${id}`);
      const newMedia = media.filter(m => m.id !== id);
      setMedia(newMedia);
      onMediaChange?.(newMedia);
      toast.success("Image removed");
    } catch (err) {
      toast.error("Failed to delete image");
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {media.map((item) => (
          <div key={item.id} className="relative aspect-[3/4] bg-brand-ivory rounded-brand overflow-hidden group border border-brand-ivory-dark">
            <img src={item.url} alt="Product" className="w-full h-full object-cover" />
            <button 
              onClick={() => handleDelete(item.id)}
              className="absolute top-2 right-2 p-1.5 bg-brand-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-status-error"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
        
        <label className="flex flex-col items-center justify-center aspect-[3/4] border-2 border-dashed border-brand-ivory-dark rounded-brand bg-brand-ivory/50 cursor-pointer hover:bg-brand-ivory transition-colors group">
          {isUploading ? (
            <Loader2 className="w-6 h-6 text-brand-sage animate-spin" />
          ) : (
            <>
              <Upload className="w-6 h-6 text-brand-muted group-hover:text-brand-sage transition-colors" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted mt-2">Upload</span>
            </>
          )}
          <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={isUploading} />
        </label>
      </div>
      <p className="text-[10px] text-brand-muted italic uppercase tracking-wider">Recommended size: 1200 x 1600px. First image will be the cover.</p>
    </div>
  );
}
