"use client";

import { useEffect, useState } from "react";
import api from "../../../lib/api";
import Link from "next/link";
import { Package, MapPin, User, Settings, ArrowRight } from "lucide-react";
import { formatPrice } from "../../../lib/utils";

export default function AccountOverviewPage() {
  const [profile, setProfile] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/me"),
      api.get("/orders"),
      api.get("/me/addresses")
    ]).then(([meRes, ordersRes, addrRes]) => {
      setProfile(meRes.data.data);
      setOrders(ordersRes.data.data || []);
      setAddresses(addrRes.data.data || []);
      setIsLoading(false);
    }).catch(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <div className="animate-pulse space-y-6">
      <div className="h-32 bg-brand-ivory rounded-brand-lg"></div>
      <div className="h-64 bg-brand-ivory rounded-brand-lg"></div>
    </div>;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-heading-lg font-heading text-brand-black">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Card */}
        <div className="rounded-brand-lg bg-brand-white p-6 shadow-card border border-brand-ivory-dark flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 bg-brand-sage/10 rounded-full flex items-center justify-center mb-4">
              <User className="w-6 h-6 text-brand-sage" />
            </div>
            <h2 className="text-heading-sm font-heading text-brand-black mb-1">
              {profile?.firstName} {profile?.lastName}
            </h2>
            <p className="text-sm text-brand-charcoal">{profile?.email}</p>
            {profile?.phone && <p className="text-sm text-brand-charcoal mt-1">{profile.phone}</p>}
          </div>
          <Link href="/account/settings" className="mt-6 flex items-center gap-2 text-sm font-medium text-brand-sage hover:text-brand-sage-dark transition-colors">
            Edit Profile <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Addresses Summary */}
        <div className="rounded-brand-lg bg-brand-white p-6 shadow-card border border-brand-ivory-dark flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 bg-brand-sage/10 rounded-full flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6 text-brand-sage" />
            </div>
            <h2 className="text-heading-sm font-heading text-brand-black mb-2">Saved Addresses</h2>
            <p className="text-sm text-brand-charcoal mb-4">You have {addresses.length} saved addresses.</p>
            {addresses.length > 0 && (
              <div className="text-sm text-brand-muted truncate">
                <span className="font-medium text-brand-black">{addresses[0].label || 'Default'}:</span> {addresses[0].street}, {addresses[0].city}
              </div>
            )}
          </div>
          <Link href="/account/addresses" className="mt-6 flex items-center gap-2 text-sm font-medium text-brand-sage hover:text-brand-sage-dark transition-colors">
            Manage Addresses <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="rounded-brand-lg bg-brand-white shadow-card border border-brand-ivory-dark overflow-hidden">
        <div className="p-6 border-b border-brand-ivory-dark flex justify-between items-center bg-brand-ivory/20">
          <div className="flex items-center gap-3">
            <Package className="w-5 h-5 text-brand-sage" />
            <h2 className="font-heading text-heading-sm text-brand-black">Recent Orders</h2>
          </div>
          <Link href="/account/orders" className="text-sm font-medium text-brand-sage hover:text-brand-sage-dark transition-colors">
            View All
          </Link>
        </div>
        <div className="divide-y divide-brand-ivory-dark">
          {orders.length === 0 ? (
            <div className="p-8 text-center text-brand-muted">
              You haven't placed any orders yet.
            </div>
          ) : (
            orders.slice(0, 3).map((order) => (
              <div key={order.id} className="p-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div>
                  <p className="font-mono font-medium text-brand-black mb-1">{order.orderNumber}</p>
                  <p className="text-xs text-brand-muted">
                    {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
                <div className="flex flex-col sm:items-end gap-2">
                  <p className="font-medium text-brand-black">{formatPrice(order.total)}</p>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${
                    order.status === 'DELIVERED' ? 'bg-status-success/10 text-status-success' :
                    order.status === 'CANCELLED' ? 'bg-status-error/10 text-status-error' :
                    'bg-brand-sage/10 text-brand-sage'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
