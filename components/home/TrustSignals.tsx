"use client";

import { Truck, RefreshCw, ShieldCheck, Clock, Star, Heart, CheckCircle, Package, Zap } from "lucide-react";
import { useSettings } from "../../hooks/useSettings";

const defaultSignals = [
  {
    id: "1",
    icon: "Truck",
    title: "Free Shipping",
    description: "On all orders over EGP 500.",
  },
  {
    id: "2",
    icon: "RefreshCw",
    title: "Easy Returns",
    description: "30-day hassle-free returns.",
  },
  {
    id: "3",
    icon: "ShieldCheck",
    title: "Secure Payment",
    description: "100% secure checkout.",
  },
  {
    id: "4",
    icon: "Clock",
    title: "24/7 Support",
    description: "Dedicated client service.",
  },
];

const iconMap: Record<string, React.ElementType> = {
  Truck,
  RefreshCw,
  ShieldCheck,
  Clock,
  Star,
  Heart,
  CheckCircle,
  Package,
  Zap,
};

export function TrustSignals() {
  const { settings, isLoading } = useSettings();

  if (isLoading) return <div className="h-[200px] bg-brand-white border-y border-brand-ivory-dark animate-pulse" />;

  let signals = defaultSignals;
  if (settings.trust_signals && Array.isArray(settings.trust_signals) && settings.trust_signals.length > 0) {
    signals = settings.trust_signals;
  }

  // Dynamic grid classes based on item count
  const getGridCols = (count: number) => {
    if (count === 1) return "grid-cols-1";
    if (count === 2) return "grid-cols-1 sm:grid-cols-2";
    if (count === 3) return "grid-cols-1 sm:grid-cols-3";
    if (count === 4) return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";
    return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-5";
  };

  return (
    <section className="border-y border-brand-ivory-dark bg-brand-white">
      <div className="mx-auto max-w-7xl px-4 md:px-8 py-12">
        <div className={`grid gap-8 ${getGridCols(signals.length)}`}>
          {signals.map((signal) => {
            const Icon = iconMap[signal.icon] || CheckCircle;
            
            return (
              <div key={signal.id} className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-sage-50 text-brand-sage-700">
                  <Icon className="h-6 w-6" strokeWidth={1.5} />
                </div>
                <h3 className="mb-2 text-sm font-semibold tracking-wide text-brand-black uppercase">
                  {signal.title}
                </h3>
                <p className="text-sm text-brand-muted">{signal.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
