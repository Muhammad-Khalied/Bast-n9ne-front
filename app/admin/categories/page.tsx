"use client";

import { useEffect, useState } from "react";
import api from "../../../lib/api";
import Link from "next/link";
import Image from "next/image";
import { Plus, Edit2, Trash2, Layout, Package, CheckCircle, XCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import { DEFAULT_CATEGORY_IMAGE } from "../../../lib/constants";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/admin/categories");
      setCategories(response.data.data ?? []);
    } catch (error) {
      toast.error("Failed to fetch categories");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category? This might affect products linked to it.")) return;
    try {
      await api.delete(`/admin/categories/${id}`);
      toast.success("Category deleted");
      fetchCategories();
    } catch (error) {
      toast.error("Failed to delete category");
    }
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-brand-black">Categories</h1>
          <p className="text-sm text-brand-muted">Organize your products and storefront navigation</p>
        </div>
        <Link href="/admin/categories/new">
          <button className="flex items-center gap-2 bg-brand-black text-brand-white px-5 py-2.5 rounded-brand font-bold text-xs uppercase tracking-widest hover:bg-brand-charcoal transition-colors">
            <Plus className="w-4 h-4" /> Add Category
          </button>
        </Link>
      </div>

      <div className="bg-brand-white rounded-brand-lg shadow-sm border border-brand-ivory-dark overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-brand-ivory text-[10px] font-bold uppercase tracking-[0.2em] text-brand-muted border-b border-brand-ivory-dark">
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Slug</th>
                <th className="px-6 py-4">Products</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-ivory">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-sm text-brand-muted">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-6 h-6 border-2 border-brand-sage border-t-transparent rounded-full animate-spin" />
                      Loading categories...
                    </div>
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-sm text-brand-muted">No categories found.</td>
                </tr>
              ) : categories.map((category) => (
                <tr key={category.id} className="hover:bg-brand-ivory/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded overflow-hidden bg-brand-ivory flex items-center justify-center text-brand-sage flex-shrink-0">
                        {category.image ? (
                          <Image src={category.image} alt={category.name} fill className="object-cover" />
                        ) : (
                          <Image src={DEFAULT_CATEGORY_IMAGE} alt={category.name} fill className="object-cover" />
                        )}
                      </div>
                      <p className="text-sm font-bold text-brand-black">{category.name}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <code className="text-[10px] bg-brand-ivory px-1.5 py-0.5 rounded text-brand-charcoal uppercase tracking-wider">{category.slug}</code>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs text-brand-charcoal flex items-center gap-1">
                      <Package className="w-3.5 h-3.5 text-brand-muted" />
                      {category._count?.products || 0} items
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    {category.isActive ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-status-success uppercase tracking-widest">
                        <CheckCircle className="w-3 h-3" /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-brand-muted uppercase tracking-widest">
                        <XCircle className="w-3 h-3" /> Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/categories/${category.id}/edit`}>
                        <button title="Edit" className="p-2 text-brand-muted hover:text-brand-sage transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </Link>
                      <button 
                        onClick={() => handleDelete(category.id)}
                        title="Delete" 
                        className="p-2 text-brand-muted hover:text-status-error transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
