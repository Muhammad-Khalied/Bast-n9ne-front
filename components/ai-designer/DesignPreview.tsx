'use client';

import { motion } from 'framer-motion';
import { ShoppingBag, RefreshCw, Loader2, Check } from 'lucide-react';
import { TShirtMockup } from './TShirtMockup';
import { formatPrice } from '@/lib/utils';

interface DesignPreviewProps {
  imageUrl: string;
  prompt: string;
  revisedPrompt?: string;
  selectedColor: string;
  selectedSize: string;
  price: number;
  onAddToCart: () => Promise<void>;
  onGenerateAgain: () => void;
  isAddingToCart: boolean;
  addedToCart: boolean;
}

export function DesignPreview({
  imageUrl,
  prompt,
  revisedPrompt,
  selectedColor,
  selectedSize,
  price,
  onAddToCart,
  onGenerateAgain,
  isAddingToCart,
  addedToCart,
}: DesignPreviewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Mockup Preview */}
      <div className="bg-gradient-to-br from-brand-ivory-50 to-brand-ivory-light rounded-brand-lg p-8 flex items-center justify-center">
        <TShirtMockup
          color={selectedColor}
          designImageUrl={imageUrl}
          className="w-full max-w-sm"
        />
      </div>

      {/* Design Details */}
      <div className="space-y-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-brand-muted mb-1">Your Prompt</p>
          <p className="text-sm text-brand-charcoal leading-relaxed">{prompt}</p>
        </div>

        {revisedPrompt && revisedPrompt !== prompt && (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-brand-muted mb-1">AI Interpretation</p>
            <p className="text-xs text-brand-muted leading-relaxed italic">{revisedPrompt}</p>
          </div>
        )}

        <div className="flex items-center gap-4 text-xs text-brand-charcoal">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full inline-block border border-brand-ivory-dark"
              style={{
                backgroundColor:
                  selectedColor === 'White' ? '#FFFFFF' :
                  selectedColor === 'Black' ? '#1a1a1a' :
                  selectedColor === 'Navy' ? '#1B2A4A' :
                  selectedColor === 'Gray' ? '#6B7280' : '#DC2626'
              }}
            />
            {selectedColor}
          </span>
          <span>·</span>
          <span>Size {selectedSize}</span>
          <span>·</span>
          <span className="font-bold text-brand-black">{formatPrice(price)}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onAddToCart}
          disabled={isAddingToCart || addedToCart}
          className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-brand-lg font-bold text-sm uppercase tracking-widest transition-all duration-300 ${
            addedToCart
              ? 'bg-status-success text-white'
              : 'bg-brand-sage text-white hover:bg-brand-sage-dark'
          } disabled:cursor-not-allowed`}
        >
          {isAddingToCart ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Adding...
            </>
          ) : addedToCart ? (
            <>
              <Check className="w-4 h-4" />
              Added to Cart
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" />
              Add Custom T-Shirt — {formatPrice(price)}
            </>
          )}
        </button>

        <button
          onClick={onGenerateAgain}
          className="flex items-center justify-center gap-2 py-3.5 px-6 rounded-brand-lg border-2 border-brand-ivory-dark text-brand-charcoal font-bold text-sm uppercase tracking-widest hover:bg-brand-ivory-light transition-all duration-200"
        >
          <RefreshCw className="w-4 h-4" />
          Generate Again
        </button>
      </div>
    </motion.div>
  );
}
