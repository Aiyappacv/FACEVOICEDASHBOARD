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
  Database,
  HardDrive,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Activity,
  Zap,
  Globe,
  Shield,
} from 'lucide-react';

interface CloudResource {
  id: string;
  name: string;
  provider: 'aws' | 'azure' | 'gcp' | 'on-premise';
  region: string;
  type: string;
  status: 'running' | 'stopped' | 'degraded' | 'maintenance';
  cpu: number;
  memory: number;
  storage: number;
  network: number;
  costPerHour: number;
  uptime: number;
}

const CLOUD_RESOURCES: CloudResource[] = [
  { id: 'cr-1', name: 'biometric-api-prod', provider: 'aws', region: 'us-east-1', type: 'EC2 c6i.4xlarge', status: 'running', cpu: 45, memory: 52, storage: 67, network: 23, costPerHour: 0.68, uptime: 99.99 },
  { id: 'cr-2', name: 'ml-training-cluster', provider: 'aws', region: 'us-east-1', type: 'EC2 p4d.24xlarge', status: 'running', cpu: 78, memory: 84, storage: 45, network: 67, costPerHour: 32.77, uptime: 99.95 },
  { id: 'cr-3', name: 'inference-gpu-fleet', provider: 'aws', region: 'us-west-2', type: 'EC2 g5.12xlarge', status: 'running', cpu: 56, memory: 61, storage: 34, network: 38, costPerHour: 4.61, uptime: 99.97 },
  { id: 'cr-4', name: 'verification-api', provider: 'azure', region: 'eastus', type: 'Standard_NC24', status: 'running', cpu: 42, memory: 48, storage: 56, network: 29, costPerHour: 2.85, uptime: 99.98 },
  { id: 'cr-5', name: 'data-lake', provider: 'aws', region: 'us-east-1', type: 'S3 + Glacier', status: 'running', cpu: 0, memory: 0, storage: 89, network: 12, costPerHour: 0.23, uptime: 99.99 },
  { id: 'cr-6', name: 'redis-cache', provider: 'aws', region: 'us-east-1', type: 'ElastiCache r6g.xlarge', status: 'running', cpu: 23, memory: 78, storage: 12, network: 45, costPerHour: 0.31, uptime: 99.99 },
  { id: 'cr-7', name: 'postgres-primary', provider: 'aws', region: 'us-east-1', type: 'RDS db.r6g.2xlarge', status: 'running', cpu: 34, memory: 56, storage: 78, network: 18, costPerHour: 1.42, uptime: 99.99 },
  { id: 'cr-8', name: 'kafka-cluster', provider: 'azure', region: 'westeurope', type: 'Event Hubs', status: 'running', cpu: 31, memory: 42, storage: 23, network: 56, costPerHour: 0.89, uptime: 99.96 },
  { id: 'cr-9', name: 'model-registry', provider: 'gcp', region: 'us-central1', type: 'Vertex AI', status: 'maintenance', cpu: 12, memory: 18, storage: 45, network: 8, costPerHour: 0.56, uptime: 97.43 },
  { id: 'cr-10', name: 'edge-sync-service', provider: 'on-premise', region: 'nyc-dc-01', type: 'Kubernetes', status: 'running', cpu: 28, memory: 35, storage: 67, network: 89, costPerHour: 0.00, uptime: 99.97 },
  { id: 'cr-11', name: 'backup-vault', provider: 'aws', region: 'us-west-2', type: 'S3 Glacier Deep', status: 'running', cpu: 0, memory: 0, storage: 34, network: 2, costPerHour: 0.02, uptime: 99.99 },
  { id: 'cr-12', name: 'monitoring-stack', provider: 'on-premise', region: 'nyc-dc-01', type: 'Prometheus/Grafana', status: 'running', cpu: 15, memory: 22, storage: 56, network: 12, costPerHour: 0.00, uptime: 99.98 },
];

const PROVIDER_COLORS = {
  aws: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  azure: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  gcp: 'bg-green-500/20 text-green-400 border-green-500/30',
  'on-premise': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
};

const STATUS_CONFIG = {
  running: { badge: 'bg-green-500/20 text-green-400 border-green-500/30', dot: 'bg-green-500' },
  stopped: { badge: 'bg-gray-500/20 text-gray-400 border-gray-500/30', dot: 'bg-gray-500' },
  degraded: { badge: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', dot: 'bg-yellow-500' },
  maintenance: { badge: 'bg-blue-500/20 text-blue-400 border-blue-500/30', dot: 'bg-blue-500' },
};

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 24 } } };

export default function CloudPage() {
  const [mounted, setMounted] = useState(false);
  const [filter, setFilter] = useState<'all' | 'running' | 'degraded' | 'maintenance'>('all');
  const [view, setView] = useState<'list' | 'cost'>('list');

  useEffect(() => { setMounted(true); }, []);

  const filtered = CLOUD_RESOURCES.filter(r => filter === 'all' || r.status === filter);
  const running = CLOUD_RESOURCES.filter(r => r.status === 'running').length;
  const degraded = CLOUD_RESOURCES.filter(r => r.status === 'degraded').length;
  const maintenance = CLOUD_RESOURCES.filter(r => r.status === 'maintenance').length;
  const totalCost = CLOUD_RESOURCES.reduce((a, r) => a + r.costPerHour, 0);
  const monthlyCost = totalCost * 24 * 30;

  return (
    <div className="min-h-screen bg-[#0a0408] p-6 lg:p-8 space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="relative overflow-hidden rounded-2xl border border-orange-500/20 bg-gradient-to-r from-orange-950/60 via-[rgba(120,60,20,0.3)] to-amber-950/50 p-6 lg:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(249,115,22,0.12),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(245,158,11,0.08),transparent_60%)]" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-orange-500/20 border border-orange-500/30"><Cloud className="h-7 w-7 text-orange-400" /></div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white lg:text-3xl">Cloud Infrastructure</h1>
              <p className="mt-1 text-sm text-orange-300/70">Multi-cloud resources, costs & capacity planning</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge label={`${running} Running`} variant="success" />
            <StatusBadge label={`$${monthlyCost.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}/mo`} variant="warning" />
            <button onClick={() => setView(v => v === 'list' ? 'cost' : 'list')} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-orange-500/20 text-orange-300 border border-orange-500/30 hover:bg-orange-500/30">{view === 'list' ? 'Cost View' : 'List View'}</button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <GlassCard className="border-orange-500/15 bg-[rgba(120,60,20,0.3)] p-5"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/20"><Server className="h-5 w-5 text-green-400" /></div><div><p className="text-xs text-white/50">Running</p><p className="text-2xl font-bold text-green-400">{running}/{CLOUD_RESOURCES.length}</p></div></div></GlassCard>
        <GlassCard className="border-orange-500/15 bg-[rgba(120,60,20,0.3)] p-5"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/20"><DollarSign className="h-5 w-5 text-yellow-400" /></div><div><p className="text-xs text-white/50">Hourly Cost</p><p className="text-2xl font-bold text-yellow-400">$${totalCost.toFixed(2)}/hr</p></div></div></GlassCard>
        <GlassCard className="border-orange-500/15 bg-[rgba(120,60,20,0.3)] p-5"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/20"><DollarSign className="h-5 w-5 text-orange-400" /></div><div><p className="text-xs text-white/50">Monthly Est.</p><p className="text-2xl font-bold text-orange-400">${monthlyCost.toLocaleString(undefined, {minimumFractionDigits: 0})}</p></div></div></GlassCard>
        <GlassCard className="border-orange-500/15 bg-[rgba(120,60,20,0.3)] p-5"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/20"><Globe className="h-5 w-5 text-purple-400" /></div><div><p className="text-xs text-white/50">Providers</p><p className="text-2xl font-bold text-purple-400">4</p></div></div></GlassCard>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {(['all', 'running', 'degraded', 'maintenance'] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={cn('px-3 py-1.5 rounded-lg text-xs font-medium transition-colors', filter === f ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' : 'bg-white/5 text-white/50 hover:bg-white/10')}>{f.charAt(0).toUpperCase() + f.slice(1)}</button>
        ))}
      </div>

      <motion.div variants={containerVariants} initial="hidden" animate={mounted ? 'visible' : 'hidden'} className="space-y-3">
        {filtered.map((resource) => {
          const cfg = STATUS_CONFIG[resource.status];
          const providerColor = PROVIDER_COLORS[resource.provider];
          return (
            <motion.div key={resource.id} variants={itemVariants} className="group">
              <GlassCard className="border-white/5 p-4 hover:border-orange-500/20 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 shrink-0"><Cloud className="h-5 w-5 text-white/50" /></div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-medium text-white truncate">{resource.name}</h3>
                        <span className={cn('px-2 py-0.5 rounded text-[10px] font-mono font-medium border', cfg.badge)}>{resource.status}</span>
                        <span className={cn('px-2 py-0.5 rounded text-[10px] font-mono font-medium border', providerColor)}>{resource.provider.toUpperCase()}</span>
                      </div>
                      <div className="mt-0.5 flex items-center gap-2 text-xs text-white/40">
                        <span>{resource.region}</span>
                        <span>•</span>
                        <span>{resource.type}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 shrink-0">
                    <div className="text-right"><p className="text-xs text-white/40">CPU</p><p className="font-mono font-semibold text-white">{resource.cpu}%</p></div>
                    <div className="text-right"><p className="text-xs text-white/40">Memory</p><p className="font-mono font-semibold text-white">{resource.memory}%</p></div>
                    <div className="text-right"><p className="text-xs text-white/40">Storage</p><p className="font-mono font-semibold text-white">{resource.storage}%</p></div>
                    <div className="text-right"><p className="text-xs text-white/40">Cost/hr</p><p className="font-mono font-semibold text-yellow-400">${resource.costPerHour.toFixed(2)}</p></div>
                    <div className="text-right"><p className="text-xs text-white/40">Uptime</p><p className="font-mono font-semibold text-white">{resource.uptime}%</p></div>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-4 gap-4 pt-4 border-t border-white/5">
                  <div className="flex items-center gap-2"><Cpu className="h-4 w-4 text-white/40" /><div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${resource.cpu}%` }} transition={{ duration: 0.8 }} className="h-full bg-gradient-to-r from-orange-500 to-red-500" /></div></div>
                  <div className="flex items-center gap-2"><HardDrive className="h-4 w-4 text-white/40" /><div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${resource.memory}%` }} transition={{ duration: 0.8 }} className="h-full bg-gradient-to-r from-yellow-500 to-amber-500" /></div></div>
                  <div className="flex items-center gap-2"><Database className="h-4 w-4 text-white/40" /><div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${resource.storage}%` }} transition={{ duration: 0.8 }} className="h-full bg-gradient-to-r from-blue-500 to-cyan-500" /></div></div>
                  <div className="flex items-center gap-2"><DollarSign className="h-4 w-4 text-white/40" /><div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, resource.costPerHour * 5)}%` }} transition={{ duration: 0.8 }} className="h-full bg-gradient-to-r from-green-500 to-emerald-500" /></div></div>
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}><GlassCard className="border-orange-500/15 bg-[rgba(120,60,20,0.3)] p-6"><h2 className="mb-1 text-lg font-semibold text-white">Hourly Cost Trend</h2><p className="mb-4 text-xs text-white/40">Cloud spend over time</p><div className="h-64"><RealtimeChart data={Array.from({ length: 30 }, (_, i) => ({ time: `${i}`, value: Math.floor(Math.random() * 20 + 40) }))} color="#f97316" height={256} /></div></GlassCard></motion.div>
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}><GlassCard className="border-orange-500/15 bg-[rgba(120,60,20,0.3)] p-6"><h2 className="mb-1 text-lg font-semibold text-white">Cost by Provider</h2><p className="mb-4 text-xs text-white/40">Monthly cost distribution</p><div className="h-64"><BiometricBarChart data={[{ name: 'AWS', value: 3845, color: '#f97316' }, { name: 'Azure', value: 1240, color: '#3b82f6' }, { name: 'GCP', value: 403, color: '#22c55e' }, { name: 'On-Premise', value: 0, color: '#a855f7' }]} /></div></GlassCard></motion.div>
      </div>
    </div>
  );
}