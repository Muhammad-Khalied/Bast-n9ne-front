"use client";

import { useEffect, useState } from "react";
import api from "../../../../../lib/api";
import Link from "next/link";
import { ArrowLeft, Package, MapPin, CreditCard, Loader2 } from "lucide-react";
import { formatPrice } from "../../../../../lib/utils";
import Image from "next/image";

interface PageProps {
  params: { id: string };
}

export default function OrderDetailPage({ params }: PageProps) {
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.get(`/orders/${params.id}`).then((response) => {
      setOrder(response.data.data);
      setIsLoading(false);
    }).catch(() => setIsLoading(false));
  }, [params.id]);

  if (isLoading) {
    return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-brand-sage" /></div>;
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-brand-muted mb-4">Order not found.</p>
        <Link href="/account/orders" className="text-brand-sage hover:underline">Return to Orders</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <Link href="/account/orders" className="inline-flex items-center gap-2 text-sm text-brand-muted hover:text-brand-sage transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Orders
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-heading-lg font-heading text-brand-black">Order {order.orderNumber}</h1>
            <p className="text-sm text-brand-charcoal mt-1">
              Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          <span className={`inline-block text-xs font-bold px-3 py-1.5 rounded uppercase tracking-wider ${
            order.status === 'DELIVERED' ? 'bg-status-success/10 text-status-success' :
            order.status === 'CANCELLED' ? 'bg-status-error/10 text-status-error' :
            'bg-brand-sage/10 text-brand-sage'
          }`}>
            {order.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content: Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-brand-lg bg-brand-white border border-brand-ivory-dark overflow-hidden shadow-sm">
            <div className="p-5 border-b border-brand-ivory-dark bg-brand-ivory/20 flex items-center gap-3">
              <Package className="w-5 h-5 text-brand-sage" />
              <h2 className="font-heading text-heading-sm text-brand-black">Items ({(order.items?.length || 0) + (order.customItems?.length || 0)})</h2>
            </div>
            <div className="divide-y divide-brand-ivory-dark">
              {order.items?.map((item: any) => {
                const imageUrl = item.imageUrl;
                return (
                  <div key={item.id} className="flex gap-4 p-5 hover:bg-brand-ivory/5 transition-colors">
                    <div className="w-20 h-24 relative rounded-brand bg-brand-ivory-light overflow-hidden flex-shrink-0 border border-brand-ivory-dark">
                      {imageUrl ? (
                        <Image src={imageUrl} alt={item.title || 'Product Image'} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"><Package className="w-6 h-6 text-brand-muted" /></div>
                      )}
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-medium text-brand-black line-clamp-1">{item.title || 'Product'}</h3>
                        <p className="text-xs text-brand-muted mt-1 space-x-2">
                          {item.size && <span>Size: {item.size}</span>}
                          {item.color && <span>Color: {item.color}</span>}
                        </p>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm text-brand-charcoal">Qty: {item.quantity}</span>
                        <span className="font-medium text-brand-black">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Custom AI T-Shirt items */}
              {order.customItems?.map((item: any) => (
                <div key={`custom-${item.id}`} className="flex gap-4 p-5 hover:bg-brand-ivory/5 transition-colors">
                  <div className="w-20 h-24 relative rounded-brand bg-brand-ivory-light overflow-hidden flex-shrink-0 border border-brand-ivory-dark">
                    <Image src={item.imageUrl} alt={item.title} fill className="object-contain p-1" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-medium text-brand-black line-clamp-1">{item.title}</h3>
                      <p className="text-xs text-brand-muted mt-1 space-x-2">
                        <span>Size: {item.size}</span>
                        <span>Color: {item.shirtColor}</span>
                      </p>
                      <div className="bg-brand-ivory-light p-2 rounded text-[10px] text-brand-charcoal italic mt-2">
                        <span className="font-bold mr-1">Prompt:</span>{item.prompt}
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-brand-charcoal">Qty: {item.quantity}</span>
                      <span className="font-medium text-brand-black">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar: Summary & Details */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="rounded-brand-lg bg-brand-white border border-brand-ivory-dark overflow-hidden shadow-sm p-6">
            <h2 className="font-heading text-heading-sm text-brand-black mb-4">Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-brand-charcoal">
                <span>Subtotal</span>
                <span>{formatPrice((order.items?.reduce((sum: number, i: any) => sum + Number(i.price) * i.quantity, 0) || 0) + (order.customItems?.reduce((sum: number, i: any) => sum + Number(i.price) * i.quantity, 0) || 0))}</span>
              </div>
              <div className="flex justify-between text-brand-charcoal">
                <span>Shipping</span>
                <span>{formatPrice(order.total - ((order.items?.reduce((sum: number, i: any) => sum + Number(i.price) * i.quantity, 0) || 0) + (order.customItems?.reduce((sum: number, i: any) => sum + Number(i.price) * i.quantity, 0) || 0)))}</span>
              </div>
              <div className="pt-3 mt-3 border-t border-brand-ivory-dark flex justify-between font-medium text-brand-black text-base">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="rounded-brand-lg bg-brand-white border border-brand-ivory-dark overflow-hidden shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-4 h-4 text-brand-sage" />
              <h2 className="font-heading text-heading-sm text-brand-black">Shipping Address</h2>
            </div>
            {order.address ? (
              <div className="text-sm text-brand-charcoal space-y-1">
                <p className="font-medium text-brand-black">{order.address.fullName}</p>
                <p>{order.address.street}</p>
                <p>{order.address.city}, {order.address.state}</p>
                <p>{order.address.country}</p>
                <p className="mt-2 text-brand-muted">{order.address.phone}</p>
              </div>
            ) : (
              <p className="text-sm text-brand-muted">Address details unavailable.</p>
            )}
          </div>

          {/* Payment Info */}
          <div className="rounded-brand-lg bg-brand-white border border-brand-ivory-dark overflow-hidden shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="w-4 h-4 text-brand-sage" />
              <h2 className="font-heading text-heading-sm text-brand-black">Payment</h2>
            </div>
            <div className="text-sm text-brand-charcoal space-y-2">
              <div className="flex justify-between">
                <span>Method</span>
                <span className="font-medium text-brand-black">
                  {order.paymentMethod === 'INSTAPAY_WALLET' ? 'InstaPay / Wallet' : 'Cash on Delivery'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Status</span>
                <span className="font-medium text-brand-black">{order.paymentStatus || 'PENDING'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
