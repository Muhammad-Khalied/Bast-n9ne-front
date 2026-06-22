"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ImageWithFallback } from "../shared/ImageWithFallback";

interface ProductGalleryProps {
  images: { url: string; altText?: string }[];
}

export function ProductGallery({ images }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-[3/4] w-full bg-brand-ivory-light flex items-center justify-center text-brand-muted">
        No images available
      </div>
    );
  }

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {/* Thumbnails */}
      <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto no-scrollbar pb-2 md:pb-0 md:w-24">
        {images.map((image, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={`relative flex-shrink-0 w-20 h-24 md:w-full md:h-32 bg-brand-ivory-light overflow-hidden transition-all duration-200 border-2 ${
              activeIndex === idx ? "border-brand-sage opacity-100" : "border-transparent opacity-60 hover:opacity-100"
            }`}
          >
            <ImageWithFallback src={image.url} alt={image.altText || `Thumbnail ${idx + 1}`} fill className="object-cover" />
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div className="relative flex-1 aspect-[3/4] bg-brand-ivory-light overflow-hidden cursor-zoom-in group">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <ImageWithFallback 
              src={images[activeIndex].url} 
              alt={images[activeIndex].altText || "Product Image"} 
              fill 
              className="object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.15]" 
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
