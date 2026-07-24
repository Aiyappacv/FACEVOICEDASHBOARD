'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { RealtimeChart } from '@/components/charts/realtime-chart';
import { BiometricBarChart } from '@/components/charts/bar-chart';
import { cn } from '@/lib/utils';
import {
  Server,
  Cpu,
  HardDrive,
  Wifi,
  Thermometer,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Activity,
  Database,
  Shield,
} from 'lucide-react';

interface Device {
  id: string;
  name: string;
  type: string;
  location: string;
  status: 'online' | 'offline' | 'degraded' | 'maintenance';
  cpuUsage: number;
  memoryUsage: number;
  gpuUsage: number;
  throughput: number;
  latency: number;
  uptime: number;
  lastHeartbeat: Date;
}

const DEVICES: Device[] = [
  { id: 'dev-001', name: 'NYC-Edge-01', type: 'Edge Server', location: 'New York, US', status: 'online', cpuUsage: 67, memoryUsage: 72, gpuUsage: 84, throughput: 1247, latency: 14, uptime: 99.97, lastHeartbeat: new Date(Date.now() - 2000) },
  { id: 'dev-002', name: 'LHR-Edge-01', type: 'Edge Server', location: 'London, UK', status: 'online', cpuUsage: 54, memoryUsage: 61, gpuUsage: 71, throughput: 987, latency: 12, uptime: 99.99, lastHeartbeat: new Date(Date.now() - 1000) },
  { id: 'dev-003', name: 'TYO-Edge-01', type: 'Edge Server', location: 'Tokyo, JP', status: 'online', cpuUsage: 78, memoryUsage: 82, gpuUsage: 92, throughput: 1456, latency: 18, uptime: 99.95, lastHeartbeat: new Date(Date.now() - 3000) },
  { id: 'dev-004', name: 'SGP-Edge-01', type: 'Edge Server', location: 'Singapore, SG', status: 'online', cpuUsage: 45, memoryUsage: 52, gpuUsage: 63, throughput: 876, latency: 8, uptime: 99.98, lastHeartbeat: new Date(Date.now() - 1000) },
  { id: 'dev-005', name: 'FRA-Edge-01', type: 'Edge Server', location: 'Frankfurt, DE', status: 'online', cpuUsage: 38, memoryUsage: 44, gpuUsage: 51, throughput: 654, latency: 11, uptime: 99.99, lastHeartbeat: new Date(Date.now() - 2000) },
  { id: 'dev-006', name: 'SYD-Edge-01', type: 'Edge Server', location: 'Sydney, AU', status: 'degraded', cpuUsage: 89, memoryUsage: 91, gpuUsage: 95, throughput: 342, latency: 45, uptime: 98.72, lastHeartbeat: new Date(Date.now() - 15000) },
  { id: 'dev-007', name: 'DXB-Edge-01', type: 'Edge Server', location: 'Dubai, AE', status: 'online', cpuUsage: 52, memoryUsage: 58, gpuUsage: 67, throughput: 789, latency: 15, uptime: 99.96, lastHeartbeat: new Date(Date.now() - 2000) },
  { id: 'dev-008', name: 'GRU-Edge-01', type: 'Edge Server', location: 'São Paulo, BR', status: 'maintenance', cpuUsage: 12, memoryUsage: 28, gpuUsage: 0, throughput: 0, latency: 0, uptime: 97.43, lastHeartbeat: new Date(Date.now() - 1800000) },
  { id: 'dev-009', name: 'NYC-Cloud-01', type: 'Cloud Instance', location: 'AWS us-east-1', status: 'online', cpuUsage: 34, memoryUsage: 41, gpuUsage: 28, throughput: 2100, latency: 5, uptime: 99.99, lastHeartbeat: new Date(Date.now() - 500) },
  { id: 'dev-010', name: 'EUC-Cloud-01', type: 'Cloud Instance', location: 'Azure eu-central-1', status: 'online', cpuUsage: 29, memoryUsage: 35, gpuUsage: 22, throughput: 1876, latency: 6, uptime: 99.98, lastHeartbeat: new Date(Date.now() - 500) },
];

const STATUS_CONFIG = {
  online: { dot: 'bg-green-500', badge: 'bg-green-500/20 text-green-400 border-green-500/30', text: 'text-green-400' },
  offline: { dot: 'bg-red-500', badge: 'bg-red-500/20 text-red-400 border-red-500/30', text: 'text-red-400' },
  degraded: { dot: 'bg-yellow-500', badge: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', text: 'text-yellow-400' },
  maintenance: { dot: 'bg-blue-500', badge: 'bg-blue-500/20 text-blue-400 border-blue-500/30', text: 'text-blue-400' },
};

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 24 } } };

export default function DevicesPage() {
  const [mounted, setMounted] = useState(false);
  const [filter, setFilter] = useState<'all' | 'online' | 'degraded' | 'offline' | 'maintenance'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'cpuUsage' | 'memoryUsage' | 'gpuUsage' | 'throughput' | 'latency' | 'uptime'>('name');

  useEffect(() => { setMounted(true); }, []);

  const filtered = DEVICES.filter(d => filter === 'all' || d.status === filter);
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    const key = sortBy as keyof Device;
    return (b[key] as number) - (a[key] as number);
  });

  const online = DEVICES.filter(d => d.status === 'online').length;
  const degraded = DEVICES.filter(d => d.status === 'degraded').length;
  const offline = DEVICES.filter(d => d.status === 'offline').length;
  const maintenance = DEVICES.filter(d => d.status === 'maintenance').length;
  const avgCpu = Math.round(DEVICES.reduce((a, d) => a + d.cpuUsage, 0) / DEVICES.length);
  const avgGpu = Math.round(DEVICES.reduce((a, d) => a + d.gpuUsage, 0) / DEVICES.length);
  const totalThroughput = DEVICES.reduce((a, d) => a + d.throughput, 0);

  return (
    <div className="min-h-screen bg-[#0a0408] p-6 lg:p-8 space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="relative overflow-hidden rounded-2xl border border-purple-500/20 bg-gradient-to-r from-purple-950/60 via-[rgba(80,40,120,0.3)] to-indigo-950/50 p-6 lg:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(168,85,247,0.12),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(99,102,241,0.08),transparent_60%)]" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-purple-500/20 border border-purple-500/30"><Server className="h-7 w-7 text-purple-400" /></div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white lg:text-3xl">Devices & Infrastructure</h1>
              <p className="mt-1 text-sm text-purple-300/70">Edge nodes, cloud instances & biometric processing hardware</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge label={`${online} Online`} variant="success" />
            <StatusBadge label={`${degraded} Degraded`} variant="warning" />
            <StatusBadge label={`${maintenance} Maintenance`} variant="info" />
            <StatusBadge label={`Total Throughput: ${(totalThroughput / 1000).toFixed(1)}k req/s`} variant="purple" />
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <GlassCard className="border-purple-500/15 bg-[rgba(80,40,120,0.3)] p-5"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/20"><Activity className="h-5 w-5 text-green-400" /></div><div><p className="text-xs text-white/50">Avg CPU</p><p className="text-2xl font-bold text-green-400">{avgCpu}%</p></div></div></GlassCard>
        <GlassCard className="border-purple-500/15 bg-[rgba(80,40,120,0.3)] p-5"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/20"><Cpu className="h-5 w-5 text-purple-400" /></div><div><p className="text-xs text-white/50">Avg GPU</p><p className="text-2xl font-bold text-purple-400">{avgGpu}%</p></div></div></GlassCard>
        <GlassCard className="border-purple-500/15 bg-[rgba(80,40,120,0.3)] p-5"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/20"><Database className="h-5 w-5 text-blue-400" /></div><div><p className="text-xs text-white/50">Total Throughput</p><p className="text-2xl font-bold text-blue-400">{totalThroughput.toLocaleString()}/s</p></div></div></GlassCard>
        <GlassCard className="border-purple-500/15 bg-[rgba(80,40,120,0.3)] p-5"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/20"><Shield className="h-5 w-5 text-orange-400" /></div><div><p className="text-xs text-white/50">Devices Online</p><p className="text-2xl font-bold text-orange-400">{online}/{DEVICES.length}</p></div></div></GlassCard>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {(['all', 'online', 'degraded', 'maintenance'] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={cn('px-3 py-1.5 rounded-lg text-xs font-medium transition-colors', filter === f ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-white/5 text-white/50 hover:bg-white/10')}>{f.charAt(0).toUpperCase() + f.slice(1)}</button>
        ))}
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} className="ml-auto px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 text-white border border-white/10">
          <option value="name">Sort: Name</option>
          <option value="cpu">Sort: CPU %</option>
          <option value="gpu">Sort: GPU %</option>
          <option value="throughput">Sort: Throughput</option>
          <option value="latency">Sort: Latency</option>
          <option value="uptime">Sort: Uptime</option>
        </select>
      </div>

      <motion.div variants={containerVariants} initial="hidden" animate={mounted ? 'visible' : 'hidden'} className="space-y-3">
        {sorted.map((device) => {
          const cfg = STATUS_CONFIG[device.status];
          const timeSinceHeartbeat = Date.now() - device.lastHeartbeat.getTime();
          const heartbeatText = timeSinceHeartbeat < 5000 ? 'Just now' : timeSinceHeartbeat < 60000 ? `${Math.floor(timeSinceHeartbeat / 1000)}s ago` : `${Math.floor(timeSinceHeartbeat / 60000)}m ago`;
          return (
            <motion.div key={device.id} variants={itemVariants} className="group">
              <GlassCard className="border-white/5 p-4 hover:border-purple-500/20 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 shrink-0"><Server className="h-5 w-5 text-white/50" /></div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-medium text-white truncate">{device.name}</h3>
                        <span className={cn('px-2 py-0.5 rounded text-[10px] font-mono font-medium border', cfg.badge)}>{device.status}</span>
                        <span className="text-xs text-white/40 px-2 py-0.5 rounded bg-white/5">{device.type}</span>
                      </div>
                      <div className="mt-0.5 flex items-center gap-2 text-xs text-white/40">
                        <span>{device.location}</span>
                        <span>•</span>
                        <span>Last seen: {heartbeatText}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 shrink-0">
                    <div className="text-right"><p className="text-xs text-white/40">CPU</p><p className="font-mono font-semibold text-white">{device.cpuUsage}%</p></div>
                    <div className="text-right"><p className="text-xs text-white/40">GPU</p><p className="font-mono font-semibold text-white">{device.gpuUsage}%</p></div>
                    <div className="text-right"><p className="text-xs text-white/40">Throughput</p><p className="font-mono font-semibold text-white">{device.throughput}/s</p></div>
                    <div className="text-right"><p className="text-xs text-white/40">Latency</p><p className="font-mono font-semibold text-white">{device.latency}ms</p></div>
                    <div className="text-right"><p className="text-xs text-white/40">Uptime</p><p className="font-mono font-semibold text-white">{device.uptime}%</p></div>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-4 pt-4 border-t border-white/5">
                  <div className="flex items-center gap-2"><Cpu className="h-4 w-4 text-white/40" /><div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${device.cpuUsage}%` }} transition={{ duration: 0.8, ease: 'easeOut' }} className="h-full bg-gradient-to-r from-purple-500 to-pink-500" /></div></div>
                  <div className="flex items-center gap-2"><HardDrive className="h-4 w-4 text-white/40" /><div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${device.memoryUsage}%` }} transition={{ duration: 0.8, ease: 'easeOut' }} className="h-full bg-gradient-to-r from-blue-500 to-cyan-500" /></div></div>
                  <div className="flex items-center gap-2"><Wifi className="h-4 w-4 text-white/40" /><div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, device.latency * 2)}%` }} transition={{ duration: 0.8, ease: 'easeOut' }} className="h-full bg-gradient-to-r from-green-500 to-yellow-500" /></div></div>
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}><GlassCard className="border-purple-500/15 bg-[rgba(80,40,120,0.3)] p-6"><h2 className="mb-1 text-lg font-semibold text-white">CPU Utilization Trend</h2><p className="mb-4 text-xs text-white/40">Average CPU across all devices</p><div className="h-64"><RealtimeChart data={Array.from({ length: 30 }, (_, i) => ({ time: `${i}`, value: Math.floor(Math.random() * 30 + 40) }))} color="#a855f7" height={256} /></div></GlassCard></motion.div>
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}><GlassCard className="border-purple-500/15 bg-[rgba(80,40,120,0.3)] p-6"><h2 className="mb-1 text-lg font-semibold text-white">Device Type Distribution</h2><p className="mb-4 text-xs text-white/40">Devices by category</p><div className="h-64"><BiometricBarChart data={[{ name: 'Edge Servers', value: 8, color: '#a855f7' }, { name: 'Cloud Instances', value: 2, color: '#3b82f6' }]} /></div></GlassCard></motion.div>
      </div>
    </div>
  );
}