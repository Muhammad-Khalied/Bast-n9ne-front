'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface OrderStatusData {
  status: string;
  count: number;
}

interface OrdersChartProps {
  data: OrderStatusData[];
}

const statusColors: Record<string, string> = {
  PENDING: '#c49a45',
  CONFIRMED: '#4578a0',
  PROCESSING: '#7c8c6c',
  SHIPPED: '#a3b18a',
  DELIVERED: '#4a7c59',
  CANCELLED: '#c44545',
  RETURNED: '#8a8a8a',
};

const statusLabels: Record<string, string> = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  PROCESSING: 'Processing',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
  RETURNED: 'Returned',
};

export function OrdersChart({ data }: OrdersChartProps) {
  const chartData = data.map((d) => ({
    ...d,
    label: statusLabels[d.status] || d.status,
    fill: statusColors[d.status] || '#8a8a8a',
  }));

  return (
    <div className="bg-white rounded-brand-lg border border-brand-ivory-dark p-6">
      <h3 className="font-heading text-heading-sm text-brand-black mb-6">Order Status</h3>

      {data.length === 0 || data.every((d) => d.count === 0) ? (
        <div className="h-64 flex items-center justify-center text-brand-muted text-sm">
          No order data available
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8e1d9" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fill: '#8a8a8a', fontSize: 11 }}
                axisLine={{ stroke: '#d4cdc4' }}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fill: '#8a8a8a', fontSize: 11 }}
                axisLine={{ stroke: '#d4cdc4' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1a1a1a',
                  border: 'none',
                  borderRadius: '4px',
                  color: '#f5f0eb',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          {/* Legend */}
          <div className="flex flex-wrap gap-3 mt-4">
            {chartData.filter((d) => d.count > 0).map((d) => (
              <div key={d.status} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.fill }} />
                <span className="text-xs text-brand-muted">{d.label} ({d.count})</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
