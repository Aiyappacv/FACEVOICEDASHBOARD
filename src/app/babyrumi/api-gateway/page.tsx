'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { RealtimeChart } from '@/components/charts/realtime-chart';
import { BiometricBarChart } from '@/components/charts/bar-chart';
import { cn } from '@/lib/utils';
import {
  Cloud,
  Server,
  Cpu,
  HardDrive,
  Wifi,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Activity,
  Database,
  Zap,
  Lock,
  Globe,
} from 'lucide-react';

interface Endpoint {
  id: string;
  path: string;
  method: string;
  status: 'healthy' | 'degraded' | 'down';
  avgLatency: number;
  requestsPerMin: number;
  errorRate: number;
  rateLimit: number;
}

const ENDPOINTS: Endpoint[] = [
  { id: 'ep-1', path: '/v1/verify/face', method: 'POST', status: 'healthy', avgLatency: 42, requestsPerMin: 1247, errorRate: 0.02, rateLimit: 1000 },
  { id: 'ep-2', path: '/v1/verify/voice', method: 'POST', status: 'healthy', avgLatency: 89, requestsPerMin: 892, errorRate: 0.01, rateLimit: 500 },
  { id: 'ep-3', path: '/v1/verify/fingerprint', method: 'POST', status: 'healthy', avgLatency: 18, requestsPerMin: 567, errorRate: 0.005, rateLimit: 1000 },
  { id: 'ep-4', path: '/v1/verify/multimodal', method: 'POST', status: 'healthy', avgLatency: 128, requestsPerMin: 445, errorRate: 0.015, rateLimit: 200 },
  { id: 'ep-5', path: '/v1/detect/liveness', method: 'POST', status: 'healthy', avgLatency: 67, requestsPerMin: 789, errorRate: 0.03, rateLimit: 300 },
  { id: 'ep-6', path: '/v1/detect/deepfake', method: 'POST', status: 'degraded', avgLatency: 156, requestsPerMin: 234, errorRate: 0.12, rateLimit: 100 },
  { id: 'ep-7', path: '/v1/enroll', method: 'POST', status: 'healthy', avgLatency: 234, requestsPerMin: 123, errorRate: 0.05, rateLimit: 50 },
  { id: 'ep-8', path: '/v1/identify', method: 'POST', status: 'healthy', avgLatency: 89, requestsPerMin: 678, errorRate: 0.02, rateLimit: 200 },
  { id: 'ep-9', path: '/v1/risk/assess', method: 'POST', status: 'healthy', avgLatency: 15, requestsPerMin: 2341, errorRate: 0.008, rateLimit: 1000 },
  { id: 'ep-10', path: '/v1/audit/log', method: 'GET', status: 'healthy', avgLatency: 28, requestsPerMin: 456, errorRate: 0.01, rateLimit: 500 },
];

const STATUS_CONFIG = {
  healthy: { badge: 'bg-green-500/20 text-green-400 border-green-500/30', dot: 'bg-green-500', text: 'text-green-400' },
  degraded: { badge: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', dot: 'bg-yellow-500', text: 'text-yellow-400' },
  down: { badge: 'bg-red-500/20 text-red-400 border-red-500/30', dot: 'bg-red-500', text: 'text-red-400' },
};

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 24 } } };

export default function APIGatewayPage() {
  const [mounted, setMounted] = useState(false);
  const [filter, setFilter] = useState<'all' | 'healthy' | 'degraded' | 'down'>('all');

  useEffect(() => { setMounted(true); }, []);

  const filtered = ENDPOINTS.filter(e => filter === 'all' || e.status === filter);
  const healthy = ENDPOINTS.filter(e => e.status === 'healthy').length;
  const degraded = ENDPOINTS.filter(e => e.status === 'degraded').length;
  const down = ENDPOINTS.filter(e => e.status === 'down').length;
  const totalRpm = ENDPOINTS.reduce((a, e) => a + e.requestsPerMin, 0);
  const avgLatency = Math.round(ENDPOINTS.reduce((a, e) => a + e.avgLatency, 0) / ENDPOINTS.length);
  const totalErrors = ENDPOINTS.reduce((a, e) => a + e.errorRate * e.requestsPerMin / 100, 0);

  return (
    <div className="min-h-screen bg-[#0a0408] p-6 lg:p-8 space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="relative overflow-hidden rounded-2xl border border-cyan-500/20 bg-gradient-to-r from-cyan-950/60 via-[rgba(20,80,100,0.3)] to-teal-950/50 p-6 lg:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(6,182,212,0.12),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(20,184,166,0.08),transparent_60%)]" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-cyan-500/20 border border-cyan-500/30"><Cloud className="h-7 w-7 text-cyan-400" /></div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white lg:text-3xl">API Gateway</h1>
              <p className="mt-1 text-sm text-cyan-300/70">REST endpoints, rate limiting & performance monitoring</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge label={`${healthy} Healthy`} variant="success" />
            <StatusBadge label={`${degraded} Degraded`} variant="warning" />
            <StatusBadge label={`Total: ${(totalRpm / 1000).toFixed(1)}k req/min`} variant="info" />
            <StatusBadge label={`Avg Latency: ${avgLatency}ms`} variant="purple" />
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <GlassCard className="border-cyan-500/15 bg-[rgba(20,80,100,0.3)] p-5"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/20"><Activity className="h-5 w-5 text-green-400" /></div><div><p className="text-xs text-white/50">Healthy</p><p className="text-2xl font-bold text-green-400">{healthy}/{ENDPOINTS.length}</p></div></div></GlassCard>
        <GlassCard className="border-cyan-500/15 bg-[rgba(20,80,100,0.3)] p-5"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/20"><AlertTriangle className="h-5 w-5 text-yellow-400" /></div><div><p className="text-xs text-white/50">Degraded</p><p className="text-2xl font-bold text-yellow-400">{degraded}</p></div></div></GlassCard>
        <GlassCard className="border-cyan-500/15 bg-[rgba(20,80,100,0.3)] p-5"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/20"><Database className="h-5 w-5 text-blue-400" /></div><div><p className="text-xs text-white/50">Throughput</p><p className="text-2xl font-bold text-blue-400">{(totalRpm / 1000).toFixed(1)}k/min</p></div></div></GlassCard>
        <GlassCard className="border-cyan-500/15 bg-[rgba(20,80,100,0.3)] p-5"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/20"><Zap className="h-5 w-5 text-purple-400" /></div><div><p className="text-xs text-white/50">Avg Latency</p><p className="text-2xl font-bold text-purple-400">{avgLatency}ms</p></div></div></GlassCard>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {(['all', 'healthy', 'degraded', 'down'] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={cn('px-3 py-1.5 rounded-lg text-xs font-medium transition-colors', filter === f ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'bg-white/5 text-white/50 hover:bg-white/10')}>{f.charAt(0).toUpperCase() + f.slice(1)}</button>
        ))}
      </div>

      <motion.div variants={containerVariants} initial="hidden" animate={mounted ? 'visible' : 'hidden'} className="space-y-3">
        {filtered.map((ep) => {
          const cfg = STATUS_CONFIG[ep.status];
          return (
            <motion.div key={ep.id} variants={itemVariants} className="group">
              <GlassCard className="border-white/5 p-4 hover:border-cyan-500/20 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 shrink-0"><Globe className="h-5 w-5 text-white/50" /></div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <code className="text-sm font-mono font-medium text-white bg-white/5 px-2 py-0.5 rounded">{ep.method}</code>
                        <h3 className="text-sm font-medium text-white truncate">{ep.path}</h3>
                        <span className={cn('px-2 py-0.5 rounded text-[10px] font-mono font-medium border', cfg.badge)}>{ep.status}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 shrink-0">
                    <div className="text-right"><p className="text-xs text-white/40">Latency</p><p className="font-mono font-semibold text-white">{ep.avgLatency}ms</p></div>
                    <div className="text-right"><p className="text-xs text-white/40">Req/min</p><p className="font-mono font-semibold text-white">{ep.requestsPerMin}</p></div>
                    <div className="text-right"><p className="text-xs text-white/40">Error Rate</p><p className={cn('font-mono font-semibold', ep.errorRate > 0.1 ? 'text-red-400' : ep.errorRate > 0.05 ? 'text-yellow-400' : 'text-green-400')}>{ep.errorRate}%</p></div>
                    <div className="text-right"><p className="text-xs text-white/40">Rate Limit</p><p className="font-mono font-semibold text-white">{ep.rateLimit}/min</p></div>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-4 pt-4 border-t border-white/5">
                  <div className="flex items-center gap-2"><Zap className="h-4 w-4 text-white/40" /><div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, ep.avgLatency / 5)}%` }} transition={{ duration: 0.8 }} className="h-full bg-gradient-to-r from-cyan-500 to-blue-500" /></div></div>
                  <div className="flex items-center gap-2"><Activity className="h-4 w-4 text-white/40" /><div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, ep.requestsPerMin / 40)}%` }} transition={{ duration: 0.8 }} className="h-full bg-gradient-to-r from-green-500 to-emerald-500" /></div></div>
                  <div className="flex items-center gap-2"><Lock className="h-4 w-4 text-white/40" /><div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, ep.errorRate * 50)}%` }} transition={{ duration: 0.8 }} className="h-full bg-gradient-to-r from-red-500 to-orange-500" /></div></div>
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}><GlassCard className="border-cyan-500/15 bg-[rgba(20,80,100,0.3)] p-6"><h2 className="mb-1 text-lg font-semibold text-white">Requests Per Minute</h2><p className="mb-4 text-xs text-white/40">Total API throughput</p><div className="h-64"><RealtimeChart data={Array.from({ length: 30 }, (_, i) => ({ time: `${i}`, value: Math.floor(Math.random() * 2000 + 8000) }))} color="#06b6d4" height={256} /></div></GlassCard></motion.div>
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}><GlassCard className="border-cyan-500/15 bg-[rgba(20,80,100,0.3)] p-6"><h2 className="mb-1 text-lg font-semibold text-white">Endpoint Latency Distribution</h2><p className="mb-4 text-xs text-white/40">Average latency by endpoint</p><div className="h-64"><BiometricBarChart data={ENDPOINTS.map(e => ({ name: e.path.replace('/v1/', ''), value: e.avgLatency, color: e.status === 'healthy' ? '#06b6d4' : e.status === 'degraded' ? '#f97316' : '#ef4444' }))} /></div></GlassCard></motion.div>
      </div>
    </div>
  );
}