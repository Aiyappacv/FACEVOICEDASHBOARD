'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { ProgressRing } from '@/components/ui/progress-ring';
import { RealtimeChart } from '@/components/charts/realtime-chart';
import { BiometricBarChart } from '@/components/charts/bar-chart';
import { cn } from '@/lib/utils';
import { ComplianceStatus } from '@/types';
import {
  BadgeCheck,
  FileCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Lock,
  Server,
  Database,
  Shield,
  Users,
  Eye,
} from 'lucide-react';

interface Requirement {
  id: string;
  title: string;
  criteria: string;
  status: ComplianceStatus;
  score: number;
  category: string;
}

const REQUIREMENTS: readonly Requirement[] = [
  { id: 'CC6.1', title: 'Logical Access Controls', criteria: 'CC6.1', status: 'compliant', score: 99, category: 'Access Control' },
  { id: 'CC6.2', title: 'Credential Management', criteria: 'CC6.2', status: 'compliant', score: 98, category: 'Access Control' },
  { id: 'CC6.3', title: 'Network Segmentation', criteria: 'CC6.3', status: 'compliant', score: 97, category: 'Network' },
  { id: 'CC6.4', title: 'Remote Access Controls', criteria: 'CC6.4', status: 'compliant', score: 96, category: 'Access Control' },
  { id: 'CC6.5', title: 'Physical Access Controls', criteria: 'CC6.5', status: 'compliant', score: 95, category: 'Physical' },
  { id: 'CC6.6', title: 'Data Classification', criteria: 'CC6.6', status: 'partial', score: 88, category: 'Data' },
  { id: 'CC6.7', title: 'Data Transmission', criteria: 'CC6.7', status: 'compliant', score: 99, category: 'Data' },
  { id: 'CC6.8', title: 'Data Disposal', criteria: 'CC6.8', status: 'compliant', score: 94, category: 'Data' },
  { id: 'CC7.1', title: 'System Monitoring', criteria: 'CC7.1', status: 'compliant', score: 98, category: 'Monitoring' },
  { id: 'CC7.2', title: 'Vulnerability Management', criteria: 'CC7.2', status: 'compliant', score: 97, category: 'Security' },
  { id: 'CC7.3', title: 'Incident Response', criteria: 'CC7.3', status: 'compliant', score: 96, category: 'Incident' },
  { id: 'CC7.4', title: 'Change Management', criteria: 'CC7.4', status: 'partial', score: 89, category: 'Operations' },
  { id: 'CC7.5', title: 'Backup & Recovery', criteria: 'CC7.5', status: 'compliant', score: 98, category: 'Operations' },
  { id: 'CC8.1', title: 'Risk Assessment', criteria: 'CC8.1', status: 'compliant', score: 95, category: 'Risk' },
  { id: 'CC9.1', title: 'Vendor Management', criteria: 'CC9.1', status: 'partial', score: 82, category: 'Vendor' },
  { id: 'CC9.2', title: 'Fourth-Party Risk', criteria: 'CC9.2', status: 'partial', score: 80, category: 'Vendor' },
] as const;

export const NON_COMPLIANT_STATUS = 'non-compliant' as const;

const STATUS_COLORS = {
  compliant: { badge: 'bg-green-500/20 text-green-400 border-green-500/30', dot: 'bg-green-500', bar: 'bg-green-500' },
  partial: { badge: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', dot: 'bg-yellow-500', bar: 'bg-yellow-500' },
  'non-compliant': { badge: 'bg-red-500/20 text-red-400 border-red-500/30', dot: 'bg-red-500', bar: 'bg-red-500' },
};

const FILTER_OPTIONS = ['all', 'compliant', 'partial', 'non-compliant'] as const;

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1 } } };
const itemVariants = { hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 260, damping: 24 } } };

export default function SOC2Page() {
  const [mounted, setMounted] = useState(false);
  const [filter, setFilter] = useState<'all' | 'compliant' | 'partial' | 'non-compliant'>('all');

  useEffect(() => { setMounted(true); }, []);

  const filtered = REQUIREMENTS.filter(r => filter === 'all' || r.status === filter);
  const compliant = REQUIREMENTS.filter(r => r.status === 'compliant').length;
  const partial = REQUIREMENTS.filter(r => r.status === 'partial').length;
  const nonCompliant = REQUIREMENTS.filter(r => r.status !== 'compliant' && r.status !== 'partial').length;
  const avgScore = Math.round(REQUIREMENTS.reduce((a, r) => a + r.score, 0) / REQUIREMENTS.length);

  return (
    <div className="min-h-screen bg-[#0a0408] p-6 lg:p-8 space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="relative overflow-hidden rounded-2xl border border-purple-500/20 bg-gradient-to-r from-purple-950/60 via-[rgba(80,40,120,0.3)] to-indigo-950/50 p-6 lg:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(168,85,247,0.12),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(99,102,241,0.08),transparent_60%)]" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-purple-500/20 border border-purple-500/30"><BadgeCheck className="h-7 w-7 text-purple-400" /></div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white lg:text-3xl">SOC 2 Type II</h1>
              <p className="mt-1 text-sm text-purple-300/70">Service Organization Control 2 — Trust Services Criteria compliance</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge label="Status: COMPLIANT" variant="success" pulse />
            <StatusBadge label={`Overall Score: ${avgScore}%`} variant="info" />
            <StatusBadge label="Last Audit: 2026-07-20" variant="purple" />
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <GlassCard className="border-purple-500/15 bg-[rgba(80,40,120,0.3)] p-5"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/20"><CheckCircle2 className="h-5 w-5 text-green-400" /></div><div><p className="text-xs text-white/50">Compliant</p><p className="text-2xl font-bold text-green-400">{compliant}/{REQUIREMENTS.length}</p></div></div></GlassCard>
        <GlassCard className="border-purple-500/15 bg-[rgba(80,40,120,0.3)] p-5"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/20"><AlertTriangle className="h-5 w-5 text-yellow-400" /></div><div><p className="text-xs text-white/50">Partial</p><p className="text-2xl font-bold text-yellow-400">{partial}</p></div></div></GlassCard>
        <GlassCard className="border-purple-500/15 bg-[rgba(80,40,120,0.3)] p-5"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/20"><XCircle className="h-5 w-5 text-red-400" /></div><div><p className="text-xs text-white/50">Non-Compliant</p><p className="text-2xl font-bold text-red-400">{nonCompliant}</p></div></div></GlassCard>
        <GlassCard className="border-purple-500/15 bg-[rgba(80,40,120,0.3)] p-5"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/20"><Shield className="h-5 w-5 text-blue-400" /></div><div><p className="text-xs text-white/50">Average Score</p><p className="text-2xl font-bold text-blue-400">{avgScore}%</p></div></div></GlassCard>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {(['all', 'compliant', 'partial', 'non-compliant'] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={cn('px-3 py-1.5 rounded-lg text-xs font-medium transition-colors', filter === f ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-white/5 text-white/50 hover:bg-white/10')}>{f === 'non-compliant' ? 'Non-Compliant' : f.charAt(0).toUpperCase() + f.slice(1)}</button>
        ))}
      </div>

      <motion.div variants={containerVariants} initial="hidden" animate={mounted ? 'visible' : 'hidden'} className="space-y-3">
        {filtered.map((req) => {
          const colors = STATUS_COLORS[req.status];
          return (
            <motion.div key={req.id} variants={itemVariants} className="group">
              <GlassCard className="border-white/5 p-4 hover:border-purple-500/20 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 shrink-0"><Lock className="h-4 w-4 text-white/50" /></div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={cn('px-2 py-0.5 rounded text-[10px] font-mono font-medium border', colors.badge)}>{req.criteria}</span>
                        <span className="text-xs text-white/40 px-2 py-0.5 rounded bg-white/5">{req.category}</span>
                      </div>
                      <h3 className="mt-1 text-sm font-medium text-white truncate">{req.title}</h3>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="flex items-center gap-1.5">
                      <span className={cn('h-2 w-2 rounded-full', colors.dot)} />
                      <span className={cn('text-xs font-medium', req.status === 'compliant' ? 'text-green-400' : req.status === 'partial' ? 'text-yellow-400' : 'text-red-400')}>{req.status === 'non-compliant' ? 'Non-Compliant' : req.status.charAt(0).toUpperCase() + req.status.slice(1)}</span>
                    </div>
                    <ProgressRing value={req.score} size={40} strokeWidth={3} showValue />
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}><GlassCard className="border-purple-500/15 bg-[rgba(80,40,120,0.3)] p-6"><h2 className="mb-1 text-lg font-semibold text-white">Compliance Trend</h2><p className="mb-4 text-xs text-white/40">Monthly SOC 2 compliance score</p><div className="h-64"><RealtimeChart data={Array.from({ length: 12 }, (_, i) => ({ time: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i], value: Math.floor(Math.random() * 2 + 96) }))} color="#a855f7" height={256} /></div></GlassCard></motion.div>
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}><GlassCard className="border-purple-500/15 bg-[rgba(80,40,120,0.3)] p-6"><h2 className="mb-1 text-lg font-semibold text-white">Trust Services Categories</h2><p className="mb-4 text-xs text-white/40">Average score by SOC 2 trust category</p><div className="h-64"><BiometricBarChart data={[{ name: 'Security (CC6)', value: 97, color: '#a855f7' }, { name: 'Availability (CC7)', value: 97, color: '#3b82f6' }, { name: 'Processing Integrity', value: 96, color: '#22c55e' }, { name: 'Confidentiality', value: 97, color: '#f97316' }, { name: 'Privacy', value: 95, color: '#ec4899' }, { name: 'Vendor Management', value: 81, color: '#ef4444' }]} /></div></GlassCard></motion.div>
      </div>
    </div>
  );
}