'use client';

import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/glass-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { ProgressRing } from '@/components/ui/progress-ring';
import { RealtimeChart } from '@/components/charts/realtime-chart';
import { cn } from '@/lib/utils';
import { Activity, Users, Wifi, HardDrive, Globe, ArrowUpRight, BarChart3, TrendingUp } from 'lucide-react';

const metrics = [
  { label: 'Total API Calls', value: '24.8M', change: '+18%', icon: Activity, color: 'text-purple-400' },
  { label: 'Active Users', value: '3,421', change: '+7%', icon: Users, color: 'text-blue-400' },
  { label: 'Peak Concurrent', value: '8,234', change: '+12%', icon: Wifi, color: 'text-emerald-400' },
  { label: 'Bandwidth', value: '1.2 TB', change: '+22%', icon: HardDrive, color: 'text-amber-400' },
];

const usageOverTime = Array.from({ length: 30 }, (_, i) => ({
  time: `Day ${i + 1}`,
  value: Math.floor(Math.random() * 500000 + 600000),
}));

const topEndpoints = [
  { endpoint: '/api/v2/face/verify', calls: '8.2M', pct: 33, latency: '142ms' },
  { endpoint: '/api/v2/voice/enroll', calls: '4.1M', pct: 16.5, latency: '234ms' },
  { endpoint: '/api/v2/face/detect', calls: '3.8M', pct: 15.3, latency: '89ms' },
  { endpoint: '/api/v2/fusion/analyze', calls: '3.2M', pct: 12.9, latency: '198ms' },
  { endpoint: '/api/v2/risk/assess', calls: '2.4M', pct: 9.7, latency: '67ms' },
  { endpoint: '/api/v2/voice/verify', calls: '1.9M', pct: 7.7, latency: '156ms' },
  { endpoint: '/api/v2/deepfake/check', calls: '1.2M', pct: 4.9, latency: '312ms' },
];

const activityHeatmap = Array.from({ length: 7 }, (_, day) =>
  Array.from({ length: 24 }, (_, hour) => ({
    day,
    hour,
    value: Math.floor(Math.random() * 100),
  }))
).flat();

const geoDist = [
  { region: 'North America', pct: 38, flag: '🇺🇸' },
  { region: 'Europe', pct: 27, flag: '🇪🇺' },
  { region: 'Asia Pacific', pct: 22, flag: '🌏' },
  { region: 'Latin America', pct: 8, flag: '🌎' },
  { region: 'Middle East & Africa', pct: 5, flag: '🌍' },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function UsagePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0015] via-[#120025] to-[#0a0015] p-6">
      <motion.div variants={container} initial="hidden" animate="show" className="max-w-7xl mx-auto space-y-6">
        <motion.div variants={item} className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/20">
            <BarChart3 className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Usage Analytics</h1>
            <p className="text-sm text-purple-300/60">Platform usage insights & patterns</p>
          </div>
        </motion.div>

        <motion.div variants={item} className="grid grid-cols-4 gap-4">
          {metrics.map((m) => (
            <GlassCard key={m.label} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-purple-300/50 uppercase tracking-wider">{m.label}</p>
                  <p className={cn('text-2xl font-bold mt-1', m.color)}>{m.value}</p>
                  <p className="text-xs text-emerald-400/60 mt-1 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> {m.change}
                  </p>
                </div>
                <m.icon className={cn('w-8 h-8 opacity-40', m.color)} />
              </div>
            </GlassCard>
          ))}
        </motion.div>

        <motion.div variants={item}>
          <h2 className="text-lg font-semibold text-white mb-3">Usage Over Time (30 Days)</h2>
          <GlassCard className="p-4">
            <RealtimeChart data={usageOverTime} color="#10b981" height={200} />
          </GlassCard>
        </motion.div>

        <div className="grid grid-cols-2 gap-4">
          <motion.div variants={item}>
            <h2 className="text-lg font-semibold text-white mb-3">Top Endpoints</h2>
            <GlassCard className="p-4 space-y-3">
              {topEndpoints.map((ep, i) => (
                <div key={ep.endpoint} className="flex items-center gap-3">
                  <span className="text-xs text-purple-300/30 w-4">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-white/80 font-mono truncate">{ep.endpoint}</span>
                      <span className="text-xs text-purple-300/50 shrink-0 ml-2">{ep.calls}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-purple-900/30 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${ep.pct * 2}%` }}
                        transition={{ duration: 1, delay: i * 0.05 }}
                      />
                    </div>
                  </div>
                  <span className="text-xs text-purple-300/40 shrink-0 w-12 text-right">{ep.latency}</span>
                </div>
              ))}
            </GlassCard>
          </motion.div>

          <div className="space-y-4">
            <motion.div variants={item}>
              <h2 className="text-lg font-semibold text-white mb-3">User Activity Heatmap</h2>
              <GlassCard className="p-4">
                <div className="grid grid-cols-24 gap-0.5">
                  {activityHeatmap.map((cell, i) => (
                    <div
                      key={i}
                      className="aspect-square rounded-sm transition-colors hover:scale-150"
                      style={{
                        background: `rgba(168, 85, 247, ${cell.value / 100})`,
                      }}
                    />
                  ))}
                </div>
                <div className="flex justify-between mt-2 text-[10px] text-purple-300/30">
                  <span>12am</span>
                  <span>6am</span>
                  <span>12pm</span>
                  <span>6pm</span>
                  <span>12am</span>
                </div>
              </GlassCard>
            </motion.div>

            <motion.div variants={item}>
              <h2 className="text-lg font-semibold text-white mb-3">Geographic Distribution</h2>
              <GlassCard className="p-4 space-y-3">
                {geoDist.map((g) => (
                  <div key={g.region} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/80 flex items-center gap-2">
                        <span>{g.flag}</span> {g.region}
                      </span>
                      <span className="text-purple-300/50">{g.pct}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-purple-900/30 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-purple-500 to-violet-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${g.pct * 2.5}%` }}
                        transition={{ duration: 1 }}
                      />
                    </div>
                  </div>
                ))}
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
