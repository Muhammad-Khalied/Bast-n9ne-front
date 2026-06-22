'use client';

import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface SalesData {
  date: string;
  revenue: number;
  orders: number;
}

interface RevenueChartProps {
  data: SalesData[];
  onPeriodChange?: (period: string) => void;
}

const periods = [
  { label: '7D', value: '7d' },
  { label: '30D', value: '30d' },
  { label: '90D', value: '90d' },
];

export function RevenueChart({ data, onPeriodChange }: RevenueChartProps) {
  const [activePeriod, setActivePeriod] = useState('30d');

  const handlePeriodChange = (period: string) => {
    setActivePeriod(period);
    onPeriodChange?.(period);
  };

  const formatCurrency = (value: number) => `$${(value / 1000).toFixed(1)}k`;
  const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="bg-white rounded-brand-lg border border-brand-ivory-dark p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-heading text-heading-sm text-brand-black">Revenue</h3>
        <div className="flex gap-1 bg-brand-ivory-light rounded-brand-md p-0.5">
          {periods.map((p) => (
            <button
              key={p.value}
              onClick={() => handlePeriodChange(p.value)}
              className={`px-3 py-1.5 rounded-brand text-xs font-medium transition-all ${
                activePeriod === p.value
                  ? 'bg-brand-sage text-white shadow-sm'
                  : 'text-brand-muted hover:text-brand-charcoal'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {data.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-brand-muted text-sm">
          No sales data available for this period
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7c8c6c" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#7c8c6c" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e8e1d9" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              tick={{ fill: '#8a8a8a', fontSize: 11 }}
              axisLine={{ stroke: '#d4cdc4' }}
            />
            <YAxis
              tickFormatter={formatCurrency}
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
              formatter={(value: number) => [`$${value.toFixed(2)}`, 'Revenue']}
              labelFormatter={formatDate}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#7c8c6c"
              strokeWidth={2}
              fill="url(#revenueGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
