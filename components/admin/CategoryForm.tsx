"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../lib/api";
import { Button, Input, Select } from "../ui";
import { toast } from "react-hot-toast";
import { ChevronLeft, Save, Upload, X, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface CategoryFormProps {
  categoryId?: string;
}

export function CategoryForm({ categoryId }: CategoryFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    image: "",
    isActive: true,
  });
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (categoryId) {
      api.get(`/admin/categories/${categoryId}`).then((res) => {
        const cat = res.data.data;
        if (cat) {
          setForm({
            name: cat.name,
            slug: cat.slug,
            description: cat.description || "",
            image: cat.image || "",
            isActive: cat.isActive,
          });
        }
      });
    }
  }, [categoryId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (categoryId) {
        await api.patch(`/admin/categories/${categoryId}`, form);
        toast.success("Category updated");
      } else {
        await api.post("/admin/categories", form);
        toast.success("Category created");
        router.push("/admin/categories");
      }
    } catch (err) {
      toast.error("Failed to save category");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await api.post("/media/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setForm({ ...form, image: res.data.data.url });
      toast.success("Image uploaded successfully");
    } catch (err) {
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <Link href="/admin/categories" className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-muted hover:text-brand-black transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back to Categories
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-brand-white p-6 md:p-8 rounded-brand-lg border border-brand-ivory-dark shadow-sm space-y-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-muted mb-2">Category Name</label>
            <Input
              required
              placeholder="e.g. Outerwear"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-muted mb-2">Slug</label>
            <Input
              required
              placeholder="e.g. outerwear"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-muted mb-2">Description</label>
            <textarea
              rows={3}
              placeholder="Optional description..."
              className="w-full rounded-brand border border-brand-ivory-dark bg-brand-white px-4 py-3 text-sm focus:border-brand-sage focus:outline-none focus:ring-1 focus:ring-brand-sage transition-all"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-muted mb-2">Category Image</label>
            <div className="flex items-start gap-4">
              {form.image ? (
                <div className="relative w-24 h-24 rounded-brand border border-brand-ivory-dark overflow-hidden bg-brand-ivory flex-shrink-0">
                  <Image src={form.image} alt="Category" fill className="object-cover" />
                  <button 
                    type="button" 
                    onClick={() => setForm({ ...form, image: "" })}
                    className="absolute top-1 right-1 p-1 bg-white/90 rounded-full hover:bg-white text-status-error"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="w-24 h-24 rounded-brand border border-brand-ivory-dark border-dashed flex items-center justify-center bg-brand-ivory/50 flex-shrink-0">
                  <span className="text-[10px] text-brand-muted uppercase font-bold text-center px-2">No Image</span>
                </div>
              )}
              
              <div className="flex-1">
                <input
                  type="file"
                  id="categoryImage"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                />
                <label 
                  htmlFor="categoryImage"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-brand-ivory hover:bg-brand-ivory-dark border border-brand-ivory-dark rounded-brand text-xs font-bold uppercase tracking-widest text-brand-charcoal cursor-pointer transition-colors disabled:opacity-50"
                >
                  {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  {isUploading ? "Uploading..." : "Upload Image"}
                </label>
                <p className="text-[10px] text-brand-muted mt-2 uppercase tracking-wide">JPG, PNG, WebP up to 5MB</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <input 
              type="checkbox" 
              id="isActive"
              className="w-4 h-4 accent-brand-sage"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
            />
            <label htmlFor="isActive" className="text-xs font-bold uppercase tracking-widest text-brand-charcoal cursor-pointer">Active Category</label>
          </div>
        </div>

        <Button 
          type="submit" 
          disabled={isLoading}
          className="w-full h-14 bg-brand-black text-brand-white hover:bg-brand-charcoal transition-colors uppercase tracking-[0.2em] font-bold text-xs flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" /> {isLoading ? "Saving..." : categoryId ? "Update Category" : "Create Category"}
        </Button>
      </form>
    </div>
  );
}
