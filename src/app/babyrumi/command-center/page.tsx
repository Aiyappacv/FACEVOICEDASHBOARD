'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/glass-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { ProgressRing } from '@/components/ui/progress-ring';
import { RealtimeChart } from '@/components/charts/realtime-chart';
import { cn } from '@/lib/utils';
import {
  Command, Shield, Users, Activity, Zap, AlertTriangle, CheckCircle,
  Clock, Radio, Server, Database, Globe, Brain, Mic, Fingerprint,
  RefreshCw, BarChart3, Settings, Eye, ArrowUpRight,
} from 'lucide-react';

const systems = [
  { name: 'API Gateway', status: 'healthy' as const, icon: Globe, uptime: '99.99%' },
  { name: 'Face Recognition', status: 'healthy' as const, icon: Eye, uptime: '99.97%' },
  { name: 'Voice Processing', status: 'healthy' as const, icon: Mic, uptime: '99.95%' },
  { name: 'Fusion Engine', status: 'healthy' as const, icon: Brain, uptime: '99.98%' },
  { name: 'Database Cluster', status: 'healthy' as const, icon: Database, uptime: '100%' },
  { name: 'Cache Layer', status: 'healthy' as const, icon: Server, uptime: '100%' },
  { name: 'Message Queue', status: 'degraded' as const, icon: Radio, uptime: '99.82%' },
  { name: 'CDN Edge', status: 'healthy' as const, icon: Globe, uptime: '99.99%' },
  { name: 'Auth Service', status: 'healthy' as const, icon: Shield, uptime: '99.99%' },
  { name: 'ML Pipeline', status: 'healthy' as const, icon: Brain, uptime: '99.91%' },
];

const incidents = [
  { title: 'Message Queue latency spike', severity: 'warning' as const, time: '12 min ago', status: 'investigating' },
  { title: 'CDN cache invalidation delay', severity: 'info' as const, time: '2 hours ago', status: 'resolved' },
  { title: 'Auth service timeout surge', severity: 'error' as const, time: '1 day ago', status: 'resolved' },
];

const teamMembers = [
  { name: 'Sarah Chen', role: 'SRE Lead', status: 'online' },
  { name: 'Marcus Rodriguez', role: 'Security', status: 'online' },
  { name: 'Yuki Tanaka', role: 'Backend', status: 'online' },
  { name: 'David Kim', role: 'ML Engineer', status: 'away' },
  { name: 'Elena Volkov', role: 'DevOps', status: 'offline' },
  { name: 'Omar Hassan', role: 'Support', status: 'online' },
];

const quickActions = [
  { label: 'Deploy Model', icon: Brain, color: 'from-purple-500 to-violet-600' },
  { label: 'Scale Infra', icon: Server, color: 'from-blue-500 to-indigo-600' },
  { label: 'Run Diagnostics', icon: Activity, color: 'from-emerald-500 to-teal-600' },
  { label: 'View Logs', icon: BarChart3, color: 'from-amber-500 to-orange-600' },
  { label: 'Clear Cache', icon: RefreshCw, color: 'from-pink-500 to-rose-600' },
  { label: 'Open Settings', icon: Settings, color: 'from-gray-500 to-slate-600' },
];

const timelineData = Array.from({ length: 48 }, (_, i) => ({
  time: `${String(i).padStart(2, '0')}:00`,
  value: Math.floor(Math.random() * 30 + 70),
}));

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function CommandCenterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0015] via-[#120025] to-[#0a0015] p-6">
      <motion.div variants={container} initial="hidden" animate="show" className="max-w-7xl mx-auto space-y-6">
        <motion.div variants={item} className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-violet-500/20 border border-purple-500/20">
            <Command className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Command Center</h1>
            <p className="text-sm text-purple-300/60">Real-time operations overview</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-emerald-400">All Systems Operational</span>
          </div>
        </motion.div>

        <motion.div variants={item}>
          <h2 className="text-lg font-semibold text-white mb-3">System Status</h2>
          <div className="grid grid-cols-5 gap-3">
            {systems.map((s) => (
              <GlassCard key={s.name} className="p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className={cn(
                    'w-2 h-2 rounded-full',
                    s.status === 'healthy' && 'bg-emerald-400',
                    s.status === 'degraded' && 'bg-amber-400 animate-pulse'
                  )} />
                  <s.icon className="w-4 h-4 text-purple-300/50" />
                </div>
                <p className="text-xs font-medium text-white/80 truncate">{s.name}</p>
                <p className="text-[10px] text-purple-300/30 mt-0.5">{s.uptime}</p>
              </GlassCard>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-3 gap-4">
          <motion.div variants={item} className="col-span-2">
            <h2 className="text-lg font-semibold text-white mb-3">System Health (48h)</h2>
            <GlassCard className="p-4">
              <RealtimeChart data={timelineData} color="#10b981" height={180} />
            </GlassCard>
          </motion.div>

          <motion.div variants={item}>
            <h2 className="text-lg font-semibold text-white mb-3">Active Incidents</h2>
            <GlassCard className="p-4 space-y-3">
              {incidents.map((inc, i) => (
                <div key={i} className="flex items-start gap-3 p-2 rounded-lg bg-purple-500/5">
                  <div className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
                    inc.severity === 'error' && 'bg-red-500/20',
                    inc.severity === 'warning' && 'bg-amber-500/20',
                    inc.severity === 'info' && 'bg-blue-500/20'
                  )}>
                    {inc.severity === 'error' ? <AlertTriangle className="w-4 h-4 text-red-400" /> :
                     inc.severity === 'warning' ? <Clock className="w-4 h-4 text-amber-400" /> :
                     <CheckCircle className="w-4 h-4 text-blue-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white/80">{inc.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-purple-300/40">{inc.time}</span>
                      <StatusBadge label={inc.status} variant={inc.status === 'resolved' ? 'success' : 'warning'} />
                    </div>
                  </div>
                </div>
              ))}
            </GlassCard>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <motion.div variants={item}>
            <h2 className="text-lg font-semibold text-white mb-3">Team Status</h2>
            <GlassCard className="p-4">
              <div className="grid grid-cols-2 gap-2">
                {teamMembers.map((m) => (
                  <div key={m.name} className="flex items-center gap-3 p-2 rounded-lg bg-purple-500/5">
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold">
                        {m.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className={cn(
                        'absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#0a0015]',
                        m.status === 'online' && 'bg-emerald-400',
                        m.status === 'away' && 'bg-amber-400',
                        m.status === 'offline' && 'bg-gray-500'
                      )} />
                    </div>
                    <div>
                      <p className="text-sm text-white/80">{m.name}</p>
                      <p className="text-[10px] text-purple-300/40">{m.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          <motion.div variants={item}>
            <h2 className="text-lg font-semibold text-white mb-3">Quick Actions</h2>
            <div className="grid grid-cols-3 gap-3">
              {quickActions.map((a) => (
                <button
                  key={a.label}
                  className={cn(
                    'p-4 rounded-xl bg-gradient-to-br border border-purple-500/10 hover:border-purple-500/30 transition-all hover:scale-105 text-center',
                    a.color
                  )}
                >
                  <a.icon className="w-6 h-6 text-white mx-auto mb-2" />
                  <p className="text-xs font-medium text-white">{a.label}</p>
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
