'use client';

import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/glass-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { ProgressRing } from '@/components/ui/progress-ring';
import { RealtimeChart } from '@/components/charts/realtime-chart';
import { cn } from '@/lib/utils';
import { ShieldAlert, Ban, Search, Flag, MapPin, TrendingDown, AlertOctagon, Eye } from 'lucide-react';

const metrics = [
  { label: 'Total Fraud Attempts', value: '1,247', change: '+12%', icon: ShieldAlert, color: 'text-red-400', trend: 'up' },
  { label: 'Blocked', value: '1,189', change: '95.3%', icon: Ban, color: 'text-emerald-400', trend: 'down' },
  { label: 'Investigating', value: '34', change: '5 active', icon: Search, color: 'text-amber-400', trend: 'flat' },
  { label: 'False Positives', value: '24', change: '-8%', icon: Flag, color: 'text-blue-400', trend: 'down' },
];

const fraudTrend = Array.from({ length: 30 }, (_, i) => ({
  time: `Day ${i + 1}`,
  value: Math.floor(Math.random() * 60 + 20),
}));

const fraudTypes = [
  { type: 'Spoofing Attack', count: 423, pct: 34 },
  { type: 'Deepfake Video', count: 312, pct: 25 },
  { type: 'Voice Clone', count: 224, pct: 18 },
  { type: 'Replay Attack', count: 156, pct: 12 },
  { type: 'Presentation Fraud', count: 132, pct: 11 },
];

const geoGrid = [
  { region: 'NA', incidents: 342, severity: 'high' },
  { region: 'EU', incidents: 218, severity: 'medium' },
  { region: 'APAC', incidents: 187, severity: 'medium' },
  { region: 'LATAM', incidents: 89, severity: 'low' },
  { region: 'MEA', incidents: 124, severity: 'low' },
  { region: 'SA', incidents: 67, severity: 'low' },
  { region: 'OC', incidents: 45, severity: 'low' },
  { region: 'CAR', incidents: 34, severity: 'low' },
];

const topPatterns = [
  { pattern: 'Automated bot enrollment with face spoofing', severity: 'critical', occurrences: 187 },
  { pattern: 'Real-time deepfake injection during liveness', severity: 'high', occurrences: 134 },
  { pattern: 'Voice synthesis bypassing liveness checks', severity: 'high', occurrences: 98 },
  { pattern: 'Stolen biometric replay via video call', severity: 'medium', occurrences: 76 },
  { pattern: 'Mask-based presentation attack', severity: 'medium', occurrences: 52 },
  { pattern: 'Synthetic identity creation', severity: 'low', occurrences: 31 },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function FraudAnalyticsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0015] via-[#120025] to-[#0a0015] p-6">
      <motion.div variants={container} initial="hidden" animate="show" className="max-w-7xl mx-auto space-y-6">
        <motion.div variants={item} className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-red-500/20 to-rose-500/20 border border-red-500/20">
            <ShieldAlert className="w-6 h-6 text-red-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Fraud Analytics Intelligence</h1>
            <p className="text-sm text-purple-300/60">Real-time fraud detection & pattern analysis</p>
          </div>
        </motion.div>

        <motion.div variants={item} className="grid grid-cols-4 gap-4">
          {metrics.map((m) => (
            <GlassCard key={m.label} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-purple-300/50 uppercase tracking-wider">{m.label}</p>
                  <p className={cn('text-2xl font-bold mt-1', m.color)}>{m.value}</p>
                  <p className="text-xs text-purple-300/40 mt-1">{m.change}</p>
                </div>
                <m.icon className={cn('w-8 h-8 opacity-40', m.color)} />
              </div>
            </GlassCard>
          ))}
        </motion.div>

        <div className="grid grid-cols-3 gap-4">
          <motion.div variants={item} className="col-span-2">
            <h2 className="text-lg font-semibold text-white mb-3">Fraud Trend (30 Days)</h2>
            <GlassCard className="p-4">
              <RealtimeChart data={fraudTrend} color="#ef4444" height={200} />
            </GlassCard>
          </motion.div>

          <motion.div variants={item}>
            <h2 className="text-lg font-semibold text-white mb-3">Fraud Type Breakdown</h2>
            <GlassCard className="p-4 space-y-3">
              {fraudTypes.map((ft, i) => (
                <div key={ft.type} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/80">{ft.type}</span>
                    <span className="text-purple-300/50">{ft.count}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-purple-900/30 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-red-500 to-rose-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${ft.pct}%` }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                    />
                  </div>
                </div>
              ))}
            </GlassCard>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <motion.div variants={item}>
            <h2 className="text-lg font-semibold text-white mb-3">Geographic Distribution</h2>
            <GlassCard className="p-4">
              <div className="grid grid-cols-4 gap-3">
                {geoGrid.map((g) => (
                  <div
                    key={g.region}
                    className={cn(
                      'p-3 rounded-lg border text-center transition-all hover:scale-105',
                      g.severity === 'high' && 'bg-red-500/10 border-red-500/30',
                      g.severity === 'medium' && 'bg-amber-500/10 border-amber-500/30',
                      g.severity === 'low' && 'bg-purple-500/10 border-purple-500/20'
                    )}
                  >
                    <MapPin className={cn('w-4 h-4 mx-auto mb-1', g.severity === 'high' ? 'text-red-400' : g.severity === 'medium' ? 'text-amber-400' : 'text-purple-400')} />
                    <p className="text-xs font-medium text-white">{g.region}</p>
                    <p className="text-[10px] text-purple-300/40">{g.incidents}</p>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          <motion.div variants={item}>
            <h2 className="text-lg font-semibold text-white mb-3">Top Fraud Patterns</h2>
            <GlassCard className="p-4 space-y-3">
              {topPatterns.map((p, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-purple-500/5 transition-colors">
                  <div className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
                    p.severity === 'critical' && 'bg-red-500/20',
                    p.severity === 'high' && 'bg-amber-500/20',
                    p.severity === 'medium' && 'bg-blue-500/20',
                    p.severity === 'low' && 'bg-purple-500/10'
                  )}>
                    <AlertOctagon className={cn('w-4 h-4', p.severity === 'critical' ? 'text-red-400' : p.severity === 'high' ? 'text-amber-400' : 'text-blue-400')} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white/80 truncate">{p.pattern}</p>
                    <p className="text-xs text-purple-300/40">{p.occurrences} occurrences</p>
                  </div>
                  <StatusBadge label={p.severity} variant={p.severity === 'critical' ? 'danger' : p.severity === 'high' ? 'warning' : 'info'} />
                </div>
              ))}
            </GlassCard>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
