'use client';
import { useLayoutEffect, useRef } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { cn } from '@/lib/utils';

interface RealtimeChartDataPoint {
  time: string;
  value: number;
  value2?: number;
}

interface RealtimeChartProps {
  data: RealtimeChartDataPoint[];
  height?: number;
  color?: string;
  color2?: string;
  gradientId?: string;
  showGrid?: boolean;
  showTooltip?: boolean;
  title?: string;
  className?: string;
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; dataKey: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-white/10 bg-[#130B2C]/90 px-4 py-3 shadow-2xl backdrop-blur-xl">
      <p className="mb-1.5 text-xs font-medium text-white/50">{label}</p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ backgroundColor: entry.dataKey === 'value' ? '#C44DFF' : '#FF6AD5' }}
          />
          <span className="text-sm font-semibold text-white">{entry.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}

export function RealtimeChart({
  data,
  height = 300,
  color = '#C44DFF',
  color2 = '#FF6AD5',
  gradientId = 'chartGradient',
  showGrid = true,
  showTooltip = true,
  title,
  className,
}: RealtimeChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (chartRef.current) {
      chartRef.current.style.opacity = '1';
    }
  }, [data]);

  return (
    <div className={cn('w-full', className)} ref={chartRef} style={{ opacity: 0, transition: 'opacity 0.4s ease' }}>
      {title && (
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/40">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.4} />
              <stop offset="50%" stopColor={color} stopOpacity={0.1} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
            <linearGradient id={`${gradientId}Line`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={color} stopOpacity={0.6} />
              <stop offset="50%" stopColor={color} stopOpacity={1} />
              <stop offset="100%" stopColor={color2} stopOpacity={1} />
            </linearGradient>
            {data.some((d) => d.value2 !== undefined) && (
              <linearGradient id={`${gradientId}2`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color2} stopOpacity={0.3} />
                <stop offset="100%" stopColor={color2} stopOpacity={0} />
              </linearGradient>
            )}
          </defs>
          {showGrid && (
            <CartesianGrid strokeDasharray="3 6" stroke="rgba(255,255,255,0.05)" vertical={false} />
          )}
          <XAxis
            dataKey="time"
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 11, fontWeight: 500 }}
            dy={8}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 11, fontWeight: 500 }}
            dx={-4}
          />
          {showTooltip && <Tooltip content={<CustomTooltip />} cursor={false} />}
          <Area
            type="monotone"
            dataKey="value"
            stroke={`url(#${gradientId}Line)`}
            strokeWidth={2.5}
            fill={`url(#${gradientId})`}
            animationDuration={800}
            animationEasing="ease-out"
            dot={false}
            activeDot={{
              r: 5,
              fill: color,
              stroke: '#130B2C',
              strokeWidth: 3,
              style: { filter: `drop-shadow(0 0 8px ${color})` },
            }}
          />
          {data.some((d) => d.value2 !== undefined) && (
            <Area
              type="monotone"
              dataKey="value2"
              stroke={color2}
              strokeWidth={2}
              strokeOpacity={0.7}
              fill={`url(#${gradientId}2)`}
              animationDuration={1000}
              animationEasing="ease-out"
              dot={false}
              activeDot={{
                r: 4,
                fill: color2,
                stroke: '#130B2C',
                strokeWidth: 2,
              }}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
