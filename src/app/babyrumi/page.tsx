'use client';
import { motion } from 'framer-motion';
import {
  ScanFace, Mic, Fingerprint, ShieldAlert, ShieldCheck,
  TrendingUp, Zap, AlertTriangle, Activity, Brain,
  CheckCircle2, XCircle, Clock, Globe
} from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { MetricCard } from '@/components/ui/metric-card';
import { ActivityFeed } from '@/components/ui/activity-feed';
import { PipelineView } from '@/components/charts/pipeline-view';
import WorldMap from '@/components/dashboard/world-map';
import { RealtimeChart } from '@/components/charts/realtime-chart';
import { kpiMetrics, activityEvents, geoEvents, pipelineStages } from '@/data/mock-data';
import { useRealtimeActivity, usePipelineAnimation, useRealtimeMetrics } from '@/hooks/use-realtime';

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 100, damping: 15 },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 80, damping: 20, delay: 0.4 },
  },
};

const pulseGlow = {
  animate: {
    boxShadow: [
      '0 0 20px rgba(65, 243, 163, 0.05)',
      '0 0 40px rgba(65, 243, 163, 0.1)',
      '0 0 20px rgba(65, 243, 163, 0.05)',
    ],
    transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
  },
};

const kpiData = [
  {
    label: 'Verified Today',
    value: 24847,
    previousValue: 22086,
    icon: CheckCircle2,
    color: '#41F3A3',
    change: 12.5,
    changeType: 'increase' as const,
    format: 'number' as const,
  },
  {
    label: 'Verification Requests',
    value: 31204,
    previousValue: 28812,
    icon: Activity,
    color: '#C44DFF',
    change: 8.3,
    changeType: 'increase' as const,
    format: 'number' as const,
  },
  {
    label: 'Threats Blocked',
    value: 1247,
    previousValue: 1013,
    icon: ShieldAlert,
    color: '#FF5A7D',
    change: 23.1,
    changeType: 'increase' as const,
    format: 'number' as const,
  },
  {
    label: 'Deepfake Attempts',
    value: 342,
    previousValue: 361,
    icon: AlertTriangle,
    color: '#FF6AD5',
    change: 5.2,
    changeType: 'decrease' as const,
    format: 'number' as const,
  },
  {
    label: 'Authentication Success',
    value: 97.8,
    previousValue: 97.5,
    icon: ShieldCheck,
    color: '#41F3A3',
    change: 0.3,
    changeType: 'increase' as const,
    format: 'percentage' as const,
  },
  {
    label: 'Risk Alerts',
    value: 89,
    previousValue: 77,
    icon: Zap,
    color: '#FFC857',
    change: 15.7,
    changeType: 'increase' as const,
    format: 'number' as const,
  },
  {
    label: 'Fusion Accuracy',
    value: 99.7,
    previousValue: 99.6,
    icon: Brain,
    color: '#A855F7',
    change: 0.1,
    changeType: 'increase' as const,
    format: 'percentage' as const,
  },
  {
    label: 'Average Latency',
    value: 142,
    previousValue: 155,
    icon: Clock,
    color: '#C44DFF',
    change: 8.4,
    changeType: 'decrease' as const,
    format: 'duration' as const,
  },
];

export default function DashboardPage() {
  const events = useRealtimeActivity(activityEvents);
  const { activeStage, completedStages } = usePipelineAnimation(pipelineStages.length);
  const metrics = useRealtimeMetrics(kpiMetrics);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Ambient background effects */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -left-[20%] -top-[20%] h-[600px] w-[600px] rounded-full bg-[#C44DFF]/[0.03] blur-[120px]" />
        <div className="absolute -right-[10%] top-[20%] h-[500px] w-[500px] rounded-full bg-[#41F3A3]/[0.03] blur-[100px]" />
        <div className="absolute bottom-[10%] left-[30%] h-[400px] w-[400px] rounded-full bg-[#FF5A7D]/[0.02] blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1920px] space-y-6 p-6 lg:space-y-8 lg:p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <div className="mb-1 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#C44DFF] to-[#41F3A3] p-[1px]">
                <div className="flex h-full w-full items-center justify-center rounded-[11px] bg-[#130B2C]">
                  <ScanFace className="h-5 w-5 text-[#41F3A3]" />
                </div>
              </div>
              <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">
                <span className="bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
                  Command Center
                </span>
              </h1>
            </div>
            <p className="text-sm text-white/40">
              Real-time biometric identity operations •{' '}
              <span className="text-[#41F3A3]/70">All systems operational</span>
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-white/30">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#41F3A3] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#41F3A3]" />
            </span>
            Live
          </div>
        </motion.div>

        {/* KPI Cards */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4 lg:gap-4"
        >
          {kpiData.map((kpi) => (
            <motion.div key={kpi.label} variants={item}>
              <MetricCard {...kpi} />
            </motion.div>
          ))}
        </motion.div>

        {/* Middle Row: World Map + Activity Feed */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_380px] lg:gap-6"
        >
          {/* World Map */}
          <motion.div variants={pulseGlow} animate="animate">
            <GlassCard className="relative overflow-hidden p-0">
              <div className="absolute left-4 top-4 z-10">
                <div className="flex items-center gap-2 rounded-lg bg-[#130B2C]/80 px-3 py-1.5 backdrop-blur-sm">
                  <Globe className="h-3.5 w-3.5 text-[#C44DFF]" />
                  <span className="text-xs font-medium text-white/70">Global Threat Map</span>
                </div>
              </div>
              <div className="h-[380px] w-full lg:h-[420px]">
                <WorldMap events={geoEvents} />
              </div>
            </GlassCard>
          </motion.div>

          {/* Activity Feed */}
          <GlassCard className="flex flex-col overflow-hidden p-0">
            <div className="flex items-center justify-between border-b border-white/5 px-5 py-3.5">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-[#41F3A3]" />
                <span className="text-sm font-semibold text-white/90">Activity Stream</span>
              </div>
              <span className="rounded-full bg-[#41F3A3]/10 px-2 py-0.5 text-[10px] font-semibold text-[#41F3A3]">
                LIVE
              </span>
            </div>
            <div className="flex-1 overflow-y-auto" style={{ maxHeight: '380px' }}>
              <ActivityFeed events={events} />
            </div>
          </GlassCard>
        </motion.div>

        {/* Pipeline View */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 80, damping: 20, delay: 0.5 }}
        >
          <GlassCard>
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#C44DFF]/10">
                <Fingerprint className="h-4 w-4 text-[#C44DFF]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white/90">Authentication Pipeline</h3>
                <p className="text-[11px] text-white/40">Real-time verification throughput</p>
              </div>
            </div>
            <PipelineView stages={pipelineStages} activeStage={activeStage} />
          </GlassCard>
        </motion.div>

        {/* Bottom Row: Charts */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 80, damping: 20, delay: 0.6 }}
          className="grid grid-cols-1 gap-4 lg:grid-cols-[1.4fr_1fr] lg:gap-6"
        >
          {/* Realtime Auth Chart */}
          <GlassCard>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#41F3A3]/10">
                  <TrendingUp className="h-4 w-4 text-[#41F3A3]" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white/90">Authentication Requests</h3>
                  <p className="text-[11px] text-white/40">Requests per minute over time</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-[11px]">
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#41F3A3]" />
                  <span className="text-white/40">Verified</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#FF5A7D]" />
                  <span className="text-white/40">Rejected</span>
                </span>
              </div>
            </div>
            <RealtimeChart data={metrics} />
          </GlassCard>

          {/* Threat Distribution */}
          <GlassCard>
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FF5A7D]/10">
                <ShieldAlert className="h-4 w-4 text-[#FF5A7D]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white/90">Threat Distribution</h3>
                <p className="text-[11px] text-white/40">Blocked by category</p>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              {[
                { label: 'Deepfake Video', value: 342, pct: 27, color: '#FF6AD5' },
                { label: 'Voice Spoofing', value: 289, pct: 23, color: '#C44DFF' },
                { label: 'Mask Attack', value: 218, pct: 17, color: '#FF5A7D' },
                { label: 'Presentation Attack', value: 196, pct: 16, color: '#FFC857' },
                { label: 'Synthetic Identity', value: 127, pct: 10, color: '#A855F7' },
                { label: 'Replay Attack', value: 75, pct: 7, color: '#41F3A3' },
              ].map((threat) => (
                <div key={threat.label} className="group">
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-xs text-white/60 group-hover:text-white/80 transition-colors">
                      {threat.label}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold" style={{ color: threat.color }}>
                        {threat.value}
                      </span>
                      <span className="text-[10px] text-white/30">{threat.pct}%</span>
                    </div>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${threat.pct}%` }}
                      transition={{ duration: 1, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
                      className="h-full rounded-full"
                      style={{
                        background: `linear-gradient(90deg, ${threat.color}CC, ${threat.color})`,
                        boxShadow: `0 0 12px ${threat.color}33`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Footer accent line */}
        <div className="flex items-center gap-3 pb-4">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
          <span className="text-[10px] tracking-widest text-white/15 uppercase">
            SPECTRAFACEVOICE™ v3.2.1 — Enterprise Biometric Intelligence
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        </div>
      </div>
    </div>
  );
}
