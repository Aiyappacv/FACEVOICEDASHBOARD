'use client';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { AnimatedCounter } from './animated-counter';
import { GlassCard } from './glass-card';

interface MetricCardProps {
  label: string;
  value: number;
  previousValue: number;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  format: 'number' | 'percentage' | 'currency' | 'duration';
  icon: LucideIcon;
  color: string;
  delay?: number;
}

const changeConfig: Record<
  MetricCardProps['changeType'],
  { icon: LucideIcon; textClass: string; label: string }
> = {
  increase: {
    icon: TrendingUp,
    textClass: 'text-[#41F3A3]',
    label: 'up',
  },
  decrease: {
    icon: TrendingDown,
    textClass: 'text-[#FF5A7D]',
    label: 'down',
  },
  neutral: {
    icon: Minus,
    textClass: 'text-[#8F88B2]',
    label: 'flat',
  },
};

function MetricCard({
  label,
  value,
  change,
  changeType,
  format,
  icon: Icon,
  color,
  delay = 0,
}: MetricCardProps) {
  const changeInfo = changeConfig[changeType];
  const ChangeIcon = changeInfo.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <GlassCard
        variant="interactive"
        glow="purple"
        className="relative overflow-hidden"
      >
        <div
          className="absolute top-0 left-0 h-[4px] w-full rounded-t-[24px]"
          style={{
            background: `linear-gradient(90deg, ${color}, transparent)`,
          }}
        />

        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{ backgroundColor: `${color}18` }}
            >
              <Icon className="h-5 w-5" style={{ color }} />
            </div>
            <span className="text-sm font-medium text-white/50">{label}</span>
          </div>
        </div>

        <div className="mt-4">
          <AnimatedCounter
            value={value}
            format={format}
            className="text-3xl font-bold text-white"
          />
        </div>

        <div className="mt-3 flex items-center gap-1.5">
          <ChangeIcon className={cn('h-3.5 w-3.5', changeInfo.textClass)} />
          <span className={cn('text-xs font-semibold', changeInfo.textClass)}>
            {Math.abs(change).toFixed(1)}%
          </span>
          <span className="text-xs text-white/30">vs last period</span>
        </div>
      </GlassCard>
    </motion.div>
  );
}

export { MetricCard, type MetricCardProps };
