'use client';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { cn } from '@/lib/utils';

interface BarChartDataPoint {
  name: string;
  value: number;
  color?: string;
}

interface BiometricBarChartProps {
  data: BarChartDataPoint[];
  height?: number;
  colors?: string[];
  className?: string;
}

const DEFAULT_COLORS = ['#C44DFF', '#A033E0', '#8B2BC7', '#7520AE', '#FF6AD5', '#E055C0'];

function BarTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ payload: { name: string; value: number } }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-white/10 bg-[#130B2C]/90 px-4 py-3 shadow-2xl backdrop-blur-xl">
      <p className="mb-1 text-xs font-medium text-white/50">{label ?? payload[0].payload.name}</p>
      <p className="text-sm font-bold text-white">{payload[0].payload.value.toLocaleString()}</p>
    </div>
  );
}

export function BiometricBarChart({
  data,
  height = 300,
  colors = DEFAULT_COLORS,
  className,
}: BiometricBarChartProps) {
  return (
    <div className={cn('w-full', className)}>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsBarChart
          data={data}
          margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
          barCategoryGap="20%"
        >
          <defs>
            {data.map((entry, i) => (
              <linearGradient key={i} id={`barGrad-${i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={entry.color ?? colors[i % colors.length]} stopOpacity={1} />
                <stop offset="100%" stopColor={entry.color ?? colors[i % colors.length]} stopOpacity={0.5} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 6" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11, fontWeight: 500 }}
            dy={8}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11, fontWeight: 500 }}
            dx={-4}
          />
          <Tooltip content={<BarTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
          <Bar
            dataKey="value"
            radius={[6, 6, 0, 0]}
            animationDuration={700}
            animationEasing="ease-out"
          >
            {data.map((entry, i) => (
              <Cell
                key={i}
                fill={`url(#barGrad-${i})`}
                style={{ filter: `drop-shadow(0 4px 12px ${entry.color ?? colors[i % colors.length]}40)` }}
              />
            ))}
          </Bar>
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}
