'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, Package, Save, Loader2, Filter } from 'lucide-react';
import api from '@/lib/api';

interface VariantRow {
  id: string;
  productTitle: string;
  size: string;
  color: string;
  sku: string;
  stock: number;
  isActive: boolean;
}

export function InventoryTable() {
  const [variants, setVariants] = useState<VariantRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStock, setEditStock] = useState<number>(0);
  const [saving, setSaving] = useState(false);
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/inventory');
      setVariants(res.data.data || []);
    } catch {
      // fallback
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveStock = async (variantId: string) => {
    setSaving(true);
    try {
      const current = variants.find((v) => v.id === variantId);
      const diff = editStock - (current?.stock || 0);

      if (diff === 0) {
        setEditingId(null);
        return;
      }

      await api.post('/inventory/adjust', {
        variantId,
        quantity: diff,
        reason: 'Manual adjustment',
      });
      await fetchInventory();
      setEditingId(null);
    } catch {
      // handle error
    } finally {
      setSaving(false);
    }
  };

  const getStockColor = (stock: number) => {
    if (stock <= 0) return 'text-status-error bg-status-error/10';
    if (stock <= 5) return 'text-yellow-700 bg-yellow-50';
    if (stock <= 10) return 'text-yellow-600 bg-yellow-50/50';
    return 'text-status-success bg-status-success/10';
  };

  const filteredVariants = showLowStockOnly ? variants.filter((v) => v.stock <= 5) : variants;

  if (isLoading) {
    return (
      <div className="bg-white border border-brand-ivory-dark rounded-brand-lg p-6">
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-12 bg-brand-ivory-light rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-brand-ivory-dark rounded-brand-lg overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-brand-ivory-dark">
        <h3 className="font-heading text-heading-sm text-brand-black flex items-center gap-2">
          <Package className="w-5 h-5 text-brand-sage" /> Inventory
        </h3>
        <button
          onClick={() => setShowLowStockOnly(!showLowStockOnly)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-brand text-xs font-medium transition-all ${
            showLowStockOnly
              ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
              : 'bg-brand-ivory-light text-brand-muted hover:text-brand-charcoal'
          }`}
        >
          <Filter className="w-3 h-3" />
          {showLowStockOnly ? 'Showing Low Stock' : 'Filter Low Stock'}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-brand-ivory-50">
              <th className="px-4 py-3 text-left text-xs font-medium text-brand-muted uppercase">Product</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-brand-muted uppercase">Size</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-brand-muted uppercase">Color</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-brand-muted uppercase">SKU</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-brand-muted uppercase">Stock</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-brand-muted uppercase">Status</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-brand-muted uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-ivory-dark">
            {filteredVariants.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-brand-muted text-sm">
                  {showLowStockOnly ? 'No low stock items' : 'No inventory data'}
                </td>
              </tr>
            ) : (
              filteredVariants.map((v) => (
                <tr key={v.id} className="hover:bg-brand-ivory-50 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-brand-black max-w-[200px] truncate">
                    {v.productTitle}
                  </td>
                  <td className="px-4 py-3 text-sm text-brand-charcoal">{v.size}</td>
                  <td className="px-4 py-3 text-sm text-brand-charcoal">{v.color}</td>
                  <td className="px-4 py-3 text-xs font-mono text-brand-muted">{v.sku}</td>
                  <td className="px-4 py-3">
                    {editingId === v.id ? (
                      <input
                        type="number"
                        value={editStock}
                        onChange={(e) => setEditStock(Number(e.target.value))}
                        className="w-20 px-2 py-1 border border-brand-sage rounded text-sm"
                        min={0}
                        autoFocus
                      />
                    ) : (
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStockColor(v.stock)}`}>
                        {v.stock <= 5 && v.stock > 0 && <AlertTriangle className="w-3 h-3" />}
                        {v.stock}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${v.isActive ? 'bg-status-success/10 text-status-success' : 'bg-brand-ivory-light text-brand-muted'}`}>
                      {v.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {editingId === v.id ? (
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleSaveStock(v.id)}
                          disabled={saving}
                          className="p-1.5 bg-brand-sage text-white rounded hover:bg-brand-sage-dark transition-colors"
                        >
                          {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="p-1.5 text-brand-muted hover:text-brand-charcoal transition-colors text-xs"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => { setEditingId(v.id); setEditStock(v.stock); }}
                        className="text-xs text-brand-sage hover:text-brand-sage-dark transition-colors font-medium"
                      >
                        Edit Stock
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
