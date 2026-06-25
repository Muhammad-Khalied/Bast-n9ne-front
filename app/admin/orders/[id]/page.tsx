"use client";

import { useEffect, useState } from "react";
import api from "../../../../lib/api";
import { 
  ArrowLeft, Package, User, MapPin, 
  CreditCard, Clock, Truck, CheckCircle, 
  XCircle, AlertCircle, ExternalLink 
} from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import Image from "next/image";

interface PageProps {
  params: { id: string };
}

export default function AdminOrderDetailPage({ params }: PageProps) {
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchOrder = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`/admin/orders/${params.id}`);
      setOrder(response.data.data);
    } catch (error) {
      toast.error("Failed to load order details");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [params.id]);

  const handleStatusUpdate = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      await api.patch(`/admin/orders/${params.id}/status`, { status: newStatus });
      toast.success(`Order updated to ${newStatus}`);
      fetchOrder();
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || "Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePaymentStatusUpdate = async (newPaymentStatus: string) => {
    setIsUpdating(true);
    try {
      await api.patch(`/admin/orders/${params.id}/status`, { paymentStatus: newPaymentStatus });
      toast.success(`Payment updated to ${newPaymentStatus}`);
      fetchOrder();
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || "Failed to update payment status");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-sage border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'DELIVERED': return <CheckCircle className="w-5 h-5 text-status-success" />;
      case 'CANCELLED': return <XCircle className="w-5 h-5 text-status-error" />;
      case 'SHIPPED': return <Truck className="w-5 h-5 text-blue-500" />;
      default: return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link href="/admin/orders" className="text-sm text-brand-muted hover:text-brand-sage flex items-center gap-2 mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Orders
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-brand-black">Order #{order.orderNumber}</h1>
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                order.status === 'DELIVERED' ? 'bg-status-success/10 text-status-success' :
                order.status === 'CANCELLED' ? 'bg-status-error/10 text-status-error' :
                'bg-yellow-100 text-yellow-700'
              }`}>
                {getStatusIcon(order.status)}
                {order.status}
              </div>
            </div>
            <p className="text-sm text-brand-muted">Placed on {new Date(order.createdAt).toLocaleString()}</p>
          </div>
          
          <div className="flex gap-3">
            <select 
              value={order.status}
              disabled={isUpdating}
              onChange={(e) => handleStatusUpdate(e.target.value)}
              className="bg-brand-white border border-brand-ivory-dark rounded-brand px-4 py-2.5 text-sm font-medium focus:ring-1 focus:ring-brand-sage outline-none transition-all disabled:opacity-50"
            >
              <option value="PENDING">Pending</option>
              <option value="PROCESSING">Processing</option>
              <option value="SHIPPED">Shipped</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
            <button className="bg-brand-black text-brand-white px-6 py-2.5 rounded-brand font-bold text-xs uppercase tracking-widest hover:bg-brand-charcoal transition-colors">
              Print Invoice
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content: Order Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-brand-white rounded-brand-lg border border-brand-ivory-dark overflow-hidden">
            <div className="px-6 py-4 border-b border-brand-ivory-dark bg-brand-ivory/20 flex justify-between items-center">
              <h3 className="font-bold text-brand-black flex items-center gap-2">
                <Package className="w-4 h-4 text-brand-sage" /> Order Items
              </h3>
              <span className="text-[10px] font-bold text-brand-muted uppercase">{order.items?.length || 0} items</span>
            </div>
            <div className="divide-y divide-brand-ivory">
              {order.items?.map((item: any) => (
                <div key={item.id} className="p-6 flex gap-4">
                  <div className="relative w-16 h-20 bg-brand-ivory rounded overflow-hidden flex-shrink-0">
                    {item.product?.media?.[0]?.url && (
                      <Image src={item.product.media[0].url} alt={item.product.title} fill className="object-cover" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <p className="text-sm font-bold text-brand-black">{item.product?.title}</p>
                      <p className="text-sm font-bold text-brand-black">EGP {(Number(item.price) * item.quantity).toFixed(2)}</p>
                    </div>
                    <p className="text-xs text-brand-muted mb-2">Size: {item.variant?.size} | Color: {item.variant?.color}</p>
                    <p className="text-xs text-brand-charcoal">Qty: {item.quantity} × EGP {Number(item.price).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-brand-ivory/10 p-6 border-t border-brand-ivory-dark">
              <div className="space-y-2 max-w-xs ml-auto">
                <div className="flex justify-between text-xs text-brand-muted">
                  <span>Subtotal</span>
                  <span>EGP {Number(order.subtotal ?? 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs text-brand-muted">
                  <span>Shipping</span>
                  <span>EGP {Number(order.shippingCost ?? 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-brand-black pt-2 border-t border-brand-ivory-dark">
                  <span>Total</span>
                  <span>EGP {Number(order.total).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar: Customer & Payment Details */}
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="bg-brand-white rounded-brand-lg border border-brand-ivory-dark overflow-hidden">
            <div className="px-6 py-4 border-b border-brand-ivory-dark bg-brand-ivory/20">
              <h3 className="font-bold text-brand-black flex items-center gap-2">
                <User className="w-4 h-4 text-brand-sage" /> Customer
              </h3>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-brand-ivory flex items-center justify-center text-brand-sage font-bold">
                  {order.user?.firstName?.[0] || 'U'}
                </div>
                <div>
                  <p className="text-sm font-bold text-brand-black">{order.user?.firstName} {order.user?.lastName}</p>
                  <p className="text-xs text-brand-muted">{order.user?.email}</p>
                </div>
              </div>
              <Link href={`/admin/users/${order.userId}`} className="w-full inline-flex items-center justify-center gap-2 py-2 border border-brand-ivory-dark rounded-brand text-[10px] font-bold uppercase tracking-widest text-brand-muted hover:bg-brand-ivory transition-colors">
                View Profile <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-brand-white rounded-brand-lg border border-brand-ivory-dark overflow-hidden">
            <div className="px-6 py-4 border-b border-brand-ivory-dark bg-brand-ivory/20">
              <h3 className="font-bold text-brand-black flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-sage" /> Shipping Address
              </h3>
            </div>
            <div className="p-6">
              <p className="text-xs font-bold text-brand-black mb-1">{order.address?.fullName || 'N/A'}</p>
              <p className="text-[11px] text-brand-charcoal leading-relaxed">
                {order.address?.street}<br />
                {order.address?.city}, {order.address?.state}<br />
                {order.address?.country}
              </p>
              <div className="mt-3 pt-3 border-t border-brand-ivory-dark">
                <p className="text-[10px] uppercase font-bold text-brand-muted tracking-widest mb-1">Phone</p>
                <p className="text-xs text-brand-charcoal">{order.address?.phone || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Payment Status */}
          <div className="bg-brand-white rounded-brand-lg border border-brand-ivory-dark overflow-hidden">
            <div className="px-6 py-4 border-b border-brand-ivory-dark bg-brand-ivory/20">
              <h3 className="font-bold text-brand-black flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-brand-sage" /> Payment
              </h3>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <p className="text-xs text-brand-muted font-medium">Status</p>
                <select 
                  value={order.paymentStatus || 'PENDING'}
                  disabled={isUpdating}
                  onChange={(e) => handlePaymentStatusUpdate(e.target.value)}
                  className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider outline-none cursor-pointer border ${
                    order.paymentStatus === 'COLLECTED' ? 'bg-status-success/10 text-status-success border-status-success/20' : 
                    order.paymentStatus === 'FAILED' ? 'bg-status-error/10 text-status-error border-status-error/20' :
                    'bg-yellow-100 text-yellow-700 border-yellow-200'
                  }`}
                >
                  <option value="PENDING">PENDING</option>
                  <option value="COLLECTED">COLLECTED</option>
                  <option value="FAILED">FAILED</option>
                  <option value="REFUNDED">REFUNDED</option>
                </select>
              </div>
              <div className="flex justify-between items-center mb-4">
                <p className="text-xs text-brand-muted font-medium">Method</p>
                <p className="text-xs font-bold text-brand-black uppercase tracking-wider">
                  {order.paymentMethod === 'INSTAPAY_WALLET' ? 'InstaPay / Wallet' : 'Cash on Delivery'}
                </p>
              </div>

              {order.paymentReceiptUrl && (
                <div className="mt-4 pt-4 border-t border-brand-ivory-dark">
                  <p className="text-xs text-brand-muted font-medium mb-3">Transfer Receipt</p>
                  <a href={order.paymentReceiptUrl} target="_blank" rel="noopener noreferrer" className="block relative w-full h-40 bg-brand-ivory rounded-brand overflow-hidden group">
                    <Image src={order.paymentReceiptUrl} alt="Payment Receipt" fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-brand-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <ExternalLink className="w-6 h-6 text-white" />
                    </div>
                  </a>
                  <p className="text-[10px] text-brand-muted mt-2 text-center">Click to view full size</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
