'use client';

import { useState } from 'react';
import { Sparkles, Loader2, AlertCircle } from 'lucide-react';

const TSHIRT_COLORS = [
  { name: 'White', hex: '#FFFFFF', border: true },
  { name: 'Black', hex: '#1a1a1a' },
  { name: 'Navy', hex: '#1B2A4A' },
  { name: 'Gray', hex: '#6B7280' },
  { name: 'Red', hex: '#DC2626' },
];

const TSHIRT_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

interface DesignPromptFormProps {
  onGenerate: (prompt: string, color: string, size: string) => Promise<void>;
  isGenerating: boolean;
  selectedColor: string;
  onColorChange: (color: string) => void;
  selectedSize: string;
  onSizeChange: (size: string) => void;
  error?: string | null;
  maxPromptLength?: number;
}

export function DesignPromptForm({
  onGenerate,
  isGenerating,
  selectedColor,
  onColorChange,
  selectedSize,
  onSizeChange,
  error,
  maxPromptLength = 500,
}: DesignPromptFormProps) {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim().length < 10) return;
    await onGenerate(prompt.trim(), selectedColor, selectedSize);
  };

  const charCount = prompt.length;
  const isValid = charCount >= 10 && charCount <= maxPromptLength;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Prompt */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-brand-charcoal mb-3">
          Describe Your Design
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value.slice(0, maxPromptLength))}
          placeholder={`Describe your dream t-shirt design...\n\nExample: A futuristic cyberpunk dragon in neon blue with Japanese typography.`}
          className="w-full px-4 py-4 border border-brand-ivory-dark rounded-brand-lg focus:outline-none focus:border-brand-sage focus:ring-1 focus:ring-brand-sage/20 text-sm resize-none bg-white transition-all duration-200 placeholder:text-brand-muted/60"
          rows={5}
          disabled={isGenerating}
        />
        <div className="flex justify-between items-center mt-2">
          <p className="text-[11px] text-brand-muted">
            {charCount < 10 ? `${10 - charCount} more characters needed` : 'Ready to generate'}
          </p>
          <p className={`text-[11px] font-mono ${charCount > maxPromptLength ? 'text-status-error' : 'text-brand-muted'}`}>
            {charCount}/{maxPromptLength}
          </p>
        </div>
      </div>

      {/* T-Shirt Color */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-brand-charcoal mb-3">
          T-Shirt Color
        </label>
        <div className="flex flex-wrap gap-3">
          {TSHIRT_COLORS.map((color) => (
            <button
              type="button"
              key={color.name}
              onClick={() => onColorChange(color.name)}
              disabled={isGenerating}
              className={`group relative flex items-center gap-2 px-4 py-2.5 rounded-brand-lg border-2 transition-all duration-200 ${
                selectedColor === color.name
                  ? 'border-brand-sage bg-brand-sage/5 shadow-sm'
                  : 'border-brand-ivory-dark hover:border-brand-sage-light'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <span
                className={`w-5 h-5 rounded-full inline-block flex-shrink-0 ${color.border ? 'border border-brand-ivory-dark' : ''}`}
                style={{ backgroundColor: color.hex }}
              />
              <span className="text-xs font-medium text-brand-charcoal">{color.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* T-Shirt Size */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-brand-charcoal mb-3">
          Size
        </label>
        <div className="flex flex-wrap gap-2">
          {TSHIRT_SIZES.map((size) => (
            <button
              type="button"
              key={size}
              onClick={() => onSizeChange(size)}
              disabled={isGenerating}
              className={`px-4 py-2 rounded-brand-lg border-2 text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                selectedSize === size
                  ? 'border-brand-sage bg-brand-sage text-white'
                  : 'border-brand-ivory-dark text-brand-charcoal hover:border-brand-sage-light'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-start gap-3 p-4 rounded-brand-lg bg-status-error/5 border border-status-error/20">
          <AlertCircle className="w-4 h-4 text-status-error flex-shrink-0 mt-0.5" />
          <p className="text-sm text-status-error">{error}</p>
        </div>
      )}

      {/* Generate Button */}
      <button
        type="submit"
        disabled={!isValid || isGenerating}
        className="w-full flex items-center justify-center gap-3 py-4 bg-brand-black text-white rounded-brand-lg font-bold text-sm uppercase tracking-widest hover:bg-brand-charcoal transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed group"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Generating artwork...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span>Generate Design</span>
          </>
        )}
      </button>

      {isGenerating && (
        <p className="text-center text-xs text-brand-muted animate-pulse">
          This may take 10-30 seconds. Please don&apos;t close this page.
        </p>
      )}
    </form>
  );
}
