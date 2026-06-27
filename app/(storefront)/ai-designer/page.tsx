'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Wand2 } from 'lucide-react';
import { DesignPromptForm } from '../../../components/ai-designer/DesignPromptForm';
import { DesignPreview } from '../../../components/ai-designer/DesignPreview';
import { useAuthStore } from '../../../store/authStore';
import { useCartStore } from '../../../store/cartStore';
import api from '../../../lib/api';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

interface GeneratedDesign {
  id: string;
  prompt: string;
  revisedPrompt?: string;
  imageUrl: string;
  shirtColor: string;
  size: string;
}

export default function AiDesignerPage() {
  const { isAuthenticated } = useAuthStore();
  const { fetchCart } = useCartStore();
  const [selectedColor, setSelectedColor] = useState('Black');
  const [selectedSize, setSelectedSize] = useState('M');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedDesign, setGeneratedDesign] = useState<GeneratedDesign | null>(null);
  const [price, setPrice] = useState<number>(599);
  const [isEnabled, setIsEnabled] = useState(true);
  const [maxPromptLength, setMaxPromptLength] = useState(500);

  useEffect(() => {
    fetchAiSettings();
  }, []);

  const fetchAiSettings = async () => {
    try {
      const res = await api.get('/ai/settings');
      const settings = res.data.data;
      if (settings.ai_tshirt_price) setPrice(Number(settings.ai_tshirt_price));
      if (settings.ai_designer_enabled !== undefined) setIsEnabled(settings.ai_designer_enabled);
      if (settings.ai_max_prompt_length) setMaxPromptLength(Number(settings.ai_max_prompt_length));
    } catch {
      // Use defaults
    }
  };

  const handleGenerate = async (prompt: string, color: string, size: string) => {
    if (!isAuthenticated) {
      toast.error('Please sign in to use the AI Designer');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setAddedToCart(false);

    try {
      const res = await api.post('/ai/generate', {
        prompt,
        shirtColor: color,
        size,
      });

      setGeneratedDesign(res.data.data);
      setSelectedColor(color);
      setSelectedSize(size);
      toast.success('Design generated successfully!');
    } catch (err: any) {
      const message = err.response?.data?.error?.message || 'Failed to generate design. Please try again.';
      setError(message);
      toast.error(message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddToCart = async () => {
    if (!generatedDesign) return;

    setIsAddingToCart(true);
    try {
      await api.post('/ai/cart', {
        designId: generatedDesign.id,
        quantity: 1,
      });
      setAddedToCart(true);
      await fetchCart();
      toast.success('Custom t-shirt added to cart!');
    } catch (err: any) {
      const message = err.response?.data?.error?.message || 'Failed to add to cart';
      toast.error(message);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleGenerateAgain = () => {
    setGeneratedDesign(null);
    setAddedToCart(false);
    setError(null);
  };

  if (!isEnabled) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <Wand2 className="w-12 h-12 text-brand-muted mx-auto mb-4" />
        <h1 className="text-heading-lg font-heading text-brand-black mb-3">
          AI Designer Coming Soon
        </h1>
        <p className="text-brand-muted text-sm">
          Our AI-powered t-shirt designer is currently under maintenance. Check back soon!
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
      {/* Header */}
      <div className="text-center mb-12 md:mb-16">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-brand-sage/10 rounded-full mb-6"
        >
          <Sparkles className="w-4 h-4 text-brand-sage" />
          <span className="text-xs font-bold uppercase tracking-widest text-brand-sage">AI Powered</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-display-md md:text-display-lg font-display text-brand-black mb-4"
        >
          AI T-Shirt Designer
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-brand-muted text-body-md max-w-lg mx-auto"
        >
          Describe your vision and our AI will create a unique design just for you.
          Every shirt is one of a kind.
        </motion.p>
      </div>

      {/* Auth Gate */}
      {!isAuthenticated ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto text-center p-8 rounded-brand-lg border-2 border-dashed border-brand-ivory-dark"
        >
          <Wand2 className="w-10 h-10 text-brand-sage mx-auto mb-4" />
          <h2 className="font-heading text-heading-md text-brand-black mb-2">Sign In to Create</h2>
          <p className="text-sm text-brand-muted mb-6">
            You need an account to use the AI Designer and save your creations.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-8 py-3 bg-brand-sage text-white rounded-brand font-medium text-sm hover:bg-brand-sage-dark transition-colors"
          >
            Sign In
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left: Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="sticky top-28">
              <div className="bg-white border border-brand-ivory-dark rounded-brand-lg p-6 md:p-8 shadow-card">
                <h2 className="font-heading text-heading-md text-brand-black mb-6 flex items-center gap-2">
                  <Wand2 className="w-5 h-5 text-brand-sage" />
                  Create Your Design
                </h2>
                <DesignPromptForm
                  onGenerate={handleGenerate}
                  isGenerating={isGenerating}
                  selectedColor={selectedColor}
                  onColorChange={setSelectedColor}
                  selectedSize={selectedSize}
                  onSizeChange={setSelectedSize}
                  error={error}
                  maxPromptLength={maxPromptLength}
                />
              </div>
            </div>
          </motion.div>

          {/* Right: Preview */}
          <div>
            <AnimatePresence mode="wait">
              {generatedDesign ? (
                <DesignPreview
                  key="preview"
                  imageUrl={generatedDesign.imageUrl}
                  prompt={generatedDesign.prompt}
                  revisedPrompt={generatedDesign.revisedPrompt}
                  selectedColor={selectedColor}
                  selectedSize={selectedSize}
                  price={price}
                  onAddToCart={handleAddToCart}
                  onGenerateAgain={handleGenerateAgain}
                  isAddingToCart={isAddingToCart}
                  addedToCart={addedToCart}
                />
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center min-h-[500px] bg-gradient-to-br from-brand-ivory-50 to-brand-ivory-light rounded-brand-lg border-2 border-dashed border-brand-ivory-dark p-8"
                >
                  {isGenerating ? (
                    <div className="text-center">
                      <div className="relative w-24 h-24 mx-auto mb-6">
                        <div className="absolute inset-0 rounded-full border-4 border-brand-ivory-dark" />
                        <div className="absolute inset-0 rounded-full border-4 border-t-brand-sage animate-spin" />
                        <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-brand-sage animate-pulse" />
                      </div>
                      <p className="font-heading text-heading-sm text-brand-black mb-2">Creating your design...</p>
                      <p className="text-xs text-brand-muted">Our AI is crafting your unique artwork</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-brand-ivory flex items-center justify-center">
                        <Wand2 className="w-8 h-8 text-brand-muted" />
                      </div>
                      <p className="font-heading text-heading-sm text-brand-charcoal mb-2">
                        Your design preview
                      </p>
                      <p className="text-xs text-brand-muted max-w-xs">
                        Fill in the form and click Generate to see your custom t-shirt design appear here
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
