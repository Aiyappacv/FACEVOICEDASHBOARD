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
  Shield,
  FileCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Users,
  Database,
  TrendingUp,
  Gavel,
} from 'lucide-react';

interface Requirement {
  id: string;
  title: string;
  article: string;
  status: ComplianceStatus;
  score: number;
  category: string;
}

const REQUIREMENTS: readonly Requirement[] = [
  { id: 'art-5', title: 'Data Processing Principles', article: 'Art. 5', status: 'compliant', score: 100, category: 'Lawfulness' },
  { id: 'art-6', title: 'Lawfulness of Processing', article: 'Art. 6', status: 'compliant', score: 98, category: 'Consent' },
  { id: 'art-7', title: 'Conditions for Consent', article: 'Art. 7', status: 'compliant', score: 95, category: 'Consent' },
  { id: 'art-9', title: 'Special Categories of Data', article: 'Art. 9', status: 'compliant', score: 97, category: 'Biometric Data' },
  { id: 'art-12', title: 'Transparent Information', article: 'Art. 12', status: 'compliant', score: 94, category: 'Transparency' },
  { id: 'art-15', title: 'Right of Access', article: 'Art. 15', status: 'compliant', score: 99, category: 'Data Subject Rights' },
  { id: 'art-17', title: 'Right to Erasure', article: 'Art. 17', status: 'partial', score: 87, category: 'Data Subject Rights' },
  { id: 'art-20', title: 'Data Portability', article: 'Art. 20', status: 'compliant', score: 93, category: 'Data Subject Rights' },
  { id: 'art-25', title: 'Data Protection by Design', article: 'Art. 25', status: 'compliant', score: 96, category: 'Privacy by Design' },
  { id: 'art-30', title: 'Records of Processing', article: 'Art. 30', status: 'compliant', score: 98, category: 'Accountability' },
  { id: 'art-32', title: 'Security of Processing', article: 'Art. 32', status: 'compliant', score: 99, category: 'Security' },
  { id: 'art-33', title: 'Breach Notification', article: 'Art. 33', status: 'compliant', score: 95, category: 'Incident Response' },
  { id: 'art-35', title: 'Data Protection Impact Assessment', article: 'Art. 35', status: 'partial', score: 82, category: 'Risk Assessment' },
  { id: 'art-44', title: 'International Transfers', article: 'Art. 44', status: 'compliant', score: 91, category: 'Cross-border' },
  { id: 'art-28', title: 'Processor Contracts', article: 'Art. 28', status: 'non-compliant', score: 45, category: 'Accountability' },
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

export default function GDPRPage() {
  const [mounted, setMounted] = useState(false);
  const [filter, setFilter] = useState<'all' | 'compliant' | 'partial' | 'non-compliant'>('all');

  useEffect(() => { setMounted(true); }, []);

  const filtered = REQUIREMENTS.filter(r => filter === 'all' || r.status === filter);
  const compliant = REQUIREMENTS.filter(r => r.status === 'compliant').length;
  const partial = REQUIREMENTS.filter(r => r.status === 'partial').length;
  const nonCompliant = REQUIREMENTS.filter(r => r.status === NON_COMPLIANT_STATUS).length;
  const avgScore = Math.round(REQUIREMENTS.reduce((a, r) => a + r.score, 0) / REQUIREMENTS.length);

  return (
    <div className="min-h-screen bg-[#0a0408] p-6 lg:p-8 space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="relative overflow-hidden rounded-2xl border border-blue-500/20 bg-gradient-to-r from-blue-950/60 via-[rgba(30,60,120,0.3)] to-indigo-950/50 p-6 lg:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.12),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(99,102,241,0.08),transparent_60%)]" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-500/20 border border-blue-500/30"><Shield className="h-7 w-7 text-blue-400" /></div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white lg:text-3xl">GDPR Compliance</h1>
              <p className="mt-1 text-sm text-blue-300/70">General Data Protection Regulation — Article-by-article compliance status</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge label="Status: COMPLIANT" variant="success" pulse />
            <StatusBadge label={`Overall Score: ${avgScore}%`} variant="info" />
            <StatusBadge label="Last Audit: 2026-07-15" variant="purple" />
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <GlassCard className="border-blue-500/15 bg-[rgba(30,60,120,0.3)] p-5"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/20"><CheckCircle2 className="h-5 w-5 text-green-400" /></div><div><p className="text-xs text-white/50">Fully Compliant</p><p className="text-2xl font-bold text-green-400">{compliant}/{REQUIREMENTS.length}</p></div></div></GlassCard>
        <GlassCard className="border-blue-500/15 bg-[rgba(30,60,120,0.3)] p-5"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/20"><AlertTriangle className="h-5 w-5 text-yellow-400" /></div><div><p className="text-xs text-white/50">Partially Compliant</p><p className="text-2xl font-bold text-yellow-400">{partial}</p></div></div></GlassCard>
        <GlassCard className="border-blue-500/15 bg-[rgba(30,60,120,0.3)] p-5"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/20"><XCircle className="h-5 w-5 text-red-400" /></div><div><p className="text-xs text-white/50">Non-Compliant</p><p className="text-2xl font-bold text-red-400">{nonCompliant}</p></div></div></GlassCard>
        <GlassCard className="border-blue-500/15 bg-[rgba(30,60,120,0.3)] p-5"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/20"><TrendingUp className="h-5 w-5 text-blue-400" /></div><div><p className="text-xs text-white/50">Average Score</p><p className="text-2xl font-bold text-blue-400">{avgScore}%</p></div></div></GlassCard>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {FILTER_OPTIONS.map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={cn('px-3 py-1.5 rounded-lg text-xs font-medium transition-colors', filter === f ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'bg-white/5 text-white/50 hover:bg-white/10')}>{f === 'non-compliant' ? 'Non-Compliant' : f.charAt(0).toUpperCase() + f.slice(1)}</button>
        ))}
      </div>

      <motion.div variants={containerVariants} initial="hidden" animate={mounted ? 'visible' : 'hidden'} className="space-y-3">
        {filtered.map((req) => {
          const colors = STATUS_COLORS[req.status];
          return (
            <motion.div key={req.id} variants={itemVariants} className="group">
              <GlassCard className="border-white/5 p-4 hover:border-blue-500/20 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 shrink-0"><FileCheck className="h-4 w-4 text-white/50" /></div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={cn('px-2 py-0.5 rounded text-[10px] font-mono font-medium border', colors.badge)}>{req.article}</span>
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
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}><GlassCard className="border-blue-500/15 bg-[rgba(30,60,120,0.3)] p-6"><h2 className="mb-1 text-lg font-semibold text-white">Compliance Trend</h2><p className="mb-4 text-xs text-white/40">Monthly GDPR compliance score</p><div className="h-64"><RealtimeChart data={Array.from({ length: 12 }, (_, i) => ({ time: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i], value: Math.floor(Math.random() * 5 + 92) }))} color="#3b82f6" height={256} /></div></GlassCard></motion.div>
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}><GlassCard className="border-blue-500/15 bg-[rgba(30,60,120,0.3)] p-6"><h2 className="mb-1 text-lg font-semibold text-white">Category Breakdown</h2><p className="mb-4 text-xs text-white/40">Average score by GDPR category</p><div className="h-64"><BiometricBarChart data={[{ name: 'Lawfulness', value: 97, color: '#3b82f6' }, { name: 'Consent', value: 96, color: '#ec4899' }, { name: 'Data Subject Rights', value: 93, color: '#22c55e' }, { name: 'Privacy by Design', value: 96, color: '#8b5cf6' }, { name: 'Accountability', value: 98, color: '#f97316' }, { name: 'Security', value: 99, color: '#06b6d4' }, { name: 'Incident Response', value: 95, color: '#facc15' }, { name: 'Risk Assessment', value: 82, color: '#ef4444' }, { name: 'Cross-border', value: 91, color: '#a855f7' }]} /></div></GlassCard></motion.div>
      </div>
    </div>
  );
}