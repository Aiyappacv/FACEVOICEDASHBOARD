'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Priority = 'critical' | 'high' | 'medium' | 'low'
type CaseStatus = 'open' | 'investigating' | 'resolved' | 'closed' | 'escalated'

interface CaseEvent {
  timestamp: string
  action: string
  actor: string
}

interface InvestigationCase {
  id: string
  title: string
  description: string
  priority: Priority
  status: CaseStatus
  assignee: string
  createdDate: string
  lastUpdated: string
  evidenceCount: number
  tags: string[]
  timeline: CaseEvent[]
}

const priorityConfig: Record<Priority, { color: string; bg: string; label: string }> = {
  critical: { color: '#ef4444', bg: 'bg-red-500/20', label: 'Critical' },
  high: { color: '#f97316', bg: 'bg-orange-500/20', label: 'High' },
  medium: { color: '#eab308', bg: 'bg-yellow-500/20', label: 'Medium' },
  low: { color: '#a855f7', bg: 'bg-purple-500/20', label: 'Low' }
}

const statusConfig: Record<CaseStatus, { color: string; bg: string; label: string }> = {
  open: { color: '#3b82f6', bg: 'bg-blue-500/20', label: 'Open' },
  investigating: { color: '#f59e0b', bg: 'bg-amber-500/20', label: 'Investigating' },
  resolved: { color: '#22c55e', bg: 'bg-emerald-500/20', label: 'Resolved' },
  closed: { color: '#6b7280', bg: 'bg-gray-500/20', label: 'Closed' },
  escalated: { color: '#ef4444', bg: 'bg-red-500/20', label: 'Escalated' }
}

const cases: InvestigationCase[] = [
  {
    id: 'INV-2024-0847', title: 'Deepfake Facial Injection Attack', priority: 'critical', status: 'investigating',
    assignee: 'Dr. Sarah Mitchell', createdDate: '2024-11-15T08:30:00Z', lastUpdated: '2024-12-18T14:22:00Z', evidenceCount: 23,
    description: 'Sophisticated deepfake injection attack detected targeting facial recognition pipeline. Attack vectors include generative adversarial network (GAN) synthesized frames injected at camera buffer level.',
    tags: ['deepfake', 'injection', 'critical-infrastructure'],
    timeline: [
      { timestamp: '2024-11-15T08:30:00Z', action: 'Case created from anomaly detection alert', actor: 'System' },
      { timestamp: '2024-11-15T09:15:00Z', action: 'Initial triage completed, priority set to critical', actor: 'Dr. Sarah Mitchell' },
      { timestamp: '2024-11-15T11:00:00Z', action: 'Camera buffer logs collected from affected endpoints', actor: 'Agent James Park' },
      { timestamp: '2024-11-16T14:30:00Z', action: 'GAN fingerprint analysis initiated', actor: 'Analyst Tom Reeves' },
      { timestamp: '2024-11-18T09:00:00Z', action: 'Attack pattern correlated with 3 previous incidents', actor: 'Dr. Sarah Mitchell' },
      { timestamp: '2024-11-20T16:45:00Z', action: 'Injection point identified in camera middleware', actor: 'Agent James Park' },
      { timestamp: '2024-12-01T10:00:00Z', action: 'Mitigation patch deployed to all endpoints', actor: 'System' },
      { timestamp: '2024-12-18T14:22:00Z', action: 'Ongoing monitoring, investigating source network', actor: 'Dr. Sarah Mitchell' }
    ]
  },
  {
    id: 'INV-2024-0912', title: 'Voice Spoofing via AI Synthesis', priority: 'high', status: 'investigating',
    assignee: 'Agent James Park', createdDate: '2024-11-20T13:00:00Z', lastUpdated: '2024-12-15T10:30:00Z', evidenceCount: 18,
    description: 'AI-generated voice samples used to bypass voice authentication system. Real-time synthesis detected using neural text-to-speech models.',
    tags: ['voice-spoofing', 'ai-generated', 'tts'],
    timeline: [
      { timestamp: '2024-11-20T13:00:00Z', action: 'Case created after liveness detection failure pattern', actor: 'System' },
      { timestamp: '2024-11-20T15:00:00Z', action: 'Voice samples collected and isolated', actor: 'Agent James Park' },
      { timestamp: '2024-11-22T11:30:00Z', action: 'Spectral analysis reveals TTS artifacts', actor: 'Analyst Tom Reeves' },
      { timestamp: '2024-12-05T09:00:00Z', action: 'Enhanced liveness challenge deployed', actor: 'System' },
      { timestamp: '2024-12-15T10:30:00Z', action: 'Investigation ongoing, additional hardening applied', actor: 'Agent James Park' }
    ]
  },
  {
    id: 'INV-2024-1003', title: 'Biometric Template Database Anomaly', priority: 'high', status: 'open',
    assignee: 'Analyst Tom Reeves', createdDate: '2024-12-01T09:00:00Z', lastUpdated: '2024-12-17T16:00:00Z', evidenceCount: 12,
    description: 'Unusual modification patterns detected in biometric template database. Potential unauthorized access to template storage.',
    tags: ['database', 'template-integrity', 'unauthorized-access'],
    timeline: [
      { timestamp: '2024-12-01T09:00:00Z', action: 'Anomaly flagged by database integrity monitor', actor: 'System' },
      { timestamp: '2024-12-01T11:30:00Z', action: 'Database access logs pulled for analysis', actor: 'Analyst Tom Reeves' },
      { timestamp: '2024-12-05T14:00:00Z', action: 'Template checksum verification completed', actor: 'Analyst Tom Reeves' },
      { timestamp: '2024-12-17T16:00:00Z', action: 'Awaiting forensic disk image analysis', actor: 'Inspector Diana Cole' }
    ]
  },
  {
    id: 'INV-2024-1156', title: 'Cross-Border Identity Fabrication Ring', priority: 'critical', status: 'escalated',
    assignee: 'Inspector Diana Cole', createdDate: '2024-10-28T07:00:00Z', lastUpdated: '2024-12-16T11:00:00Z', evidenceCount: 45,
    description: 'Organized identity fabrication ring operating across multiple jurisdictions. Forged biometric identities used for financial fraud.',
    tags: ['organized-crime', 'cross-border', 'identity-fraud', 'financial'],
    timeline: [
      { timestamp: '2024-10-28T07:00:00Z', action: 'Case opened from INTERPOL intelligence feed', actor: 'System' },
      { timestamp: '2024-10-28T10:00:00Z', action: 'Multi-agency coordination initiated', actor: 'Inspector Diana Cole' },
      { timestamp: '2024-11-05T14:00:00Z', action: '45 fraudulent identity templates identified', actor: 'Analyst Tom Reeves' },
      { timestamp: '2024-11-15T09:30:00Z', action: 'Cross-border evidence sharing agreement activated', actor: 'Inspector Diana Cole' },
      { timestamp: '2024-12-10T16:00:00Z', action: 'Escalated to federal law enforcement', actor: 'Inspector Diana Cole' },
      { timestamp: '2024-12-16T11:00:00Z', action: 'Joint task force investigation in progress', actor: 'Inspector Diana Cole' }
    ]
  },
  {
    id: 'INV-2024-1201', title: 'Liveness Detection Bypass Attempt', priority: 'medium', status: 'resolved',
    assignee: 'Dr. Sarah Mitchell', createdDate: '2024-12-05T14:00:00Z', lastUpdated: '2024-12-14T09:00:00Z', evidenceCount: 8,
    description: 'Novel 3D mask-based liveness bypass attempt detected and thwarted by multi-spectral analysis.',
    tags: ['liveness', '3d-mask', 'bypass'],
    timeline: [
      { timestamp: '2024-12-05T14:00:00Z', action: 'Bypass attempt flagged at verification endpoint', actor: 'System' },
      { timestamp: '2024-12-05T15:30:00Z', action: '3D mask materials analysis initiated', actor: 'Dr. Sarah Mitchell' },
      { timestamp: '2024-12-10T10:00:00Z', action: 'Multi-spectral countermeasure validated', actor: 'Dr. Sarah Mitchell' },
      { timestamp: '2024-12-14T09:00:00Z', action: 'Case resolved, countermeasure deployed globally', actor: 'System' }
    ]
  },
  {
    id: 'INV-2024-1289', title: 'API Key Extraction via Side-Channel', priority: 'high', status: 'investigating',
    assignee: 'Agent James Park', createdDate: '2024-12-10T11:00:00Z', lastUpdated: '2024-12-18T13:00:00Z', evidenceCount: 15,
    description: 'Timing side-channel attack used to extract API authentication keys from biometric service endpoints.',
    tags: ['side-channel', 'api-security', 'timing-attack'],
    timeline: [
      { timestamp: '2024-12-10T11:00:00Z', action: 'Anomalous API access patterns detected', actor: 'System' },
      { timestamp: '2024-12-10T14:00:00Z', action: 'Timing analysis confirms side-channel exploitation', actor: 'Agent James Park' },
      { timestamp: '2024-12-12T09:30:00Z', action: 'All affected API keys rotated', actor: 'System' },
      { timestamp: '2024-12-18T13:00:00Z', action: 'Constant-time comparison implemented', actor: 'Agent James Park' }
    ]
  },
  {
    id: 'INV-2024-1337', title: 'Insider Threat - Data Exfiltration', priority: 'critical', status: 'open',
    assignee: 'Inspector Diana Cole', createdDate: '2024-12-12T08:00:00Z', lastUpdated: '2024-12-18T10:00:00Z', evidenceCount: 31,
    description: 'Potential insider threat detected. Large-scale biometric data exfiltration attempt via authorized export channel.',
    tags: ['insider-threat', 'exfiltration', 'data-theft'],
    timeline: [
      { timestamp: '2024-12-12T08:00:00Z', action: 'DLP alert triggered on bulk export operation', actor: 'System' },
      { timestamp: '2024-12-12T09:00:00Z', action: 'User account suspended pending investigation', actor: 'Inspector Diana Cole' },
      { timestamp: '2024-12-14T11:00:00Z', action: 'Forensic workstation imaging completed', actor: 'Agent James Park' },
      { timestamp: '2024-12-18T10:00:00Z', action: 'Email and communication logs under review', actor: 'Inspector Diana Cole' }
    ]
  },
  {
    id: 'INV-2024-1402', title: 'Fingerprint Spoofing with Gelatin Mold', priority: 'low', status: 'closed',
    assignee: 'Analyst Tom Reeves', createdDate: '2024-12-01T10:00:00Z', lastUpdated: '2024-12-10T15:00:00Z', evidenceCount: 6,
    description: 'Gelatin fingerprint spoof attempt detected at physical access control point. Basic materials analysis completed.',
    tags: ['fingerprint', 'physical-access', 'material-spoof'],
    timeline: [
      { timestamp: '2024-12-01T10:00:00Z', action: 'Failed fingerprint verification with spoof indicators', actor: 'System' },
      { timestamp: '2024-12-02T09:00:00Z', action: 'Gelatin residue collected from scanner surface', actor: 'Analyst Tom Reeves' },
      { timestamp: '2024-12-06T14:00:00Z', action: 'Material analysis confirms gelatin composition', actor: 'Analyst Tom Reeves' },
      { timestamp: '2024-12-10T15:00:00Z', action: 'Case closed, scanner upgraded with pulse detection', actor: 'System' }
    ]
  }
]

function GlassCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] ${className}`}>
      {children}
    </div>
  )
}

function Badge({ config }: { config: { color: string; bg: string; label: string } }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${config.bg}`} style={{ color: config.color }}>
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: config.color }} />
      {config.label}
    </span>
  )
}

function ProgressRing({ progress, size = 36, stroke = 3 }: { progress: number; size?: number; stroke?: number }) {
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (progress / 100) * circumference
  const color = progress > 70 ? '#22c55e' : progress > 40 ? '#f59e0b' : '#ef4444'
  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
      <motion.circle
        cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circumference} strokeLinecap="round"
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      />
    </svg>
  )
}

export default function CaseInvestigationPage() {
  const [expandedCase, setExpandedCase] = useState<string | null>(null)
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState<CaseStatus | 'all'>('all')

  const filtered = cases.filter(c => {
    if (priorityFilter !== 'all' && c.priority !== priorityFilter) return false
    if (statusFilter !== 'all' && c.status !== statusFilter) return false
    return true
  })

  const stats = {
    total: cases.length,
    critical: cases.filter(c => c.priority === 'critical').length,
    open: cases.filter(c => c.status === 'open' || c.status === 'investigating').length,
    resolved: cases.filter(c => c.status === 'resolved' || c.status === 'closed').length,
    totalEvidence: cases.reduce((a, c) => a + c.evidenceCount, 0)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0014] via-[#110025] to-[#0d001a] p-6 lg:p-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight">Case Investigation Center</h1>
          <p className="mt-1 text-sm text-white/50">Active case management and forensic investigation tracking</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Total Cases', value: stats.total, color: 'text-white' },
            { label: 'Critical', value: stats.critical, color: 'text-red-400' },
            { label: 'Active', value: stats.open, color: 'text-amber-400' },
            { label: 'Resolved', value: stats.resolved, color: 'text-emerald-400' },
            { label: 'Evidence Items', value: stats.totalEvidence, color: 'text-purple-400' }
          ].map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <GlassCard className="p-4">
                <p className="text-xs text-white/40 uppercase tracking-wider">{stat.label}</p>
                <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        <div className="flex gap-2 mb-6 flex-wrap">
          {(['all', 'critical', 'high', 'medium', 'low'] as const).map(p => (
            <button
              key={p}
              onClick={() => setPriorityFilter(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${priorityFilter === p ? 'bg-purple-600/60 text-white' : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/60'}`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
          <span className="w-px h-6 bg-white/10 self-center mx-1" />
          {(['all', 'open', 'investigating', 'resolved', 'closed', 'escalated'] as const).map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${statusFilter === s ? 'bg-blue-600/60 text-white' : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/60'}`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <AnimatePresence>
            {filtered.map((c, i) => {
              const isExpanded = expandedCase === c.id
              return (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: i * 0.05 }}
                  layout
                >
                  <GlassCard className={`overflow-hidden transition-all ${isExpanded ? 'ring-2 ring-purple-500/30' : ''}`}>
                    <div
                      className="p-5 cursor-pointer hover:bg-white/[0.02] transition-colors"
                      onClick={() => setExpandedCase(isExpanded ? null : c.id)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <ProgressRing progress={c.evidenceCount * 2.2} size={36} stroke={3} />
                          <div>
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-[10px] text-white/25 font-mono">{c.id}</span>
                            </div>
                            <h3 className="text-sm font-semibold text-white">{c.title}</h3>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge config={priorityConfig[c.priority]} />
                          <Badge config={statusConfig[c.status]} />
                          <motion.svg
                            className="w-5 h-5 text-white/30"
                            fill="none" viewBox="0 0 24 24" stroke="currentColor"
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </motion.svg>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/40 ml-[52px]">
                        <span>Assignee: <span className="text-white/60">{c.assignee}</span></span>
                        <span>Evidence: <span className="text-purple-400/60">{c.evidenceCount} items</span></span>
                        <span>Updated: <span className="text-white/50 font-mono">{new Date(c.lastUpdated).toLocaleDateString()}</span></span>
                      </div>

                      <div className="flex gap-1.5 mt-3 ml-[52px]">
                        {c.tags.map(tag => (
                          <span key={tag} className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] text-white/30">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-5 border-t border-white/5 pt-4">
                            <p className="text-xs text-white/50 mb-4 leading-relaxed">{c.description}</p>

                            <div className="flex items-center justify-between mb-3">
                              <h4 className="text-xs font-semibold text-white/60 uppercase tracking-wider">Investigation Timeline</h4>
                              <span className="text-[10px] text-white/30">{c.timeline.length} events</span>
                            </div>

                            <div className="relative pl-6">
                              <div className="absolute left-2 top-1 bottom-1 w-px bg-gradient-to-b from-purple-500/30 to-transparent" />
                              <div className="space-y-3">
                                {c.timeline.map((event, j) => (
                                  <motion.div
                                    key={j}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: j * 0.05 }}
                                    className="relative"
                                  >
                                    <div
                                      className="absolute -left-[17px] top-1 h-2.5 w-2.5 rounded-full border-2 border-[#110025] z-10"
                                      style={{ backgroundColor: j === c.timeline.length - 1 ? '#a855f7' : 'rgba(255,255,255,0.15)' }}
                                    />
                                    <div className="py-1">
                                      <div className="flex items-center gap-2">
                                        <span className="text-[10px] text-white/25 font-mono">
                                          {new Date(event.timestamp).toLocaleDateString()} {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                        <span className="text-[10px] text-white/20">by</span>
                                        <span className="text-[10px] text-purple-400/60">{event.actor}</span>
                                      </div>
                                      <p className="text-xs text-white/60 mt-0.5">{event.action}</p>
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </GlassCard>
                </motion.div>
              )
            })}
          </AnimatePresence>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-white/30 text-sm">No cases match your filters</div>
          )}
        </div>
      </motion.div>
    </div>
  )
}