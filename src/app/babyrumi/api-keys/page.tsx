'use client';

import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/glass-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { ProgressRing } from '@/components/ui/progress-ring';
import { cn } from '@/lib/utils';
import { Key, Plus, Copy, Trash2, Clock, Shield, Activity, BarChart3 } from 'lucide-react';

const apiKeys = [
  { name: 'Production Primary', key: 'sk-prod-a8f2...x9kL', permissions: ['read', 'write', 'verify', 'enroll'], rateLimit: '5000/min', lastUsed: '2 min ago', status: 'active' as const, usage: 78, totalCalls: '4.2M' },
  { name: 'Staging Environment', key: 'sk-stag-b3c1...m7jN', permissions: ['read', 'write', 'verify'], rateLimit: '2000/min', lastUsed: '15 min ago', status: 'active' as const, usage: 45, totalCalls: '1.1M' },
  { name: 'Mobile SDK', key: 'sk-mobi-d5e4...p2qR', permissions: ['verify', 'enroll'], rateLimit: '3000/min', lastUsed: '1 min ago', status: 'active' as const, usage: 92, totalCalls: '8.9M' },
  { name: 'Analytics Service', key: 'sk-ana1-f6g5...s8tU', permissions: ['read', 'analytics'], rateLimit: '1000/min', lastUsed: '5 min ago', status: 'active' as const, usage: 34, totalCalls: '560K' },
  { name: 'Legacy Integration', key: 'sk-lega-h7i6...u4vW', permissions: ['read', 'verify'], rateLimit: '500/min', lastUsed: '3 days ago', status: 'active' as const, usage: 12, totalCalls: '89K' },
  { name: 'Testing Only', key: 'sk-test-j8k7...w6xY', permissions: ['read'], rateLimit: '100/min', lastUsed: '2 weeks ago', status: 'inactive' as const, usage: 3, totalCalls: '12K' },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function ApiKeysPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0015] via-[#120025] to-[#0a0015] p-6">
      <motion.div variants={container} initial="hidden" animate="show" className="max-w-5xl mx-auto space-y-6">
        <motion.div variants={item} className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/20">
              <Key className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">API Key Management</h1>
              <p className="text-sm text-purple-300/60">{apiKeys.length} keys configured</p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-violet-500 text-white text-sm font-medium hover:opacity-90 transition-opacity">
            <Plus className="w-4 h-4" /> Create New Key
          </button>
        </motion.div>

        <motion.div variants={item} className="grid grid-cols-3 gap-4">
          {[
            { label: 'Active Keys', value: apiKeys.filter(k => k.status === 'active').length.toString(), color: 'text-emerald-400' },
            { label: 'Total Calls', value: '14.9M', color: 'text-purple-400' },
            { label: 'Avg Usage', value: '44%', color: 'text-blue-400' },
          ].map((s) => (
            <GlassCard key={s.label} className="p-4 text-center">
              <p className="text-xs text-purple-300/50 uppercase tracking-wider">{s.label}</p>
              <p className={cn('text-2xl font-bold mt-1', s.color)}>{s.value}</p>
            </GlassCard>
          ))}
        </motion.div>

        <div className="space-y-4">
          {apiKeys.map((k, i) => (
            <motion.div key={k.name} variants={item}>
              <GlassCard className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'w-10 h-10 rounded-xl flex items-center justify-center',
                      k.status === 'active' ? 'bg-emerald-500/20' : 'bg-purple-500/10'
                    )}>
                      <Key className={cn('w-5 h-5', k.status === 'active' ? 'text-emerald-400' : 'text-purple-300/30')} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{k.name}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <code className="text-xs text-purple-300/50 font-mono bg-purple-500/10 px-2 py-0.5 rounded">{k.key}</code>
                        <button className="text-purple-300/30 hover:text-purple-300/60"><Copy className="w-3 h-3" /></button>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge label={k.status} variant={k.status === 'active' ? 'success' : 'danger'} />
                    <button className="text-purple-300/30 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-[10px] text-purple-300/40 uppercase mb-1">Permissions</p>
                    <div className="flex flex-wrap gap-1">
                      {k.permissions.map((p) => (
                        <span key={p} className="px-2 py-0.5 rounded text-[10px] bg-purple-500/10 text-purple-300/60 border border-purple-500/10">{p}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-purple-300/40 uppercase mb-1">Rate Limit</p>
                    <p className="text-sm text-white/80">{k.rateLimit}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-purple-300/40 uppercase mb-1">Last Used</p>
                    <p className="text-sm text-white/80 flex items-center gap-1"><Clock className="w-3 h-3" /> {k.lastUsed}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-purple-300/40 uppercase mb-1">Total Calls</p>
                    <p className="text-sm text-white/80">{k.totalCalls}</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-purple-300/40">Usage</span>
                    <span className="text-purple-300/50">{k.usage}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-purple-900/30 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${k.usage}%` }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                    />
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
