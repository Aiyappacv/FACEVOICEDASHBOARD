'use client';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { cn } from '@/lib/utils';

interface PieChartDataPoint {
  name: string;
  value: number;
  color: string;
}

interface BiometricPieChartProps {
  data: PieChartDataPoint[];
  height?: number;
  innerRadius?: number;
  outerRadius?: number;
  className?: string;
}

function PieTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: { name: string; value: number; color: string } }>;
}) {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload;
  return (
    <div className="rounded-xl border border-white/10 bg-[#130B2C]/90 px-4 py-3 shadow-2xl backdrop-blur-xl">
      <div className="flex items-center gap-2">
        <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
        <span className="text-xs font-medium text-white/60">{item.name}</span>
      </div>
      <p className="mt-1 text-sm font-bold text-white">{item.value.toLocaleString()}</p>
    </div>
  );
}

function CenterLabel({ total }: { total: number }) {
  return (
    <text
      x="50%"
      y="50%"
      textAnchor="middle"
      dominantBaseline="central"
      className="pointer-events-none select-none"
    >
      <tspan x="50%" dy="-6" className="fill-white/20 text-[10px] font-medium uppercase tracking-widest">
        Total
      </tspan>
      <tspan x="50%" dy="20" className="fill-white text-2xl font-bold">
        {total.toLocaleString()}
      </tspan>
    </text>
  );
}

export function BiometricPieChart({
  data,
  height = 320,
  innerRadius = 60,
  outerRadius = 110,
  className,
}: BiometricPieChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className={cn('w-full', className)}>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsPieChart>
          <defs>
            {data.map((entry, i) => (
              <linearGradient key={i} id={`pieGrad-${i}`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={entry.color} stopOpacity={1} />
                <stop offset="100%" stopColor={entry.color} stopOpacity={0.65} />
              </linearGradient>
            ))}
            <filter id="pieGlow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <Tooltip content={<PieTooltip />} />
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            dataKey="value"
            stroke="#130B2C"
            strokeWidth={3}
            paddingAngle={3}
            animationDuration={900}
            animationEasing="ease-out"
          >
            {data.map((entry, i) => (
              <Cell
                key={i}
                fill={`url(#pieGrad-${i})`}
                style={{ filter: `drop-shadow(0 0 10px ${entry.color}50)` }}
              />
            ))}
          </Pie>
          <CenterLabel total={total} />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
}
