"use client";

import { useEffect, useState } from "react";
import api from "../../../../lib/api";
import Link from "next/link";
import { Package, ArrowRight, Loader2 } from "lucide-react";
import { formatPrice } from "../../../../lib/utils";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.get("/orders").then((response) => {
      setOrders(response.data.data ?? []);
      setIsLoading(false);
    }).catch(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-brand-sage" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-heading-lg font-heading text-brand-black">My Orders</h1>
        <span className="text-sm font-medium text-brand-muted">{orders.length} Orders</span>
      </div>

      {orders.length ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="rounded-brand-lg bg-brand-white border border-brand-ivory-dark overflow-hidden hover:border-brand-sage-light transition-colors shadow-sm">
              <div className="p-5 border-b border-brand-ivory-dark bg-brand-ivory/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-brand-sage/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Package className="w-5 h-5 text-brand-sage" />
                  </div>
                  <div>
                    <p className="font-mono font-medium text-brand-black">{order.orderNumber}</p>
                    <p className="text-xs text-brand-muted mt-0.5">
                      Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-medium text-brand-black">{formatPrice(order.total)}</p>
                    <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                      order.status === 'DELIVERED' ? 'bg-status-success/10 text-status-success' :
                      order.status === 'CANCELLED' ? 'bg-status-error/10 text-status-error' :
                      'bg-brand-sage/10 text-brand-sage'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="p-5 flex items-center justify-between">
                <div className="text-sm text-brand-charcoal">
                  {order.items ? `${order.items.length} Items` : 'Items loading...'}
                </div>
                <Link
                  href={`/account/orders/${order.id}`}
                  className="flex items-center gap-2 text-sm font-medium text-brand-sage hover:text-brand-sage-dark transition-colors"
                >
                  View Order Details <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-brand-white border border-brand-ivory-dark rounded-brand-lg">
          <Package className="w-12 h-12 text-brand-ivory-dark mx-auto mb-4" />
          <h2 className="text-heading-sm font-heading text-brand-black mb-2">No orders yet</h2>
          <p className="text-brand-charcoal mb-6">Looks like you haven't made your first purchase.</p>
          <Link href="/products" className="px-6 py-3 bg-brand-sage text-white rounded-brand font-medium hover:bg-brand-sage-dark transition-colors">
            Start Shopping
          </Link>
        </div>
      )}
    </div>
  );
}
