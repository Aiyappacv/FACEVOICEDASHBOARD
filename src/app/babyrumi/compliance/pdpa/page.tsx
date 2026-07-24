'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { ProgressRing } from '@/components/ui/progress-ring';
import { RealtimeChart } from '@/components/charts/realtime-chart';
import { BiometricBarChart } from '@/components/charts/bar-chart';
import { cn } from '@/lib/utils';
import {
  Scale,
  FileCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  UserCheck,
  Globe,
  Database,
  Shield,
  Lock,
  Eye,
} from 'lucide-react';

const REQUIREMENTS = [
  { id: 's9', title: 'Access Control', section: '§9', status: 'compliant', score: 95, category: 'Access' },
  { id: 's10', title: 'Data Quality', section: '§10', status: 'compliant', score: 93, category: 'Quality' },
  { id: 's11', title: 'Protection Obligation', section: '§11', status: 'compliant', score: 97, category: 'Security' },
  { id: 's12', title: 'Retention Limitation', section: '§12', status: 'partial', score: 84, category: 'Retention' },
  { id: 's13', title: 'Transfer Limitation', section: '§13', status: 'compliant', score: 91, category: 'Transfer' },
  { id: 's14', title: 'Openness', section: '§14', status: 'partial', score: 87, category: 'Transparency' },
  { id: 's15', title: 'Correction', section: '§15', status: 'compliant', score: 92, category: 'Rights' },
  { id: 's16', title: 'Withdrawal of Consent', section: '§16', status: 'compliant', score: 94, category: 'Consent' },
  { id: 's17', title: 'Do Not Call', section: '§17', status: 'compliant', score: 98, category: 'Marketing' },
  { id: 's18', title: 'Data Breach Notification', section: '§18', status: 'partial', score: 79, category: 'Incident' },
  { id: 's19', title: 'Accountability', section: '§19', status: 'compliant', score: 96, category: 'Governance' },
  { id: 's20', title: 'Cross-border Transfer', section: '§20', status: 'compliant', score: 89, category: 'Transfer' },
] as const;

const STATUS_COLORS = {
  compliant: { badge: 'bg-green-500/20 text-green-400 border-green-500/30', dot: 'bg-green-500', bar: 'bg-green-500' },
  partial: { badge: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', dot: 'bg-yellow-500', bar: 'bg-yellow-500' },
  'non-compliant': { badge: 'bg-red-500/20 text-red-400 border-red-500/30', dot: 'bg-red-500', bar: 'bg-red-500' },
};

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1 } } };
const itemVariants = { hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 260, damping: 24 } } };

export const NON_COMPLIANT_STATUS = 'non-compliant' as const;

export default function PDPAPage() {
  const [mounted, setMounted] = useState(false);
  const [filter, setFilter] = useState<'all' | 'compliant' | 'partial'>('all');

  useEffect(() => { setMounted(true); }, []);

  const filtered = REQUIREMENTS.filter(r => filter === 'all' || r.status === filter);
  const compliant = REQUIREMENTS.filter(r => r.status === 'compliant').length;
  const partial = REQUIREMENTS.filter(r => r.status === 'partial').length;
  const nonCompliant = REQUIREMENTS.filter(r => r.status === 'non-compliant').length;
  const avgScore = Math.round(REQUIREMENTS.reduce((a, r) => a + r.score, 0) / REQUIREMENTS.length);

  return (
    <div className="min-h-screen bg-[#0a0408] p-6 lg:p-8 space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="relative overflow-hidden rounded-2xl border border-orange-500/20 bg-gradient-to-r from-orange-950/60 via-[rgba(120,60,20,0.3)] to-amber-950/50 p-6 lg:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(249,115,22,0.12),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(250,204,21,0.08),transparent_60%)]" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-orange-500/20 border border-orange-500/30"><Scale className="h-7 w-7 text-orange-400" /></div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white lg:text-3xl">PDPA Compliance</h1>
              <p className="mt-1 text-sm text-orange-300/70">Singapore Personal Data Protection Act — Obligation compliance status</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge label="Status: PARTIAL" variant="warning" pulse />
            <StatusBadge label={`Overall Score: ${avgScore}%`} variant="info" />
            <StatusBadge label="Last Audit: 2026-06-28" variant="purple" />
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <GlassCard className="border-orange-500/15 bg-[rgba(120,60,20,0.3)] p-5"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/20"><CheckCircle2 className="h-5 w-5 text-green-400" /></div><div><p className="text-xs text-white/50">Compliant</p><p className="text-2xl font-bold text-green-400">{compliant}/{REQUIREMENTS.length}</p></div></div></GlassCard>
        <GlassCard className="border-orange-500/15 bg-[rgba(120,60,20,0.3)] p-5"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/20"><AlertTriangle className="h-5 w-5 text-yellow-400" /></div><div><p className="text-xs text-white/50">Partial</p><p className="text-2xl font-bold text-yellow-400">{partial}</p></div></div></GlassCard>
        <GlassCard className="border-orange-500/15 bg-[rgba(120,60,20,0.3)] p-5"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/20"><XCircle className="h-5 w-5 text-red-400" /></div><div><p className="text-xs text-white/50">Non-Compliant</p><p className="text-2xl font-bold text-red-400">{nonCompliant}</p></div></div></GlassCard>
        <GlassCard className="border-orange-500/15 bg-[rgba(120,60,20,0.3)] p-5"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/20"><Shield className="h-5 w-5 text-blue-400" /></div><div><p className="text-xs text-white/50">Average Score</p><p className="text-2xl font-bold text-blue-400">{avgScore}%</p></div></div></GlassCard>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {(['all', 'compliant', 'partial', 'non-compliant'] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={cn('px-3 py-1.5 rounded-lg text-xs font-medium transition-colors', filter === f ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' : 'bg-white/5 text-white/50 hover:bg-white/10')}>{f === 'non-compliant' ? 'Non-Compliant' : f.charAt(0).toUpperCase() + f.slice(1)}</button>
        ))}
      </div>

      <motion.div variants={containerVariants} initial="hidden" animate={mounted ? 'visible' : 'hidden'} className="space-y-3">
        {filtered.map((req) => {
          const colors = STATUS_COLORS[req.status];
          return (
            <motion.div key={req.id} variants={itemVariants} className="group">
              <GlassCard className="border-white/5 p-4 hover:border-orange-500/20 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 shrink-0"><Lock className="h-4 w-4 text-white/50" /></div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={cn('px-2 py-0.5 rounded text-[10px] font-mono font-medium border', colors.badge)}>{req.section}</span>
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
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}><GlassCard className="border-orange-500/15 bg-[rgba(120,60,20,0.3)] p-6"><h2 className="mb-1 text-lg font-semibold text-white">Compliance Trend</h2><p className="mb-4 text-xs text-white/40">Monthly PDPA compliance score</p><div className="h-64"><RealtimeChart data={Array.from({ length: 12 }, (_, i) => ({ time: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i], value: Math.floor(Math.random() * 8 + 84) }))} color="#f97316" height={256} /></div></GlassCard></motion.div>
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}><GlassCard className="border-orange-500/15 bg-[rgba(120,60,20,0.3)] p-6"><h2 className="mb-1 text-lg font-semibold text-white">Obligation Categories</h2><p className="mb-4 text-xs text-white/40">Average score by PDPA obligation type</p><div className="h-64"><BiometricBarChart data={[{ name: 'Consent', value: 95, color: '#f97316' }, { name: 'Purpose Limitation', value: 94, color: '#facc15' }, { name: 'Access & Correction', value: 93, color: '#22c55e' }, { name: 'Protection', value: 97, color: '#3b82f6' }, { name: 'Retention', value: 84, color: '#ef4444' }, { name: 'Transfer', value: 90, color: '#8b5cf6' }, { name: 'Accountability', value: 96, color: '#06b6d4' }, { name: 'Breach Notification', value: 79, color: '#ef4444' }]} /></div></GlassCard></motion.div>
      </div>
    </div>
  );
}