'use client';

import { useState, useMemo } from 'react';
import { Plus, Trash2, Wand2, ToggleLeft, ToggleRight } from 'lucide-react';

interface Variant {
  id?: string;
  size: string;
  color: string;
  sku: string;
  stock: number;
  isActive: boolean;
}

interface VariantEditorProps {
  variants: Variant[];
  sizes: string[];
  colors: { name: string; hex: string }[];
  onChange: (variants: Variant[]) => void;
  productSlug?: string;
}

function generateSKU(slug: string, size: string, color: string) {
  const s = slug.substring(0, 8).toUpperCase().replace(/-/g, '');
  const sz = size.substring(0, 3).toUpperCase();
  const c = color.substring(0, 3).toUpperCase();
  return `${s}-${sz}-${c}`;
}

export default function VariantEditor({ variants, sizes, colors, onChange, productSlug = 'PROD' }: VariantEditorProps) {
  const [localVariants, setLocalVariants] = useState<Variant[]>(variants);

  const updateAndNotify = (updated: Variant[]) => {
    setLocalVariants(updated);
    onChange(updated);
  };

  const handleAutoGenerate = () => {
    if (sizes.length === 0 || colors.length === 0) return;

    const existing = new Set(localVariants.map((v) => `${v.size}-${v.color}`));
    const newVariants: Variant[] = [...localVariants];

    sizes.forEach((size) => {
      colors.forEach((color) => {
        const key = `${size}-${color.name}`;
        if (!existing.has(key)) {
          newVariants.push({
            size,
            color: color.name,
            sku: generateSKU(productSlug, size, color.name),
            stock: 0,
            isActive: true,
          });
        }
      });
    });

    updateAndNotify(newVariants);
  };

  const addSingleVariant = () => {
    updateAndNotify([
      ...localVariants,
      { size: '', color: '', sku: '', stock: 0, isActive: true },
    ]);
  };

  const removeVariant = (index: number) => {
    const updated = localVariants.filter((_, i) => i !== index);
    updateAndNotify(updated);
  };

  const updateVariant = (index: number, field: keyof Variant, value: any) => {
    const updated = [...localVariants];
    (updated[index] as any)[field] = value;

    // Auto-generate SKU when size or color changes
    if ((field === 'size' || field === 'color') && updated[index].size && updated[index].color) {
      updated[index].sku = generateSKU(productSlug, updated[index].size, updated[index].color);
    }

    updateAndNotify(updated);
  };

  const totalStock = useMemo(
    () => localVariants.reduce((sum, v) => sum + (v.isActive ? v.stock : 0), 0),
    [localVariants]
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium text-brand-black text-sm">Variants</h3>
          <p className="text-xs text-brand-muted mt-0.5">
            {localVariants.length} variant{localVariants.length !== 1 ? 's' : ''} · {totalStock} total stock
          </p>
        </div>
        <div className="flex gap-2">
          {sizes.length > 0 && colors.length > 0 && (
            <button
              type="button"
              onClick={handleAutoGenerate}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-sage/10 text-brand-sage rounded-brand text-xs font-medium hover:bg-brand-sage/20 transition-colors"
            >
              <Wand2 className="w-3.5 h-3.5" /> Auto Generate
            </button>
          )}
          <button
            type="button"
            onClick={addSingleVariant}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-brand-ivory-dark text-brand-charcoal rounded-brand text-xs font-medium hover:bg-brand-ivory-light transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Add Variant
          </button>
        </div>
      </div>

      {localVariants.length === 0 ? (
        <div className="text-center py-8 border border-dashed border-brand-ivory-dark rounded-brand-lg">
          <p className="text-sm text-brand-muted">No variants yet.</p>
          <p className="text-xs text-brand-muted mt-1">
            {sizes.length > 0 && colors.length > 0
              ? 'Click "Auto Generate" to create all size × color combinations'
              : 'Add sizes and colors first, then generate variants'}
          </p>
        </div>
      ) : (
        <div className="border border-brand-ivory-dark rounded-brand-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-brand-ivory-50">
                  <th className="px-3 py-2.5 text-left text-xs font-medium text-brand-muted uppercase">Size</th>
                  <th className="px-3 py-2.5 text-left text-xs font-medium text-brand-muted uppercase">Color</th>
                  <th className="px-3 py-2.5 text-left text-xs font-medium text-brand-muted uppercase">SKU</th>
                  <th className="px-3 py-2.5 text-left text-xs font-medium text-brand-muted uppercase w-24">Stock</th>
                  <th className="px-3 py-2.5 text-center text-xs font-medium text-brand-muted uppercase w-16">Active</th>
                  <th className="px-3 py-2.5 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-ivory-dark">
                {localVariants.map((v, i) => (
                  <tr key={v.id || i} className={`${!v.isActive ? 'opacity-50' : ''} hover:bg-brand-ivory-50 transition-colors`}>
                    <td className="px-3 py-2">
                      {sizes.length > 0 ? (
                        <select
                          value={v.size}
                          onChange={(e) => updateVariant(i, 'size', e.target.value)}
                          className="w-full px-2 py-1.5 border border-brand-ivory-dark rounded text-sm focus:outline-none focus:border-brand-sage"
                        >
                          <option value="">Select</option>
                          {sizes.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          value={v.size}
                          onChange={(e) => updateVariant(i, 'size', e.target.value)}
                          placeholder="e.g. M"
                          className="w-full px-2 py-1.5 border border-brand-ivory-dark rounded text-sm focus:outline-none focus:border-brand-sage"
                        />
                      )}
                    </td>
                    <td className="px-3 py-2">
                      {colors.length > 0 ? (
                        <select
                          value={v.color}
                          onChange={(e) => updateVariant(i, 'color', e.target.value)}
                          className="w-full px-2 py-1.5 border border-brand-ivory-dark rounded text-sm focus:outline-none focus:border-brand-sage"
                        >
                          <option value="">Select</option>
                          {colors.map((c) => (
                            <option key={c.name} value={c.name}>{c.name}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          value={v.color}
                          onChange={(e) => updateVariant(i, 'color', e.target.value)}
                          placeholder="e.g. Black"
                          className="w-full px-2 py-1.5 border border-brand-ivory-dark rounded text-sm focus:outline-none focus:border-brand-sage"
                        />
                      )}
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        value={v.sku}
                        onChange={(e) => updateVariant(i, 'sku', e.target.value)}
                        className="w-full px-2 py-1.5 border border-brand-ivory-dark rounded text-xs font-mono focus:outline-none focus:border-brand-sage"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        value={v.stock}
                        onChange={(e) => updateVariant(i, 'stock', Math.max(0, Number(e.target.value)))}
                        min={0}
                        className="w-full px-2 py-1.5 border border-brand-ivory-dark rounded text-sm text-center focus:outline-none focus:border-brand-sage"
                      />
                    </td>
                    <td className="px-3 py-2 text-center">
                      <button
                        type="button"
                        onClick={() => updateVariant(i, 'isActive', !v.isActive)}
                        className="mx-auto"
                      >
                        {v.isActive ? (
                          <ToggleRight className="w-6 h-6 text-brand-sage" />
                        ) : (
                          <ToggleLeft className="w-6 h-6 text-brand-muted" />
                        )}
                      </button>
                    </td>
                    <td className="px-3 py-2">
                      <button
                        type="button"
                        onClick={() => removeVariant(i)}
                        className="p-1 text-brand-muted hover:text-status-error transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
