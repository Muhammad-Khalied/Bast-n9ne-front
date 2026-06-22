"use client";

import { useEffect, useState } from "react";
import api from "../../../lib/api";
import { AnalyticsCard } from "../../../components/admin/AnalyticsCard";

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState({ orders: 0, revenue: 0, customers: 0, products: 0 });

  useEffect(() => {
    api.get("/analytics/overview").then((response) => {
      const data = response.data.data;
      setStats({
        orders: data.totalOrders,
        revenue: data.totalRevenue,
        customers: data.totalCustomers,
        products: data.totalProducts
      });
    });
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-heading-lg font-heading">Analytics</h1>
      <div className="grid gap-4 md:grid-cols-4">
        <AnalyticsCard title="Orders" value={stats.orders} />
        <AnalyticsCard title="Revenue" value={stats.revenue} />
        <AnalyticsCard title="Customers" value={stats.customers} />
        <AnalyticsCard title="Products" value={stats.products} />
      </div>
    </div>
  );
}
