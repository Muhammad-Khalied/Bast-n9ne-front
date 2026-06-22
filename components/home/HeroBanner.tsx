"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { Button } from "../ui/Button";
import { useSettings } from "../../hooks/useSettings";

export function HeroBanner() {
  const { settings, isLoading } = useSettings();
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLoading) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.fromTo(
        textRef.current?.children ? Array.from(textRef.current.children) : [],
        { opacity: 0, x: -40 },
        { opacity: 1, x: 0, duration: 0.9, stagger: 0.15, ease: "power3.out" }
      ).fromTo(
        imageRef.current,
        { opacity: 0, scale: 1.15 },
        { opacity: 1, scale: 1, duration: 1.4, ease: "power2.out" },
        "-=0.8"
      );
    }, containerRef);

    return () => ctx.revert();
  }, [isLoading]);

  if (isLoading) return <div className="h-[85vh] bg-brand-ivory animate-pulse" />;

  const heroImage = settings.hero_image || "/Home.png";

  return (
    <section ref={containerRef} className="relative min-h-0 lg:min-h-[85vh] w-full bg-brand-ivory flex flex-col lg:flex-row items-stretch overflow-hidden">
      {/* Text Content */}
      <div className="relative z-10 w-full lg:w-1/2 flex items-center justify-center px-6 py-12 lg:py-16 lg:px-12 xl:px-24">
        <div ref={textRef} className="space-y-6 lg:space-y-8 flex flex-col items-start w-full max-w-lg pt-4 lg:pt-0">
          <p className="text-overline text-brand-sage uppercase tracking-widest font-semibold">
            {settings.hero_overline || "New Collection 2026"}
          </p>
          <h1 className="text-display-md md:text-display-lg lg:text-display-xl font-display text-brand-black whitespace-pre-line leading-tight">
            {settings.hero_title || "ELEVATE YOUR\nEVERYDAY"}
          </h1>
          <p className="text-body-lg text-brand-charcoal max-w-md pb-4">
            {settings.hero_description || "Luxury streetwear crafted for the modern wardrobe. Discover silhouettes designed for comfort without compromising style."}
          </p>
          <div>
            <Link href="/products?sort=newest">
              <Button className="bg-brand-black text-brand-white hover:bg-brand-charcoal transition-colors duration-normal px-10 py-5 text-sm font-semibold tracking-wider uppercase rounded-brand">
                {settings.hero_button_text || "Shop New Arrivals"}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Image Content */}
      <div className="relative w-full lg:w-1/2 p-4 lg:p-8 xl:p-12 flex items-stretch">
        <div className="relative w-full aspect-[4/5] sm:aspect-square lg:aspect-auto lg:h-full lg:min-h-[400px] overflow-hidden rounded-brand-lg shadow-elevated">
          <div
            ref={imageRef}
            className="absolute inset-0 z-0 bg-cover bg-top lg:bg-center bg-no-repeat"
            style={{ backgroundImage: `url("${heroImage}")` }}
          />
        </div>
      </div>
    </section>
  );
}