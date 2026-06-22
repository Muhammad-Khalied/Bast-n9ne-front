"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { fadeInUp } from "../../lib/animations";
import { Button } from "../ui/Button";
import { useSettings } from "../../hooks/useSettings";

export function EditorialSection() {
  const { settings, isLoading } = useSettings();

  if (isLoading) return <div className="h-[600px] bg-brand-ivory animate-pulse" />;

  const editorialImage = settings.editorial_image || "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1000&auto=format&fit=crop";

  return (
    <section className="py-section-lg overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-center">
          {/* Image Side */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative aspect-[4/5] w-full"
          >
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url("${editorialImage}")` }}
            />
            <div className="absolute -bottom-8 -right-8 w-2/3 aspect-square bg-brand-sage-500 -z-10 hidden md:block" />
          </motion.div>

          {/* Text Side */}
          <motion.div 
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="flex flex-col justify-center max-w-lg"
          >
            <p className="text-overline text-brand-sage uppercase tracking-widest mb-4">
              {settings.editorial_overline || "The Design Philosophy"}
            </p>
            <h2 className="text-display-md font-display text-brand-black leading-tight mb-6 whitespace-pre-line">
              {settings.editorial_title || "REDEFINING \n THE BASICS."}
            </h2>
            <p className="text-body-lg text-brand-charcoal mb-8 whitespace-pre-line">
              {settings.editorial_description || "Every piece in the Bast n9ne collection is meticulously crafted to balance form and function. We believe that true luxury lies in the details—the weight of the cotton, the precision of the cut, and the durability of the stitch."}
            </p>
            <div>
              <Link href="/about">
                <Button className="bg-transparent border border-brand-black text-brand-black hover:bg-brand-black hover:text-brand-white transition-colors duration-normal px-8 py-3 text-sm font-semibold tracking-wide uppercase">
                  {settings.editorial_button_text || "Discover Our Story"}
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
