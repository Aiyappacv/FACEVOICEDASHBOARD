'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/glass-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { ProgressRing } from '@/components/ui/progress-ring';
import { RealtimeChart } from '@/components/charts/realtime-chart';
import { cn } from '@/lib/utils';
import { Brain, Activity, Cpu, Database, GitBranch, AlertTriangle, RefreshCw, TrendingUp } from 'lucide-react';

const models = [
  { name: 'ArcFace', accuracy: 99.7, inference: 12, gpu: 67, memory: 4.2, status: 'healthy' as const, color: '#a855f7' },
  { name: 'RetinaFace', accuracy: 99.2, inference: 18, gpu: 72, memory: 3.8, status: 'healthy' as const, color: '#6366f1' },
  { name: 'Whisper', accuracy: 98.8, inference: 45, gpu: 81, memory: 6.1, status: 'healthy' as const, color: '#ec4899' },
  { name: 'ECAPA-TDNN', accuracy: 99.1, inference: 22, gpu: 58, memory: 2.9, status: 'healthy' as const, color: '#14b8a6' },
  { name: 'CNN Minutiae', accuracy: 98.5, inference: 35, gpu: 63, memory: 5.0, status: 'degraded' as const, color: '#f59e0b' },
  { name: 'Fusion AI', accuracy: 99.6, inference: 28, gpu: 88, memory: 7.2, status: 'healthy' as const, color: '#06b6d4' },
  { name: 'Risk AI', accuracy: 97.9, inference: 15, gpu: 45, memory: 2.1, status: 'healthy' as const, color: '#8b5cf6' },
  { name: 'Deepfake AI', accuracy: 96.3, inference: 52, gpu: 92, memory: 8.5, status: 'offline' as const, color: '#ef4444' },
];

const retrainingJobs = [
  { model: 'ArcFace', progress: 78, eta: '2h 15m', epoch: '48/60' },
  { model: 'ECAPA-TDNN', progress: 45, eta: '4h 30m', epoch: '27/60' },
  { model: 'Deepfake AI', progress: 12, eta: '8h 00m', epoch: '7/60' },
];

const driftData = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  value: Math.random() * 3 + 0.5,
}));

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function MLOpsPage() {
  const [selectedModel, setSelectedModel] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0015] via-[#120025] to-[#0a0015] p-6">
      <motion.div variants={container} initial="hidden" animate="show" className="max-w-7xl mx-auto space-y-6">
        <motion.div variants={item} className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-violet-500/20 border border-purple-500/20">
            <Brain className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">MLOps Center</h1>
            <p className="text-sm text-purple-300/60">Model lifecycle management & monitoring</p>
          </div>
        </motion.div>

        <motion.div variants={item} className="grid grid-cols-4 gap-4">
          {[
            { label: 'Total Models', value: '8', icon: Brain, color: 'text-purple-400' },
            { label: 'Healthy', value: '6', icon: Activity, color: 'text-emerald-400' },
            { label: 'Degraded', value: '1', icon: AlertTriangle, color: 'text-amber-400' },
            { label: 'Offline', value: '1', icon: Cpu, color: 'text-red-400' },
          ].map((s) => (
            <GlassCard key={s.label} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-purple-300/50 uppercase tracking-wider">{s.label}</p>
                  <p className={cn('text-3xl font-bold mt-1', s.color)}>{s.value}</p>
                </div>
                <s.icon className={cn('w-8 h-8 opacity-40', s.color)} />
              </div>
            </GlassCard>
          ))}
        </motion.div>

        <motion.div variants={item}>
          <h2 className="text-lg font-semibold text-white mb-3">Model Performance</h2>
          <div className="grid grid-cols-2 gap-4">
            {models.map((m, i) => (
              <GlassCard
                key={m.name}
                className={cn('p-4 cursor-pointer transition-all', selectedModel === i && 'ring-1 ring-purple-500/50')}
                onClick={() => setSelectedModel(i)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: m.color }} />
                    <span className="font-semibold text-white">{m.name}</span>
                  </div>
                  <StatusBadge label={m.status} variant={m.status === 'healthy' ? 'success' : m.status === 'degraded' ? 'warning' : 'danger'} />
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { label: 'Accuracy', value: `${m.accuracy}%` },
                    { label: 'Inference', value: `${m.inference}ms` },
                    { label: 'GPU', value: `${m.gpu}%` },
                    { label: 'Memory', value: `${m.memory}GB` },
                  ].map((stat) => (
                    <div key={stat.label}>
                      <p className="text-[10px] text-purple-300/40 uppercase">{stat.label}</p>
                      <p className="text-sm font-medium text-white/90">{stat.value}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-3 h-1.5 rounded-full bg-purple-900/30 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: m.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${m.accuracy}%` }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                  />
                </div>
              </GlassCard>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-2 gap-4">
          <motion.div variants={item}>
            <h2 className="text-lg font-semibold text-white mb-3">Retraining Status</h2>
            <GlassCard className="p-4 space-y-4">
              {retrainingJobs.map((job) => (
                <div key={job.model} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/80">{job.model}</span>
                    <span className="text-xs text-purple-300/50">Epoch {job.epoch} · ETA {job.eta}</span>
                  </div>
                  <div className="h-2 rounded-full bg-purple-900/30 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-purple-500 to-violet-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${job.progress}%` }}
                      transition={{ duration: 1.5 }}
                    />
                  </div>
                </div>
              ))}
            </GlassCard>
          </motion.div>

          <motion.div variants={item}>
            <h2 className="text-lg font-semibold text-white mb-3">Dataset Drift Monitor</h2>
            <GlassCard className="p-4">
              <RealtimeChart data={driftData} color="#a855f7" height={180} />
            </GlassCard>
          </motion.div>
        </div>

        <motion.div variants={item}>
          <h2 className="text-lg font-semibold text-white mb-3">Version History</h2>
          <GlassCard className="p-4">
            <div className="relative pl-6 space-y-4">
              <div className="absolute left-2 top-2 bottom-2 w-px bg-purple-500/20" />
              {[
                { version: 'ArcFace v3.2.1', date: '2 hours ago', action: 'Deployed to production', icon: GitBranch },
                { version: 'Whisper v4.0', date: '1 day ago', action: 'A/B test started', icon: RefreshCw },
                { version: 'Fusion AI v5.0', date: '3 days ago', action: 'Retraining completed', icon: TrendingUp },
                { version: 'Deepfake AI v3.5', date: '5 days ago', action: 'Rolled back - accuracy drop', icon: AlertTriangle },
              ].map((v, i) => (
                <div key={i} className="relative flex items-start gap-3">
                  <div className="absolute -left-4 mt-1 w-3 h-3 rounded-full bg-purple-500/30 border-2 border-purple-400" />
                  <v.icon className="w-4 h-4 text-purple-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-white">{v.version}</p>
                    <p className="text-xs text-purple-300/50">{v.action} · {v.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </motion.div>
    </div>
  );
}
