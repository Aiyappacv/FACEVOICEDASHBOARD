'use client';
import {
  RadarChart as RechartsRadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { cn } from '@/lib/utils';

interface RadarDataPoint {
  subject: string;
  value: number;
  fullMark?: number;
}

interface BiometricRadarChartProps {
  data: RadarDataPoint[];
  height?: number;
  color?: string;
  className?: string;
}

function RadarTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: { subject: string; value: number } }>;
}) {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload;
  return (
    <div className="rounded-xl border border-white/10 bg-[#130B2C]/90 px-4 py-3 shadow-2xl backdrop-blur-xl">
      <p className="mb-1 text-xs font-medium text-white/50">{item.subject}</p>
      <p className="text-sm font-bold text-white">{item.value}</p>
    </div>
  );
}

export function BiometricRadarChart({
  data,
  height = 350,
  color = '#C44DFF',
  className,
}: BiometricRadarChartProps) {
  return (
    <div className={cn('w-full', className)}>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsRadarChart cx="50%" cy="50%" outerRadius="72%" data={data}>
          <defs>
            <linearGradient id="radarFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.45} />
              <stop offset="100%" stopColor="#FF6AD5" stopOpacity={0.15} />
            </linearGradient>
            <filter id="radarGlow">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <PolarGrid stroke="rgba(255,255,255,0.06)" strokeDasharray="2 4" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{
              fill: 'rgba(255,255,255,0.45)',
              fontSize: 11,
              fontWeight: 600,
            }}
          />
          <PolarRadiusAxis
            angle={30}
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 9 }}
          />
          <Tooltip content={<RadarTooltip />} />
          <Radar
            name="biometrics"
            dataKey="value"
            stroke={color}
            strokeWidth={2.5}
            fill="url(#radarFill)"
            filter="url(#radarGlow)"
            animationDuration={900}
            animationEasing="ease-out"
          />
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  );
}
