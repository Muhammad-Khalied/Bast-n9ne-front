"use client";

import { useEffect, useState } from "react";
import api from "../../../lib/api";
import Link from "next/link";
import { Plus, Edit2, Trash2, ExternalLink } from "lucide-react";
import { formatPrice } from "../../../lib/utils";
import { PriceDisplay } from "../../../components/shared/PriceDisplay";
import { ImageWithFallback } from "../../../components/shared/ImageWithFallback";
import { toast } from "react-hot-toast";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/admin/products");
      setProducts(response.data.data.products ?? []);
    } catch (error) {
      toast.error("Failed to fetch products");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await api.delete(`/admin/products/${id}`);
      toast.success("Product deleted");
      fetchProducts();
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-brand-black">Products</h1>
          <p className="text-sm text-brand-muted">Manage your store inventory and details</p>
        </div>
        <Link href="/admin/products/new">
          <button className="flex items-center gap-2 bg-brand-black text-brand-white px-5 py-2.5 rounded-brand font-bold text-xs uppercase tracking-widest hover:bg-brand-charcoal transition-colors">
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </Link>
      </div>

      <div className="bg-brand-white rounded-brand-lg shadow-sm border border-brand-ivory-dark overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-brand-ivory text-[10px] font-bold uppercase tracking-[0.2em] text-brand-muted border-b border-brand-ivory-dark">
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-ivory">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-sm text-brand-muted">Loading products...</td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-sm text-brand-muted">No products found. Add your first product!</td>
                </tr>
              ) : products.map((product) => (
                <tr key={product.id} className="hover:bg-brand-ivory/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="relative w-12 h-16 bg-brand-ivory flex-shrink-0">
                        {product.media?.[0]?.url && (
                          <ImageWithFallback src={product.media[0].url} alt={product.title} fill className="object-cover" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-brand-black line-clamp-1">{product.title}</p>
                        <p className="text-[10px] text-brand-muted uppercase tracking-wider">{product.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-brand-charcoal">{product.category?.name || "N/A"}</span>
                  </td>
                  <td className="px-6 py-4">
                    <PriceDisplay price={Number(product.price)} discountPrice={product.discountPrice} className="text-xs" />
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                      product.status === "PUBLISHED" ? "bg-status-success/10 text-status-success" : "bg-brand-muted/10 text-brand-muted"
                    }`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/products/${product.slug}`} target="_blank">
                        <button title="View on site" className="p-2 text-brand-muted hover:text-brand-black transition-colors">
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </Link>
                      <Link href={`/admin/products/${product.id}/edit`}>
                        <button title="Edit product" className="p-2 text-brand-muted hover:text-brand-sage transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </Link>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        title="Delete product" 
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
