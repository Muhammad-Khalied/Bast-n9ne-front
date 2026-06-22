"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../lib/api";
import { Button, Input, Select } from "../ui";
import { toast } from "react-hot-toast";
import { ChevronLeft, Save, Layout, Image as ImageIcon, Box, Tag, DollarSign, Settings } from "lucide-react";
import Link from "next/link";
import { ProductMediaManager } from "./ProductMediaManager";
import { ProductVariantManager } from "./ProductVariantManager";
import { PRODUCT_COLORS } from "../../lib/colors";

interface ProductFormProps {
  productId?: string;
}

export function ProductForm({ productId }: ProductFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(!!productId);
  const [categories, setCategories] = useState<any[]>([]);
  
  const [form, setForm] = useState<any>({
    title: "",
    description: "",
    price: "",
    discountPrice: null,
    categoryId: "",
    status: "DRAFT",
    sizes: "",
    tags: "",
    featured: false,
  });

  const [media, setMedia] = useState<any[]>([]);
  const [variants, setVariants] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const catRes = await api.get("/admin/categories");
        setCategories(catRes.data.data ?? []);

        if (productId) {
          const prodRes = await api.get(`/admin/products/${productId}`);
          const product = prodRes.data.data;
          if (product) {
            setForm({
              title: product.title,
              description: product.description,
              price: Number(product.price),
              discountPrice: product.discountPrice ? Number(product.discountPrice) : null,
              categoryId: product.categoryId,
              status: product.status,
              sizes: Array.isArray(product.sizes) ? product.sizes.join(", ") : product.sizes,
              tags: Array.isArray(product.tags) ? product.tags.join(", ") : product.tags,
              featured: product.featured || false,
            });
            setMedia(product.media || []);
            const mappedVariants = (product.variants || []).map((v: any) => {
              const matchedColor = product.colors?.find((c: any) => c.name === v.color);
              return {
                ...v,
                colorHex: matchedColor?.hex || PRODUCT_COLORS.find((c) => c.name.toLowerCase() === v.color?.toLowerCase())?.hex || "#000000"
              };
            });
            setVariants(mappedVariants);
          }
        }
      } catch (error) {
        toast.error("Failed to load form data");
      } finally {
        setIsFetching(false);
      }
    };
    fetchData();
  }, [productId]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    
    // Prepare data for API
    const data = {
      ...form,
      sizes: form.sizes.split(",").map((s: string) => s.trim()).filter(Boolean),
      tags: form.tags.split(",").map((t: string) => t.trim()).filter(Boolean),
      // Infer colors from variants
      colors: Array.from(new Set(variants.map(v => v.color))).filter(Boolean).map(name => {
        const variantWithColor = variants.find(v => v.color === name);
        const found = PRODUCT_COLORS.find(c => c.name.toLowerCase() === name.toLowerCase());
        const hex = variantWithColor?.colorHex || (found ? found.hex : "#000000");
        return { name, hex };
      }),
      variants: variants.map(v => ({
        ...v,
        sku: v.sku || `${form.title.substring(0, 3).toUpperCase()}-${v.size}-${v.color.substring(0, 3).toUpperCase()}-${Math.floor(Math.random() * 1000)}`
      })),
    };

    try {
      if (productId) {
        await api.patch(`/admin/products/${productId}`, data);
        toast.success("Product updated successfully");
      } else {
        const res = await api.post("/admin/products", data);
        const newProductId = res.data.data.id;
        
        // If we have media that was uploaded "loose" (rare case with this logic but good for robustness)
        // we'd link it here, but our MediaManager handles linking if productId is present.
        
        toast.success("Product created successfully");
        router.push("/admin/products");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save product");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-sage border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="mb-6">
        <Link href="/admin/products" className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-muted hover:text-brand-black transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back to Products
        </Link>
      </div>

      <form className="space-y-8" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* General Info */}
            <div className="bg-brand-white rounded-brand-lg border border-brand-ivory-dark overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-brand-ivory-dark bg-brand-ivory/20 flex items-center gap-2">
                <Layout className="w-4 h-4 text-brand-sage" />
                <h2 className="font-bold text-brand-black text-xs uppercase tracking-widest">General Information</h2>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-muted mb-2">Product Title</label>
                  <Input
                    required
                    placeholder="e.g. Sage Essentials Hoodie"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-muted mb-2">Description</label>
                  <textarea
                    required
                    rows={6}
                    placeholder="Provide a detailed description of the product..."
                    className="w-full rounded-brand border border-brand-ivory-dark bg-brand-white px-4 py-3 text-sm focus:border-brand-sage focus:outline-none focus:ring-1 focus:ring-brand-sage transition-all"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Media */}
            <div className="bg-brand-white rounded-brand-lg border border-brand-ivory-dark overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-brand-ivory-dark bg-brand-ivory/20 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-brand-sage" />
                <h2 className="font-bold text-brand-black text-xs uppercase tracking-widest">Product Images</h2>
              </div>
              <div className="p-6">
                <ProductMediaManager 
                  productId={productId} 
                  initialMedia={media} 
                  onMediaChange={setMedia} 
                />
              </div>
            </div>

            {/* Variants */}
            <div className="bg-brand-white rounded-brand-lg border border-brand-ivory-dark overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-brand-ivory-dark bg-brand-ivory/20 flex items-center gap-2">
                <Box className="w-4 h-4 text-brand-sage" />
                <h2 className="font-bold text-brand-black text-xs uppercase tracking-widest">Inventory & Variants</h2>
              </div>
              <div className="p-6">
                <ProductVariantManager 
                  initialVariants={variants} 
                  onVariantsChange={setVariants} 
                />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Status & Category */}
            <div className="bg-brand-white rounded-brand-lg border border-brand-ivory-dark overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-brand-ivory-dark bg-brand-ivory/20 flex items-center gap-2">
                <Settings className="w-4 h-4 text-brand-sage" />
                <h2 className="font-bold text-brand-black text-xs uppercase tracking-widest">Organization</h2>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-muted mb-2">Publishing Status</label>
                  <Select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED">Published</option>
                    <option value="ARCHIVED">Archived</option>
                  </Select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-muted mb-2">Primary Category</label>
                  <Select
                    required
                    value={form.categoryId}
                    onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <input 
                    type="checkbox" 
                    id="featured"
                    className="w-4 h-4 accent-brand-sage rounded border-brand-ivory-dark"
                    checked={form.featured}
                    onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                  />
                  <label htmlFor="featured" className="text-xs font-bold uppercase tracking-widest text-brand-charcoal cursor-pointer">Featured / Popular Product</label>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-brand-white rounded-brand-lg border border-brand-ivory-dark overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-brand-ivory-dark bg-brand-ivory/20 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-brand-sage" />
                <h2 className="font-bold text-brand-black text-xs uppercase tracking-widest">Pricing</h2>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-muted mb-2">Regular Price ($)</label>
                  <Input
                    required
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={form.price === "" ? "" : form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value ? Number(e.target.value) : "" })}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-muted mb-2">Discount Price ($)</label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Optional"
                    value={form.discountPrice || ""}
                    onChange={(e) => setForm({ ...form, discountPrice: e.target.value ? Number(e.target.value) : null })}
                  />
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="bg-brand-white rounded-brand-lg border border-brand-ivory-dark overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-brand-ivory-dark bg-brand-ivory/20 flex items-center gap-2">
                <Tag className="w-4 h-4 text-brand-sage" />
                <h2 className="font-bold text-brand-black text-xs uppercase tracking-widest">Discovery</h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-muted mb-2">Tags (Comma Separated)</label>
                  <Input
                    placeholder="e.g. new, premium, oversized"
                    value={form.tags}
                    onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-14 bg-brand-black text-brand-white hover:bg-brand-charcoal transition-colors uppercase tracking-[0.2em] font-bold text-xs flex items-center justify-center gap-3 shadow-elevated"
            >
              <Save className="w-4 h-4" /> 
              {isLoading ? "Synchronizing..." : productId ? "Save Changes" : "Publish to Store"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
