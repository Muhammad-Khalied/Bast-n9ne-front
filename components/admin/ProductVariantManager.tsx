"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Package } from "lucide-react";
import { Input } from "../ui";
import { PRODUCT_COLORS } from "../../lib/colors";

interface ProductVariantManagerProps {
  initialVariants?: any[];
  onVariantsChange?: (variants: any[]) => void;
}

export function ProductVariantManager({ initialVariants = [], onVariantsChange }: ProductVariantManagerProps) {
  const [variants, setVariants] = useState<any[]>(initialVariants);

  useEffect(() => {
    setVariants(initialVariants);
  }, [initialVariants]);

  const addVariant = () => {
    const newVariants = [...variants, { size: "", color: "", colorHex: "#000000", sku: "", stock: 0 }];
    setVariants(newVariants);
    onVariantsChange?.(newVariants);
  };

  const updateVariant = (index: number, field: string, value: any) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setVariants(newVariants);
    onVariantsChange?.(newVariants);
  };

  const removeVariant = (index: number) => {
    const newVariants = variants.filter((_, i) => i !== index);
    setVariants(newVariants);
    onVariantsChange?.(newVariants);
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-brand-ivory/50 text-[9px] font-bold uppercase tracking-widest text-brand-muted">
              <th className="px-4 py-2 border border-brand-ivory-dark">Size</th>
              <th className="px-4 py-2 border border-brand-ivory-dark">Color Name</th>
              <th className="px-4 py-2 border border-brand-ivory-dark">SKU</th>
              <th className="px-4 py-2 border border-brand-ivory-dark">Stock</th>
              <th className="px-4 py-2 border border-brand-ivory-dark text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-ivory">
            {variants.map((v, index) => (
              <tr key={index}>
                <td className="p-2 border border-brand-ivory-dark">
                  <input 
                    className="w-full bg-transparent text-xs focus:outline-none" 
                    placeholder="e.g. M"
                    value={v.size}
                    onChange={(e) => updateVariant(index, "size", e.target.value)}
                  />
                </td>
                <td className="p-2 border border-brand-ivory-dark">
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer flex-shrink-0 w-5 h-5 rounded-full overflow-hidden border border-brand-ivory-dark shadow-sm relative" title="Pick a custom color">
                      <input
                        type="color"
                        className="absolute inset-[-50%] w-[200%] h-[200%] cursor-pointer opacity-0"
                        value={v.colorHex || PRODUCT_COLORS.find(c => c.name.toLowerCase() === (v.color || "").toLowerCase())?.hex || "#000000"}
                        onChange={(e) => updateVariant(index, "colorHex", e.target.value)}
                      />
                      <div className="w-full h-full pointer-events-none" style={{ backgroundColor: v.colorHex || PRODUCT_COLORS.find(c => c.name.toLowerCase() === (v.color || "").toLowerCase())?.hex || "#000000" }} />
                    </label>
                    <input 
                      className="w-full bg-transparent text-xs focus:outline-none"
                      placeholder="Color Name (e.g. Neon Green)"
                      value={v.color}
                      onChange={(e) => {
                        const newColor = e.target.value;
                        const matched = PRODUCT_COLORS.find(c => c.name.toLowerCase() === newColor.toLowerCase());
                        if (matched) {
                          const newVariants = [...variants];
                          newVariants[index] = { ...newVariants[index], color: newColor, colorHex: matched.hex };
                          setVariants(newVariants);
                          onVariantsChange?.(newVariants);
                        } else {
                          updateVariant(index, "color", newColor);
                        }
                      }}
                    />
                  </div>
                </td>
                <td className="p-2 border border-brand-ivory-dark">
                  <input 
                    className="w-full bg-transparent text-xs focus:outline-none" 
                    placeholder="Auto-generated"
                    value={v.sku}
                    onChange={(e) => updateVariant(index, "sku", e.target.value)}
                  />
                </td>
                <td className="p-2 border border-brand-ivory-dark">
                  <input 
                    type="number"
                    className="w-full bg-transparent text-xs focus:outline-none" 
                    value={v.stock}
                    onChange={(e) => updateVariant(index, "stock", Number(e.target.value))}
                  />
                </td>
                <td className="p-2 border border-brand-ivory-dark text-right">
                  <button 
                    onClick={() => removeVariant(index)}
                    className="p-1 text-brand-muted hover:text-status-error transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {variants.length === 0 && (
        <div className="py-8 text-center bg-brand-ivory/20 border border-dashed border-brand-ivory-dark rounded-brand">
          <Package className="w-8 h-8 text-brand-ivory-dark mx-auto mb-2" />
          <p className="text-xs text-brand-muted">No variants added yet. Products need at least one variant for customers to purchase.</p>
        </div>
      )}

      <button 
        type="button"
        onClick={addVariant}
        className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-brand-sage hover:text-brand-sage-dark transition-colors"
      >
        <Plus className="w-3.5 h-3.5" /> Add Variant (Size/Color)
      </button>
    </div>
  );
}
