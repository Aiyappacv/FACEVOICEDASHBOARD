'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { RealtimeChart } from '@/components/charts/realtime-chart';
import { BiometricBarChart } from '@/components/charts/bar-chart';
import { cn } from '@/lib/utils';
import {
  Activity,
  AlertTriangle,
  ShieldAlert,
  Zap,
  Network,
  UserX,
  Server,
  Lock,
  TrendingUp,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

type Severity = 'critical' | 'high' | 'medium' | 'low';

interface ThreatEvent {
  id: string;
  hour: number;
  minute: number;
  severity: Severity;
  type: string;
  confidence: number;
  source: string;
}

const SEVERITY_CONFIG: Record<Severity, { color: string; glow: string; bg: string }> = {
  critical: { color: 'bg-red-500', glow: 'shadow-[0_0_14px_rgba(239,68,68,0.7)]', bg: 'text-red-400' },
  high: { color: 'bg-orange-500', glow: 'shadow-[0_0_14px_rgba(249,115,22,0.6)]', bg: 'text-orange-400' },
  medium: { color: 'bg-yellow-400', glow: 'shadow-[0_0_14px_rgba(250,204,21,0.5)]', bg: 'text-yellow-400' },
  low: { color: 'bg-purple-400', glow: 'shadow-[0_0_14px_rgba(168,85,247,0.5)]', bg: 'text-purple-400' },
};

const THREAT_EVENTS: ThreatEvent[] = [
  { id: 'evt-1', hour: 0, minute: 12, severity: 'low', type: 'Credential Stuffing', confidence: 91.2, source: 'API Gateway' },
  { id: 'evt-2', hour: 1, minute: 34, severity: 'medium', type: 'Brute Force', confidence: 94.7, source: 'Auth Service' },
  { id: 'evt-3', hour: 3, minute: 8, severity: 'high', type: 'Synthetic Voice', confidence: 97.1, source: 'Phone Auth' },
  { id: 'evt-4', hour: 5, minute: 21, severity: 'low', type: 'Port Scan', confidence: 88.3, source: 'Edge Node NYC-01' },
  { id: 'evt-5', hour: 6, minute: 45, severity: 'critical', type: 'Deepfake Video', confidence: 99.4, source: 'Video Call' },
  { id: 'evt-6', hour: 8, minute: 15, severity: 'high', type: 'Injection Attack', confidence: 96.8, source: 'API Gateway' },
  { id: 'evt-7', hour: 9, minute: 52, severity: 'medium', type: 'Replay Attack', confidence: 93.5, source: 'Camera #1' },
  { id: 'evt-8', hour: 10, minute: 30, severity: 'critical', type: 'AI Voice Clone', confidence: 99.1, source: 'Phone Auth' },
  { id: 'evt-9', hour: 12, minute: 5, severity: 'low', type: 'Rate Limit Probe', confidence: 89.9, source: 'API Gateway' },
  { id: 'evt-10', hour: 13, minute: 40, severity: 'high', type: 'Credential Stuffing', confidence: 95.3, source: 'Auth Service' },
  { id: 'evt-11', hour: 15, minute: 18, severity: 'medium', type: 'Presentation Attack', confidence: 92.1, source: 'Camera #4' },
  { id: 'evt-12', hour: 17, minute: 55, severity: 'critical', type: 'Template Tampering', confidence: 99.7, source: 'DB Audit' },
  { id: 'evt-13', hour: 19, minute: 10, severity: 'low', type: 'GAN Output', confidence: 87.6, source: 'Camera #2' },
  { id: 'evt-14', hour: 21, minute: 33, severity: 'medium', type: 'Synthetic Voice', confidence: 94.0, source: 'Phone Auth' },
  { id: 'evt-15', hour: 22, minute: 48, severity: 'high', type: 'Mask Attack', confidence: 97.5, source: 'Camera #1' },
];

const THREAT_CATEGORIES = [
  { name: 'Deepfake Video', rate: 99.2, icon: Zap, color: 'purple' },
  { name: 'Replay Attack', rate: 97.8, icon: Activity, color: 'pink' },
  { name: 'Synthetic Voice', rate: 98.5, icon: UserX, color: 'blue' },
  { name: 'Credential Theft', rate: 99.1, icon: Lock, color: 'red' },
  { name: 'Injection Attack', rate: 97.3, icon: Network, color: 'orange' },
  { name: 'Presentation Attack', rate: 96.8, icon: ShieldAlert, color: 'yellow' },
];

const CATEGORY_COLOR_MAP: Record<string, string> = {
  purple: 'from-purple-500/30 to-purple-600/10 text-purple-400 border-purple-500/20',
  pink: 'from-pink-500/30 to-pink-600/10 text-pink-400 border-pink-500/20',
  blue: 'from-blue-500/30 to-blue-600/10 text-blue-400 border-blue-500/20',
  red: 'from-red-500/30 to-red-600/10 text-red-400 border-red-500/20',
  orange: 'from-orange-500/30 to-orange-600/10 text-orange-400 border-orange-500/20',
  yellow: 'from-yellow-500/30 to-yellow-600/10 text-yellow-400 border-yellow-500/20',
};

const CATEGORY_BAR_COLOR: Record<string, string> = {
  purple: 'bg-purple-500', pink: 'bg-pink-500', blue: 'bg-blue-500',
  red: 'bg-red-500', orange: 'bg-orange-500', yellow: 'bg-yellow-500',
};

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } } };
const itemVariants = { hidden: { opacity: 0, y: 24, scale: 0.97 }, visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 260, damping: 24 } } };

export default function ThreatMonitorPage() {
  const [hoveredEvent, setHoveredEvent] = useState<string | null>(null);
  const [liveCount, setLiveCount] = useState(1247);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => setLiveCount((c) => c + Math.floor(Math.random() * 8)), 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0408] p-6 lg:p-8 space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="relative overflow-hidden rounded-2xl border border-red-500/20 bg-gradient-to-r from-red-950/60 via-[rgba(74,20,40,0.3)] to-purple-950/50 p-6 lg:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(220,38,38,0.12),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(147,51,234,0.08),transparent_60%)]" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-red-500/20 border border-red-500/30">
              <ShieldAlert className="h-7 w-7 text-red-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white lg:text-3xl">Threat Monitor</h1>
              <p className="mt-1 text-sm text-red-300/70">Real-time security event detection & threat intelligence</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge label="Threat Level: ELEVATED" variant="danger" pulse />
            <StatusBadge label="Active Threats: 23" variant="warning" />
            <StatusBadge label={`Blocked Today: ${liveCount}`} variant="success" />
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }}>
        <GlassCard className="border-red-500/15 bg-[rgba(74,20,40,0.3)] p-6">
          <div className="mb-4 flex items-center gap-2"><Activity className="h-5 w-5 text-red-400" /><h2 className="text-lg font-semibold text-white">Security Events — Last 24h</h2></div>
          <div className="relative w-full overflow-x-auto pb-4">
            <div className="relative mx-auto min-w-[700px] h-28">
              {[0, 3, 6, 9, 12, 15, 18, 21].map((h) => (<div key={h} className="absolute top-0 flex flex-col items-center" style={{ left: `${(h / 24) * 100}%` }}><span className="text-[10px] text-white/30 font-mono">{String(h).padStart(2, '0')}:00</span><div className="mt-1 h-24 w-px bg-white/5" /></div>))}
              <div className="absolute top-7 left-0 right-0 h-px bg-gradient-to-r from-red-500/40 via-purple-500/30 to-red-500/40" />
              {THREAT_EVENTS.map((evt) => {
                const cfg = SEVERITY_CONFIG[evt.severity];
                const pct = ((evt.hour + evt.minute / 60) / 24) * 100;
                const isHovered = hoveredEvent === evt.id;
                return (
                  <motion.div key={evt.id} className="absolute" style={{ left: `${pct}%`, top: '16px' }} onMouseEnter={() => setHoveredEvent(evt.id)} onMouseLeave={() => setHoveredEvent(null)}>
                    {(evt.severity === 'critical' || evt.severity === 'high') && (<span className={cn('absolute -inset-2 rounded-full opacity-40 animate-ping', cfg.color)} style={{ animationDuration: evt.severity === 'critical' ? '1.2s' : '2s' }} />)}
                    <div className={cn('relative h-3 w-3 rounded-full border border-black/20 cursor-pointer transition-transform duration-200', cfg.color, isHovered && 'scale-150 z-10', evt.severity === 'critical' && cfg.glow)} />
                    {isHovered && (<motion.div initial={{ opacity: 0, y: 4, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="absolute left-1/2 top-6 z-20 w-48 -translate-x-1/2 rounded-lg border border-white/10 bg-[#1a0a12]/95 p-3 shadow-xl backdrop-blur-sm"><p className={cn('text-xs font-bold uppercase', cfg.bg)}>{evt.severity}</p><p className="mt-1 text-sm font-medium text-white">{evt.type}</p><p className="text-xs text-white/50">{evt.source}</p><div className="mt-1.5 flex items-center justify-between text-xs"><span className="text-white/40">{String(evt.hour).padStart(2, '0')}:{String(evt.minute).padStart(2, '0')}</span><span className={cn('font-mono font-semibold', cfg.bg)}>{evt.confidence}%</span></div><div className="mt-1 flex items-center gap-1">{evt.confidence >= 98 ? <XCircle className="h-3 w-3 text-red-400" /> : <CheckCircle2 className="h-3 w-3 text-green-400" />}<span className="text-[10px] text-white/40">{evt.confidence >= 98 ? 'Blocked' : 'Investigating'}</span></div></motion.div>)}
                  </motion.div>
                );
              })}
            </div>
          </div>
          <div className="flex items-center gap-4 mt-2 text-xs text-white/40">{Object.entries(SEVERITY_CONFIG).map(([key, val]) => (<div key={key} className="flex items-center gap-1.5"><span className={cn('h-2 w-2 rounded-full', val.color)} /><span className="capitalize">{key}</span></div>))}</div>
        </GlassCard>
      </motion.div>

      <motion.div variants={containerVariants} initial="hidden" animate={mounted ? 'visible' : 'hidden'} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {THREAT_CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const gradientClass = CATEGORY_COLOR_MAP[cat.color] ?? CATEGORY_COLOR_MAP.purple;
          const barClass = CATEGORY_BAR_COLOR[cat.color] ?? CATEGORY_BAR_COLOR.purple;
          return (<motion.div key={cat.name} variants={itemVariants} whileHover={{ y: -4, scale: 1.02 }}><GlassCard className={cn('group relative overflow-hidden border bg-gradient-to-br p-5 transition-shadow duration-300 hover:shadow-[0_0_30px_rgba(239,68,68,0.08)]', gradientClass)}><div className="flex items-start justify-between"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 border border-white/5"><Icon className="h-5 w-5" /></div><div><h3 className="text-sm font-semibold text-white">{cat.name}</h3><p className="text-xs text-white/40 mt-0.5">Detection rate</p></div></div><motion.div initial={{ rotate: -90 }} animate={{ rotate: 0 }} transition={{ duration: 1, delay: 0.3 }} className="text-2xl font-bold text-white">{cat.rate}%</motion.div></div><div className="mt-4"><div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5"><motion.div initial={{ width: 0 }} animate={{ width: `${cat.rate}%` }} transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }} className={cn('h-full rounded-full', barClass)} /></div></div><div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/[0.03] blur-2xl transition-all duration-500 group-hover:h-32 group-hover:w-32 group-hover:bg-white/[0.06]" /></GlassCard></motion.div>);
        })}
      </motion.div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.4 }}><GlassCard className="border-red-500/15 bg-[rgba(74,20,40,0.3)] p-6"><h2 className="mb-1 text-lg font-semibold text-white">Threats Over Time</h2><p className="mb-4 text-xs text-white/40">Real-time security events detected per hour</p><div className="h-64"><RealtimeChart data={Array.from({ length: 30 }, (_, i) => ({ time: `${i}`, value: Math.floor(Math.random() * 50 + 10) }))} color="#ef4444" height={256} /></div></GlassCard></motion.div>
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.5 }}><GlassCard className="border-red-500/15 bg-[rgba(74,20,40,0.3)] p-6"><h2 className="mb-1 text-lg font-semibold text-white">Threat Type Distribution</h2><p className="mb-4 text-xs text-white/40">Categorized security events — last 24h</p><div className="h-64"><BiometricBarChart data={[{ name: 'Credential Stuffing', value: 48, color: '#ef4444' }, { name: 'Deepfake/Injection', value: 31, color: '#a855f7' }, { name: 'Replay/Presentation', value: 22, color: '#f97316' }, { name: 'Synthetic Voice', value: 18, color: '#3b82f6' }, { name: 'Template Tampering', value: 12, color: '#facc15' }, { name: 'Other', value: 8, color: '#22c55e' }]} /></div></GlassCard></motion.div>
      </div>
    </div>
  );
}