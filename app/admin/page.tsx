"use client";

import { useEffect, useState } from "react";
import api from "../../lib/api";
import { StatsCard } from "../../components/admin/StatsCard";
import { RevenueChart } from "../../components/admin/RevenueChart";
import { OrdersChart } from "../../components/admin/OrdersChart";
import { ShoppingBag, ChevronRight, User } from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({ orders: 0, revenue: 0, customers: 0, products: 0 });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState([]);
  const [ordersData, setOrdersData] = useState([]);

  const fetchOverview = async () => {
    try {
      const response = await api.get("/analytics/overview");
      const data = response.data.data;
      setStats({
        orders: data.totalOrders,
        revenue: data.totalRevenue,
        customers: data.totalCustomers,
        products: data.totalProducts,
      });
      setRecentOrders(data.recentOrders || []);
    } catch {
      toast.error("Failed to load dashboard overview");
    }
  };

  const fetchSales = async (period = "30d") => {
    try {
      const response = await api.get("/analytics/sales", { params: { period } });
      setRevenueData(response.data.data ?? []);
    } catch {
      toast.error("Failed to load revenue data");
    }
  };

  const fetchOrderBreakdown = async () => {
    try {
      const response = await api.get("/analytics/orders");
      setOrdersData(response.data.data ?? []);
    } catch {
      toast.error("Failed to load order status data");
    }
  };

  useEffect(() => {
    fetchOverview();
    fetchSales("30d");
    fetchOrderBreakdown();
  }, []);

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-brand-black">Dashboard Overview</h1>
        <p className="text-sm text-brand-muted">Welcome back. Here's what's happening with your store today.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <StatsCard label="Total Orders" value={stats.orders} />
        <StatsCard label="Total Revenue" value={`EGP ${Number(stats.revenue).toLocaleString()}`} />
        <StatsCard label="Customers" value={stats.customers} />
        <StatsCard label="Products" value={stats.products} />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Charts */}
        <div className="lg:col-span-2 space-y-8">
          <div className="grid gap-4 md:grid-cols-1">
            <RevenueChart data={revenueData} onPeriodChange={fetchSales} />
          </div>
          
          {/* Recent Orders */}
          <div className="bg-brand-white rounded-brand-lg border border-brand-ivory-dark overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-brand-ivory-dark flex justify-between items-center bg-brand-ivory/20">
              <h2 className="font-bold text-brand-black text-xs uppercase tracking-widest flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-brand-sage" /> Recent Orders
              </h2>
              <Link href="/admin/orders" className="text-[10px] font-bold text-brand-muted hover:text-brand-sage transition-colors uppercase tracking-widest">
                View All
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <tbody className="divide-y divide-brand-ivory">
                  {recentOrders.length === 0 ? (
                    <tr><td className="px-6 py-8 text-center text-sm text-brand-muted">No recent orders.</td></tr>
                  ) : recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-brand-ivory/30 transition-colors group">
                      <td className="px-6 py-4">
                        <p className="text-xs font-bold text-brand-black">#{order.orderNumber}</p>
                        <p className="text-[10px] text-brand-muted">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <User className="w-3 h-3 text-brand-muted" />
                          <span className="text-[11px] font-medium text-brand-charcoal">{order.user?.firstName} {order.user?.lastName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-bold text-brand-black">
                        EGP {Number(order.total).toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                          order.status === "DELIVERED" ? "bg-status-success/10 text-status-success" : "bg-yellow-100 text-yellow-700"
                        }`}>{order.status}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link href={`/admin/orders/${order.id}`}>
                          <ChevronRight className="w-4 h-4 text-brand-muted group-hover:text-brand-black transition-colors ml-auto" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Side Stats */}
        <div className="space-y-8">
           <OrdersChart data={ordersData} />
        </div>
      </div>
    </div>
  );
}
