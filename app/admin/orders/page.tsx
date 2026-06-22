"use client";

import { useEffect, useState } from "react";
import api from "../../../lib/api";
import Link from "next/link";
import { ShoppingBag, User, Calendar, DollarSign, ChevronRight } from "lucide-react";
import { toast } from "react-hot-toast";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/admin/orders");
      setOrders(response.data.data ?? []);
    } catch (error) {
      toast.error("Failed to fetch orders");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DELIVERED": return "bg-status-success/10 text-status-success";
      case "CANCELLED": return "bg-status-error/10 text-status-error";
      case "PROCESSING": return "bg-brand-sage/10 text-brand-sage";
      case "SHIPPED": return "bg-blue-100 text-blue-700";
      case "PENDING": return "bg-yellow-100 text-yellow-700";
      default: return "bg-brand-muted/10 text-brand-muted";
    }
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-brand-black">Orders</h1>
          <p className="text-sm text-brand-muted">Monitor and process customer transactions</p>
        </div>
      </div>

      <div className="bg-brand-white rounded-brand-lg shadow-sm border border-brand-ivory-dark overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-brand-ivory text-[10px] font-bold uppercase tracking-[0.2em] text-brand-muted border-b border-brand-ivory-dark">
                <th className="px-6 py-4">Order #</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-ivory">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-brand-muted">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-6 h-6 border-2 border-brand-sage border-t-transparent rounded-full animate-spin" />
                      Loading orders...
                    </div>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-brand-muted">No orders found.</td>
                </tr>
              ) : orders.map((order) => (
                <tr key={order.id} className="hover:bg-brand-ivory/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-brand-ivory flex items-center justify-center text-brand-sage">
                        <ShoppingBag className="w-4 h-4" />
                      </div>
                      <p className="text-sm font-bold text-brand-black">#{order.orderNumber}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-brand-muted" />
                      <span className="text-xs font-medium text-brand-charcoal">
                        {order.user?.firstName} {order.user?.lastName}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs text-brand-charcoal flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-brand-muted" />
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-brand-black">EGP {Number(order.total).toFixed(2)}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/admin/orders/${order.id}`}>
                      <button className="p-2 text-brand-muted hover:text-brand-black transition-colors">
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
