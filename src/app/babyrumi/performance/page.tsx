'use client';

import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/glass-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { ProgressRing } from '@/components/ui/progress-ring';
import { RealtimeChart } from '@/components/charts/realtime-chart';
import { cn } from '@/lib/utils';
import { Activity, Clock, Zap, AlertCircle, Server, Cpu, HardDrive, Wifi } from 'lucide-react';

const keyMetrics = [
  { label: 'Uptime', value: '99.99%', icon: Activity, color: 'text-emerald-400', ring: 99.99 },
  { label: 'Avg Latency', value: '142ms', icon: Clock, color: 'text-blue-400', ring: 85 },
  { label: 'Throughput', value: '12,400 req/s', icon: Zap, color: 'text-purple-400', ring: 92 },
  { label: 'Error Rate', value: '0.02%', icon: AlertCircle, color: 'text-emerald-400', ring: 99.98 },
];

const latencyDist = Array.from({ length: 20 }, (_, i) => ({
  time: `${i * 25}ms`,
  value: Math.floor(Math.random() * 500 + 100 * Math.exp(-i / 5)),
}));

const throughputData = Array.from({ length: 30 }, (_, i) => ({
  time: `${i}`,
  value: Math.floor(Math.random() * 3000 + 10000),
}));

const percentiles = [
  { label: 'P50', value: '89ms', color: '#10b981' },
  { label: 'P90', value: '156ms', color: '#6366f1' },
  { label: 'P95', value: '234ms', color: '#f59e0b' },
  { label: 'P99', value: '487ms', color: '#ef4444' },
];

const healthIndicators = [
  { name: 'API Gateway', status: 'healthy' as const, latency: '12ms' },
  { name: 'Face Recognition', status: 'healthy' as const, latency: '45ms' },
  { name: 'Voice Processing', status: 'healthy' as const, latency: '89ms' },
  { name: 'Fusion Engine', status: 'healthy' as const, latency: '34ms' },
  { name: 'Risk Assessment', status: 'healthy' as const, latency: '18ms' },
  { name: 'Database Cluster', status: 'healthy' as const, latency: '8ms' },
  { name: 'Cache Layer', status: 'healthy' as const, latency: '3ms' },
  { name: 'Message Queue', status: 'degraded' as const, latency: '67ms' },
  { name: 'Storage Service', status: 'healthy' as const, latency: '15ms' },
  { name: 'CDN Edge', status: 'healthy' as const, latency: '6ms' },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function PerformancePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0015] via-[#120025] to-[#0a0015] p-6">
      <motion.div variants={container} initial="hidden" animate="show" className="max-w-7xl mx-auto space-y-6">
        <motion.div variants={item} className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/20">
            <Activity className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">System Performance</h1>
            <p className="text-sm text-purple-300/60">Real-time infrastructure monitoring</p>
          </div>
        </motion.div>

        <motion.div variants={item} className="grid grid-cols-4 gap-4">
          {keyMetrics.map((m) => (
            <GlassCard key={m.label} className="p-4 flex items-center gap-4">
              <ProgressRing value={m.ring} size={56} strokeWidth={4} color={m.color.includes('emerald') ? '#10b981' : m.color.includes('blue') ? '#3b82f6' : '#a855f7'} />
              <div>
                <p className="text-xs text-purple-300/50 uppercase tracking-wider">{m.label}</p>
                <p className={cn('text-xl font-bold mt-0.5', m.color)}>{m.value}</p>
              </div>
            </GlassCard>
          ))}
        </motion.div>

        <div className="grid grid-cols-2 gap-4">
          <motion.div variants={item}>
            <h2 className="text-lg font-semibold text-white mb-3">Latency Distribution</h2>
            <GlassCard className="p-4">
              <RealtimeChart data={latencyDist} color="#3b82f6" height={200} />
            </GlassCard>
          </motion.div>
          <motion.div variants={item}>
            <h2 className="text-lg font-semibold text-white mb-3">Throughput Over Time</h2>
            <GlassCard className="p-4">
              <RealtimeChart data={throughputData} color="#a855f7" height={200} />
            </GlassCard>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <motion.div variants={item}>
            <h2 className="text-lg font-semibold text-white mb-3">Response Time Percentiles</h2>
            <GlassCard className="p-4">
              <div className="grid grid-cols-4 gap-4">
                {percentiles.map((p) => (
                  <div key={p.label} className="text-center">
                    <p className="text-xs text-purple-300/50 uppercase mb-2">{p.label}</p>
                    <ProgressRing value={100} size={80} strokeWidth={5} color={p.color} />
                    <p className="text-lg font-bold text-white mt-2">{p.value}</p>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          <motion.div variants={item}>
            <h2 className="text-lg font-semibold text-white mb-3">System Health</h2>
            <GlassCard className="p-4">
              <div className="grid grid-cols-2 gap-2">
                {healthIndicators.map((h) => (
                  <div key={h.name} className="flex items-center justify-between p-2 rounded-lg bg-purple-500/5">
                    <div className="flex items-center gap-2">
                      <div className={cn('w-2 h-2 rounded-full', h.status === 'healthy' ? 'bg-emerald-400' : h.status === 'degraded' ? 'bg-amber-400' : 'bg-red-400')} />
                      <span className="text-sm text-white/80">{h.name}</span>
                    </div>
                    <span className="text-xs text-purple-300/40">{h.latency}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
