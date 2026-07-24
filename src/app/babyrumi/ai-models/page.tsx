'use client';

import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/glass-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { ProgressRing } from '@/components/ui/progress-ring';
import { cn } from '@/lib/utils';
import { Brain, Layers, Clock, Zap, MemoryStick, Gauge, BarChart3, RefreshCw } from 'lucide-react';

const models = [
  { name: 'ArcFace', version: 'v3.2.1', type: 'Face Recognition', accuracy: 99.7, latency: 12, requests: '2.4M', gpu: 67, memory: '4.2 GB', confidence: 98.5, status: 'healthy' as const, updated: '2h ago', accent: 'from-purple-500 to-violet-600', accentText: 'text-purple-400' },
  { name: 'RetinaFace', version: 'v2.8.0', type: 'Face Detection', accuracy: 99.2, latency: 18, requests: '1.8M', gpu: 72, memory: '3.8 GB', confidence: 97.8, status: 'healthy' as const, updated: '4h ago', accent: 'from-indigo-500 to-blue-600', accentText: 'text-indigo-400' },
  { name: 'Whisper', version: 'v4.0', type: 'Voice Recognition', accuracy: 98.8, latency: 45, requests: '980K', gpu: 81, memory: '6.1 GB', confidence: 96.2, status: 'healthy' as const, updated: '1h ago', accent: 'from-pink-500 to-rose-600', accentText: 'text-pink-400' },
  { name: 'ECAPA-TDNN', version: 'v2.1', type: 'Voice Embedding', accuracy: 99.1, latency: 22, requests: '1.2M', gpu: 58, memory: '2.9 GB', confidence: 97.1, status: 'healthy' as const, updated: '6h ago', accent: 'from-teal-500 to-cyan-600', accentText: 'text-teal-400' },
  { name: 'CNN Minutiae', version: 'v3.0', type: 'Fingerprint', accuracy: 98.5, latency: 35, requests: '650K', gpu: 63, memory: '5.0 GB', confidence: 95.4, status: 'degraded' as const, updated: '12h ago', accent: 'from-amber-500 to-orange-600', accentText: 'text-amber-400' },
  { name: 'Fusion AI', version: 'v5.0', type: 'Multi-Modal Fusion', accuracy: 99.6, latency: 28, requests: '3.1M', gpu: 88, memory: '7.2 GB', confidence: 99.1, status: 'healthy' as const, updated: '30m ago', accent: 'from-cyan-500 to-blue-600', accentText: 'text-cyan-400' },
  { name: 'Risk AI', version: 'v4.2', type: 'Risk Assessment', accuracy: 97.9, latency: 15, requests: '4.2M', gpu: 45, memory: '2.1 GB', confidence: 94.8, status: 'healthy' as const, updated: '1h ago', accent: 'from-violet-500 to-purple-600', accentText: 'text-violet-400' },
  { name: 'Deepfake AI', version: 'v3.5', type: 'Deepfake Detection', accuracy: 96.3, latency: 52, requests: '890K', gpu: 92, memory: '8.5 GB', confidence: 93.2, status: 'offline' as const, updated: '2d ago', accent: 'from-red-500 to-rose-600', accentText: 'text-red-400' },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function AIModelsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0015] via-[#120025] to-[#0a0015] p-6">
      <motion.div variants={container} initial="hidden" animate="show" className="max-w-7xl mx-auto space-y-6">
        <motion.div variants={item} className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/20">
            <Brain className="w-6 h-6 text-violet-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">AI Model Registry</h1>
            <p className="text-sm text-purple-300/60">8 deployed models across all services</p>
          </div>
        </motion.div>

        <motion.div variants={item} className="grid grid-cols-2 gap-4">
          {models.map((m, i) => (
            <motion.div key={m.name} variants={item}>
              <GlassCard className="p-5 relative overflow-hidden">
                <div className={cn('absolute top-0 left-0 w-full h-1 bg-gradient-to-r', m.accent)} />
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={cn('w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center', m.accent)}>
                      <Brain className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{m.name}</h3>
                      <p className="text-xs text-purple-300/50">{m.version} · {m.type}</p>
                    </div>
                  </div>
                  <StatusBadge label={m.status} variant={m.status === 'healthy' ? 'success' : m.status === 'degraded' ? 'warning' : 'danger'} />
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center">
                    <ProgressRing value={m.accuracy} size={52} strokeWidth={3} color="#10b981" />
                    <p className="text-[10px] text-purple-300/40 mt-1">Accuracy</p>
                    <p className="text-xs font-medium text-emerald-400">{m.accuracy}%</p>
                  </div>
                  <div className="text-center">
                    <ProgressRing value={m.gpu} size={52} strokeWidth={3} color="#a855f7" />
                    <p className="text-[10px] text-purple-300/40 mt-1">GPU</p>
                    <p className="text-xs font-medium text-purple-400">{m.gpu}%</p>
                  </div>
                  <div className="text-center">
                    <ProgressRing value={m.confidence} size={52} strokeWidth={3} color="#3b82f6" />
                    <p className="text-[10px] text-purple-300/40 mt-1">Confidence</p>
                    <p className="text-xs font-medium text-blue-400">{m.confidence}%</p>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2 text-center">
                  {[
                    { label: 'Latency', value: `${m.latency}ms` },
                    { label: 'Requests', value: m.requests },
                    { label: 'Memory', value: m.memory },
                    { label: 'Updated', value: m.updated },
                  ].map((s) => (
                    <div key={s.label} className="p-2 rounded-lg bg-purple-500/5">
                      <p className="text-[9px] text-purple-300/40 uppercase">{s.label}</p>
                      <p className="text-xs font-medium text-white/80">{s.value}</p>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
