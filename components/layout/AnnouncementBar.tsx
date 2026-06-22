"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useSettings } from "../../hooks/useSettings";

export function AnnouncementBar() {
  const { settings, isLoading } = useSettings();

  if (isLoading || settings.announcement_active === false) return null;

  const announcement = settings.announcement_text || "Fixed shipping rate of EGP 150";

  return (
    <div className="bg-brand-sage py-2 text-center text-xs font-semibold uppercase tracking-widest text-brand-white h-8 flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.3 }}
        >
          {announcement}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
