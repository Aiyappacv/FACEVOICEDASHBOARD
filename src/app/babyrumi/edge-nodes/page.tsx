'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { RealtimeChart } from '@/components/charts/realtime-chart';
import { BiometricBarChart } from '@/components/charts/bar-chart';
import { cn } from '@/lib/utils';
import {
  Globe,
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
} from 'lucide-react';

interface EdgeNode {
  id: string;
  name: string;
  location: string;
  status: 'online' | 'offline' | 'degraded' | 'maintenance';
  region: string;
  cpuUsage: number;
  memoryUsage: number;
  gpuUsage: number;
  throughput: number;
  latency: number;
  uptime: number;
  models: string[];
  lastHeartbeat: Date;
}

const EDGE_NODES: EdgeNode[] = [
  { id: 'node-001', name: 'NYC-Edge-01', location: 'New York, US', status: 'online', region: 'North America', cpuUsage: 67, memoryUsage: 72, gpuUsage: 84, throughput: 1247, latency: 14, uptime: 99.97, models: ['ArcFace v3.2.1', 'RetinaFace v2.8.0', 'ECAPA-TDNN v2.1'], lastHeartbeat: new Date(Date.now() - 2000) },
  { id: 'node-002', name: 'LHR-Edge-01', location: 'London, UK', status: 'online', region: 'Europe', cpuUsage: 54, memoryUsage: 61, gpuUsage: 71, throughput: 987, latency: 12, uptime: 99.99, models: ['ArcFace v3.2.1', 'RetinaFace v2.8.0', 'Whisper v4.0'], lastHeartbeat: new Date(Date.now() - 1000) },
  { id: 'node-003', name: 'TYO-Edge-01', location: 'Tokyo, JP', status: 'online', region: 'Asia Pacific', cpuUsage: 78, memoryUsage: 82, gpuUsage: 92, throughput: 1456, latency: 18, uptime: 99.95, models: ['ArcFace v3.2.1', 'RetinaFace v2.8.0', 'ECAPA-TDNN v2.1', 'Fusion AI v5.0'], lastHeartbeat: new Date(Date.now() - 3000) },
  { id: 'node-004', name: 'SGP-Edge-01', location: 'Singapore, SG', status: 'online', region: 'Asia Pacific', cpuUsage: 45, memoryUsage: 52, gpuUsage: 63, throughput: 876, latency: 8, uptime: 99.98, models: ['ArcFace v3.2.1', 'Whisper v4.0', 'Deepfake AI v3.5'], lastHeartbeat: new Date(Date.now() - 1000) },
  { id: 'node-005', name: 'FRA-Edge-01', location: 'Frankfurt, DE', status: 'online', region: 'Europe', cpuUsage: 38, memoryUsage: 44, gpuUsage: 51, throughput: 654, latency: 11, uptime: 99.99, models: ['ArcFace v3.2.1', 'RetinaFace v2.8.0', 'CNN Minutiae v3.0'], lastHeartbeat: new Date(Date.now() - 2000) },
  { id: 'node-006', name: 'SYD-Edge-01', location: 'Sydney, AU', status: 'degraded', region: 'Asia Pacific', cpuUsage: 89, memoryUsage: 91, gpuUsage: 95, throughput: 342, latency: 45, uptime: 98.72, models: ['ArcFace v3.2.1', 'Whisper v4.0'], lastHeartbeat: new Date(Date.now() - 15000) },
  { id: 'node-007', name: 'DXB-Edge-01', location: 'Dubai, AE', status: 'online', region: 'Middle East', cpuUsage: 52, memoryUsage: 58, gpuUsage: 67, throughput: 789, latency: 15, uptime: 99.96, models: ['ArcFace v3.2.1', 'ECAPA-TDNN v2.1', 'Risk AI v4.2'], lastHeartbeat: new Date(Date.now() - 2000) },
  { id: 'node-008', name: 'GRU-Edge-01', location: 'São Paulo, BR', status: 'maintenance', region: 'South America', cpuUsage: 12, memoryUsage: 28, gpuUsage: 0, throughput: 0, latency: 0, uptime: 97.43, models: [], lastHeartbeat: new Date(Date.now() - 1800000) },
  { id: 'node-009', name: 'SEL-Edge-01', location: 'Seoul, KR', status: 'online', region: 'Asia Pacific', cpuUsage: 61, memoryUsage: 68, gpuUsage: 74, throughput: 1123, latency: 16, uptime: 99.94, models: ['ArcFace v3.2.1', 'Fusion AI v5.0', 'Deepfake AI v3.5'], lastHeartbeat: new Date(Date.now() - 2000) },
  { id: 'node-010', name: 'YYZ-Edge-01', location: 'Toronto, CA', status: 'online', region: 'North America', cpuUsage: 42, memoryUsage: 49, gpuUsage: 55, throughput: 567, latency: 22, uptime: 99.96, models: ['ArcFace v3.2.1', 'Risk AI v4.2'], lastHeartbeat: new Date(Date.now() - 1000) },
];

const STATUS_CONFIG = {
  online: { dot: 'bg-green-500', badge: 'bg-green-500/20 text-green-400 border-green-500/30', text: 'text-green-400' },
  offline: { dot: 'bg-red-500', badge: 'bg-red-500/20 text-red-400 border-red-500/30', text: 'text-red-400' },
  degraded: { dot: 'bg-yellow-500', badge: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', text: 'text-yellow-400' },
  maintenance: { dot: 'bg-blue-500', badge: 'bg-blue-500/20 text-blue-400 border-blue-500/30', text: 'text-blue-400' },
};

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 24 } } };

export default function EdgeNodesPage() {
  const [mounted, setMounted] = useState(false);
  const [filter, setFilter] = useState<'all' | 'online' | 'degraded' | 'offline' | 'maintenance'>('all');

  useEffect(() => { setMounted(true); }, []);

  const filtered = EDGE_NODES.filter(n => filter === 'all' || n.status === filter);
  const online = EDGE_NODES.filter(n => n.status === 'online').length;
  const degraded = EDGE_NODES.filter(n => n.status === 'degraded').length;
  const offline = EDGE_NODES.filter(n => n.status === 'offline').length;
  const maintenance = EDGE_NODES.filter(n => n.status === 'maintenance').length;
  const totalThroughput = EDGE_NODES.reduce((a, n) => a + n.throughput, 0);
  const avgLatency = Math.round(EDGE_NODES.filter(n => n.status === 'online').reduce((a, n) => a + n.latency, 0) / online);
  const totalModels = new Set(EDGE_NODES.flatMap(n => n.models)).size;

  return (
    <div className="min-h-screen bg-[#0a0408] p-6 lg:p-8 space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="relative overflow-hidden rounded-2xl border border-blue-500/20 bg-gradient-to-r from-blue-950/60 via-[rgba(30,60,120,0.3)] to-indigo-950/50 p-6 lg:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.12),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(99,102,241,0.08),transparent_60%)]" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-500/20 border border-blue-500/30"><Globe className="h-7 w-7 text-blue-400" /></div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white lg:text-3xl">Edge Nodes</h1>
              <p className="mt-1 text-sm text-blue-300/70">Global biometric processing edge infrastructure</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge label={`${online} Online`} variant="success" />
            <StatusBadge label={`${degraded} Degraded`} variant="warning" />
            <StatusBadge label={`Total Throughput: ${(totalThroughput / 1000).toFixed(1)}k req/s`} variant="info" />
            <StatusBadge label={`Avg Latency: ${avgLatency}ms`} variant="purple" />
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <GlassCard className="border-blue-500/15 bg-[rgba(30,60,120,0.3)] p-5"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/20"><Activity className="h-5 w-5 text-green-400" /></div><div><p className="text-xs text-white/50">Online Nodes</p><p className="text-2xl font-bold text-green-400">{online}/{EDGE_NODES.length}</p></div></div></GlassCard>
        <GlassCard className="border-blue-500/15 bg-[rgba(30,60,120,0.3)] p-5"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/20"><Database className="h-5 w-5 text-purple-400" /></div><div><p className="text-xs text-white/50">Total Throughput</p><p className="text-2xl font-bold text-purple-400">{totalThroughput.toLocaleString()}/s</p></div></div></GlassCard>
        <GlassCard className="border-blue-500/15 bg-[rgba(30,60,120,0.3)] p-5"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/20"><Zap className="h-5 w-5 text-blue-400" /></div><div><p className="text-xs text-white/50">Avg Latency</p><p className="text-2xl font-bold text-blue-400">{avgLatency}ms</p></div></div></GlassCard>
        <GlassCard className="border-blue-500/15 bg-[rgba(30,60,120,0.3)] p-5"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/20"><CheckCircle2 className="h-5 w-5 text-cyan-400" /></div><div><p className="text-xs text-white/50">Models Deployed</p><p className="text-2xl font-bold text-cyan-400">{totalModels}</p></div></div></GlassCard>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {(['all', 'online', 'degraded', 'maintenance'] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={cn('px-3 py-1.5 rounded-lg text-xs font-medium transition-colors', filter === f ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'bg-white/5 text-white/50 hover:bg-white/10')}>{f.charAt(0).toUpperCase() + f.slice(1)}</button>
        ))}
      </div>

      <motion.div variants={containerVariants} initial="hidden" animate={mounted ? 'visible' : 'hidden'} className="space-y-3">
        {filtered.map((node) => {
          const cfg = STATUS_CONFIG[node.status];
          return (
            <motion.div key={node.id} variants={itemVariants} className="group">
              <GlassCard className="border-white/5 p-4 hover:border-blue-500/20 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 shrink-0"><Globe className="h-5 w-5 text-white/50" /></div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-medium text-white truncate">{node.name}</h3>
                        <span className={cn('px-2 py-0.5 rounded text-[10px] font-mono font-medium border', cfg.badge)}>{node.status}</span>
                        <span className="text-xs text-white/40 px-2 py-0.5 rounded bg-white/5">{node.region}</span>
                      </div>
                      <div className="mt-0.5 text-xs text-white/40">{node.location}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 shrink-0">
                    <div className="text-right"><p className="text-xs text-white/40">Throughput</p><p className="font-mono font-semibold text-white">{node.throughput}/s</p></div>
                    <div className="text-right"><p className="text-xs text-white/40">Latency</p><p className="font-mono font-semibold text-white">{node.latency}ms</p></div>
                    <div className="text-right"><p className="text-xs text-white/40">Uptime</p><p className="font-mono font-semibold text-white">{node.uptime}%</p></div>
                    <div className="text-right"><p className="text-xs text-white/40">Models</p><p className="font-mono font-semibold text-white">{node.models.length}</p></div>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-4 pt-4 border-t border-white/5">
                  <div className="flex items-center gap-2"><Cpu className="h-4 w-4 text-white/40" /><div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${node.cpuUsage}%` }} transition={{ duration: 0.8 }} className="h-full bg-gradient-to-r from-blue-500 to-purple-500" /></div></div>
                  <div className="flex items-center gap-2"><HardDrive className="h-4 w-4 text-white/40" /><div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${node.memoryUsage}%` }} transition={{ duration: 0.8 }} className="h-full bg-gradient-to-r from-purple-500 to-pink-500" /></div></div>
                  <div className="flex items-center gap-2"><Wifi className="h-4 w-4 text-white/40" /><div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, node.gpuUsage)}%` }} transition={{ duration: 0.8 }} className="h-full bg-gradient-to-r from-cyan-500 to-teal-500" /></div></div>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {node.models.map((m) => <span key={m} className="px-2 py-0.5 text-[10px] font-medium rounded bg-white/5 text-white/60 border border-white/10">{m}</span>)}
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}><GlassCard className="border-blue-500/15 bg-[rgba(30,60,120,0.3)] p-6"><h2 className="mb-1 text-lg font-semibold text-white">Global Throughput</h2><p className="mb-4 text-xs text-white/40">Combined requests per second across all edge nodes</p><div className="h-64"><RealtimeChart data={Array.from({ length: 30 }, (_, i) => ({ time: `${i}`, value: Math.floor(Math.random() * 500 + 6000) }))} color="#3b82f6" height={256} /></div></GlassCard></motion.div>
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}><GlassCard className="border-blue-500/15 bg-[rgba(30,60,120,0.3)] p-6"><h2 className="mb-1 text-lg font-semibold text-white">Nodes by Region</h2><p className="mb-4 text-xs text-white/40">Edge node distribution</p><div className="h-64"><BiometricBarChart data={[{ name: 'North America', value: 2, color: '#3b82f6' }, { name: 'Europe', value: 2, color: '#8b5cf6' }, { name: 'Asia Pacific', value: 3, color: '#06b6d4' }, { name: 'Middle East', value: 1, color: '#f97316' }, { name: 'South America', value: 1, color: '#22c55e' }]} /></div></GlassCard></motion.div>
      </div>
    </div>
  );
}