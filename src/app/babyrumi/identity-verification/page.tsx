'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GlassCard } from '@/components/ui/glass-card'
import { StatusBadge } from '@/components/ui/status-badge'
import { ProgressRing } from '@/components/ui/progress-ring'
import { RealtimeChart } from '@/components/charts/realtime-chart'
import { cn } from '@/lib/utils'
import {
  UserCheck,
  Shield,
  ScanFace,
  Mic,
  Fingerprint,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Eye,
} from 'lucide-react'

type Decision = 'ALLOW' | 'DENY' | 'STEP-UP'

interface VerificationEntry {
  id: string
  name: string
  initials: string
  color: string
  userId: string
  methods: ('face' | 'voice' | 'fingerprint')[]
  riskScore: number
  decision: Decision
  duration: number
  timestamp: string
}

const methodIcons: Record<string, typeof ScanFace> = {
  face: ScanFace,
  voice: Mic,
  fingerprint: Fingerprint,
}

const methodColors: Record<string, string> = {
  face: 'text-cyan-400 bg-cyan-500/15',
  voice: 'text-violet-400 bg-violet-500/15',
  fingerprint: 'text-amber-400 bg-amber-500/15',
}

const avatarColors = [
  'from-cyan-500 to-blue-600',
  'from-violet-500 to-purple-600',
  'from-rose-500 to-pink-600',
  'from-emerald-500 to-teal-600',
  'from-amber-500 to-orange-600',
  'from-fuchsia-500 to-pink-600',
  'from-sky-500 to-indigo-600',
]

const verificationData: VerificationEntry[] = [
  { id: 'VRF-001', name: 'Aisha Patel', initials: 'AP', color: avatarColors[0], userId: 'USR-88421', methods: ['face', 'voice'], riskScore: 12, decision: 'ALLOW', duration: 1.2, timestamp: '2s ago' },
  { id: 'VRF-002', name: 'Marcus Chen', initials: 'MC', color: avatarColors[1], userId: 'USR-33192', methods: ['face'], riskScore: 34, decision: 'ALLOW', duration: 0.9, timestamp: '5s ago' },
  { id: 'VRF-003', name: 'Sarah Williams', initials: 'SW', color: avatarColors[2], userId: 'USR-77105', methods: ['face', 'voice', 'fingerprint'], riskScore: 5, decision: 'ALLOW', duration: 2.1, timestamp: '8s ago' },
  { id: 'VRF-004', name: 'Raj Gupta', initials: 'RG', color: avatarColors[3], userId: 'USR-12984', methods: ['voice'], riskScore: 67, decision: 'STEP-UP', duration: 3.4, timestamp: '11s ago' },
  { id: 'VRF-005', name: 'Elena Volkov', initials: 'EV', color: avatarColors[4], userId: 'USR-55781', methods: ['face', 'fingerprint'], riskScore: 89, decision: 'DENY', duration: 1.8, timestamp: '14s ago' },
  { id: 'VRF-006', name: 'James O\'Brien', initials: 'JO', color: avatarColors[5], userId: 'USR-66230', methods: ['face', 'voice'], riskScore: 8, decision: 'ALLOW', duration: 1.0, timestamp: '17s ago' },
  { id: 'VRF-007', name: 'Fatima Al-Hassan', initials: 'FA', color: avatarColors[6], userId: 'USR-91453', methods: ['fingerprint'], riskScore: 72, decision: 'STEP-UP', duration: 2.9, timestamp: '20s ago' },
  { id: 'VRF-008', name: 'David Kim', initials: 'DK', color: avatarColors[0], userId: 'USR-44612', methods: ['face', 'voice'], riskScore: 15, decision: 'ALLOW', duration: 1.1, timestamp: '23s ago' },
  { id: 'VRF-009', name: 'Olivia Santos', initials: 'OS', color: avatarColors[1], userId: 'USR-22897', methods: ['face'], riskScore: 95, decision: 'DENY', duration: 1.5, timestamp: '26s ago' },
  { id: 'VRF-010', name: 'Yusuf Abadi', initials: 'YA', color: avatarColors[2], userId: 'USR-38204', methods: ['voice', 'fingerprint'], riskScore: 22, decision: 'ALLOW', duration: 1.7, timestamp: '30s ago' },
  { id: 'VRF-011', name: 'Mei Lin Zhang', initials: 'MZ', color: avatarColors[3], userId: 'USR-73916', methods: ['face', 'voice', 'fingerprint'], riskScore: 3, decision: 'ALLOW', duration: 2.3, timestamp: '33s ago' },
  { id: 'VRF-012', name: 'Liam O\'Connor', initials: 'LO', color: avatarColors[4], userId: 'USR-81547', methods: ['face'], riskScore: 78, decision: 'STEP-UP', duration: 3.1, timestamp: '36s ago' },
  { id: 'VRF-013', name: 'Nina Petrova', initials: 'NP', color: avatarColors[5], userId: 'USR-59328', methods: ['voice'], riskScore: 55, decision: 'DENY', duration: 1.6, timestamp: '40s ago' },
  { id: 'VRF-014', name: 'Carlos Mendez', initials: 'CM', color: avatarColors[6], userId: 'USR-14075', methods: ['face', 'fingerprint'], riskScore: 18, decision: 'ALLOW', duration: 1.3, timestamp: '42s ago' },
  { id: 'VRF-015', name: 'Ananya Sharma', initials: 'AS', color: avatarColors[0], userId: 'USR-67842', methods: ['face', 'voice'], riskScore: 28, decision: 'ALLOW', duration: 1.4, timestamp: '45s ago' },
]

const filterTabs = ['All', 'Verified', 'Failed', 'Step-Up'] as const
type FilterTab = (typeof filterTabs)[number]

function riskColor(score: number) {
  if (score <= 30) return 'text-emerald-400'
  if (score <= 60) return 'text-amber-400'
  return 'text-red-400'
}

function riskBg(score: number) {
  if (score <= 30) return 'bg-emerald-500/10'
  if (score <= 60) return 'bg-amber-500/10'
  return 'bg-red-500/10'
}

function decisionConfig(d: Decision) {
  switch (d) {
    case 'ALLOW':
      return {
        label: 'ALLOW',
        icon: CheckCircle2,
        bg: 'bg-emerald-500/15',
        text: 'text-emerald-400',
        border: 'border-emerald-500/30',
        glow: 'shadow-emerald-500/10',
      }
    case 'DENY':
      return {
        label: 'DENY',
        icon: XCircle,
        bg: 'bg-red-500/15',
        text: 'text-red-400',
        border: 'border-red-500/30',
        glow: 'shadow-red-500/10',
      }
    case 'STEP-UP':
      return {
        label: 'STEP-UP',
        icon: AlertTriangle,
        bg: 'bg-amber-500/15',
        text: 'text-amber-400',
        border: 'border-amber-500/30',
        glow: 'shadow-amber-500/10',
      }
  }
}

const pieSegments = [
  { label: 'Allow', value: 89, color: 'rgb(52, 211, 153)' },
  { label: 'Step-Up', value: 6, color: 'rgb(251, 191, 36)' },
  { label: 'Deny', value: 5, color: 'rgb(248, 113, 113)' },
]

export default function IdentityVerificationPage() {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('All')
  const [liveCount, setLiveCount] = useState(24847)

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCount((c) => c + Math.floor(Math.random() * 3))
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const filtered = verificationData.filter((v) => {
    if (activeFilter === 'Verified') return v.decision === 'ALLOW'
    if (activeFilter === 'Failed') return v.decision === 'DENY'
    if (activeFilter === 'Step-Up') return v.decision === 'STEP-UP'
    return true
  })

  const pieRadius = 90
  const pieCenter = 110

  function pieChart() {
    let cum = 0
    const total = pieSegments.reduce((s, seg) => s + seg.value, 0)
    const r = pieRadius
    const cx = pieCenter
    const cy = pieCenter

    return pieSegments.map((seg, i) => {
      const startAngle = (cum / total) * 2 * Math.PI - Math.PI / 2
      cum += seg.value
      const endAngle = (cum / total) * 2 * Math.PI - Math.PI / 2

      const x1 = cx + r * Math.cos(startAngle)
      const y1 = cy + r * Math.sin(startAngle)
      const x2 = cx + r * Math.cos(endAngle)
      const y2 = cy + r * Math.sin(endAngle)

      const largeArc = seg.value / total > 0.5 ? 1 : 0

      const midAngle = startAngle + (endAngle - startAngle) / 2
      const labelR = r * 0.65
      const lx = cx + labelR * Math.cos(midAngle)
      const ly = cy + labelR * Math.sin(midAngle)

      return (
        <g key={i}>
          <path
            d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`}
            fill={seg.color}
            opacity={0.85}
            className="transition-opacity hover:opacity-100"
          />
          <text x={lx} y={ly} textAnchor="middle" dominantBaseline="central" className="fill-white text-xs font-bold">
            {seg.value}%
          </text>
        </g>
      )
    })
  }

  return (
    <div className="min-h-screen bg-[#07080d] p-6 lg:p-8">
      <div className="mx-auto max-w-[1600px] space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-600 shadow-lg shadow-emerald-500/20">
              <Shield className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white">Identity Verification Center</h1>
              <p className="mt-0.5 text-sm text-white/40">Multi-factor biometric verification engine</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge variant="success" label="Online" />
            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-2">
              <span className="text-xs text-white/40">Sessions</span>
              <p className="text-lg font-bold text-white tabular-nums">{liveCount.toLocaleString()}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-2">
              <span className="text-xs text-white/40">Success Rate</span>
              <p className="text-lg font-bold text-emerald-400 tabular-nums">97.8%</p>
            </div>
          </div>
        </motion.div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { label: 'Verified', value: '24,847', icon: CheckCircle2, color: 'text-emerald-400', bg: 'from-emerald-500/10 to-emerald-500/5', border: 'border-emerald-500/20', ring: 'ring-emerald-500/20' },
            { label: 'Pending', value: '127', icon: Clock, color: 'text-amber-400', bg: 'from-amber-500/10 to-amber-500/5', border: 'border-amber-500/20', ring: 'ring-amber-500/20' },
            { label: 'Failed', value: '342', icon: XCircle, color: 'text-red-400', bg: 'from-red-500/10 to-red-500/5', border: 'border-red-500/20', ring: 'ring-red-500/20' },
            { label: 'Step-Up Required', value: '89', icon: AlertTriangle, color: 'text-orange-400', bg: 'from-orange-500/10 to-orange-500/5', border: 'border-orange-500/20', ring: 'ring-orange-500/20' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.07 }}
            >
              <GlassCard className={cn('relative overflow-hidden border bg-gradient-to-br p-5', stat.bg, stat.border)}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-white/50">{stat.label}</p>
                    <p className={cn('mt-1.5 text-3xl font-bold tabular-nums', stat.color)}>{stat.value}</p>
                  </div>
                  <div className={cn('rounded-xl bg-white/5 p-2.5 ring-1', stat.ring)}>
                    <stat.icon className={cn('h-5 w-5', stat.color)} />
                  </div>
                </div>
                <div className={cn('absolute -bottom-8 -right-8 h-24 w-24 rounded-full opacity-20 blur-2xl', stat.bg)} />
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-center gap-2"
        >
          {filterTabs.map((tab) => {
            const counts = {
              All: verificationData.length,
              Verified: verificationData.filter((v) => v.decision === 'ALLOW').length,
              Failed: verificationData.filter((v) => v.decision === 'DENY').length,
              'Step-Up': verificationData.filter((v) => v.decision === 'STEP-UP').length,
            }
            return (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={cn(
                  'rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200',
                  activeFilter === tab
                    ? 'bg-white/10 text-white shadow-lg shadow-white/5'
                    : 'text-white/40 hover:bg-white/5 hover:text-white/60'
                )}
              >
                {tab}
                <span className="ml-2 rounded-md bg-white/10 px-1.5 py-0.5 text-xs tabular-nums">
                  {counts[tab]}
                </span>
              </button>
            )
          })}
        </motion.div>

        {/* Verification List */}
        <GlassCard className="border-white/[0.06] p-0 overflow-hidden">
          <div className="divide-y divide-white/[0.06]">
            <AnimatePresence mode="popLayout">
              {filtered.map((entry, idx) => {
                const dc = decisionConfig(entry.decision)
                const DecisionIcon = dc.icon
                return (
                  <motion.div
                    key={entry.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20, scale: 0.95 }}
                    transition={{ duration: 0.3, delay: idx * 0.02 }}
                    className="group flex items-center gap-5 px-6 py-4 transition-colors hover:bg-white/[0.02]"
                  >
                    {/* Avatar */}
                    <div className={cn('flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-sm font-bold text-white shadow-lg', entry.color)}>
                      {entry.initials}
                    </div>

                    {/* User Info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-semibold text-white">{entry.name}</p>
                        <span className="text-xs text-white/30">{entry.id}</span>
                      </div>
                      <div className="mt-1 flex items-center gap-1.5">
                        <span className="text-xs text-white/25">{entry.userId}</span>
                      </div>
                    </div>

                    {/* Methods */}
                    <div className="hidden items-center gap-1.5 md:flex">
                      {entry.methods.map((m) => {
                        const MIcon = methodIcons[m]
                        return (
                          <div
                            key={m}
                            className={cn('flex h-8 w-8 items-center justify-center rounded-lg', methodColors[m])}
                            title={m.charAt(0).toUpperCase() + m.slice(1)}
                          >
                            <MIcon className="h-4 w-4" />
                          </div>
                        )
                      })}
                    </div>

                    {/* Risk Score */}
                    <div className={cn('hidden w-20 items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold tabular-nums lg:flex', riskBg(entry.riskScore), riskColor(entry.riskScore))}>
                      {entry.riskScore}
                    </div>

                    {/* Decision */}
                    <div className={cn('flex items-center gap-2 rounded-xl border px-4 py-2 font-bold shadow-lg', dc.bg, dc.text, dc.border, dc.glow)}>
                      <DecisionIcon className="h-4 w-4" />
                      <span className="text-sm">{dc.label}</span>
                    </div>

                    {/* Duration */}
                    <div className="hidden w-20 text-center text-sm text-white/40 tabular-nums sm:block">
                      {entry.duration}s
                    </div>

                    {/* Timestamp */}
                    <div className="w-16 text-right text-xs text-white/30">
                      {entry.timestamp}
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        </GlassCard>

        {/* Bottom Charts Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Realtime Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <GlassCard className="border-white/[0.06] p-6">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-cyan-500/10 p-2">
                    <Eye className="h-5 w-5 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">Verification Volume</h3>
                    <p className="text-xs text-white/35">Requests per minute</p>
                  </div>
                </div>
            <StatusBadge variant="success" label="Active" />
              </div>
              <RealtimeChart data={[]} color="#4DFF88" height={200} />
            </GlassCard>
          </motion.div>

          {/* Pie Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <GlassCard className="border-white/[0.06] p-6">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-violet-500/10 p-2">
                    <UserCheck className="h-5 w-5 text-violet-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">Decision Distribution</h3>
                    <p className="text-xs text-white/35">Last 24 hours</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center gap-8">
                <svg width={220} height={220} className="flex-shrink-0">
                  {pieChart()}
                  <circle cx={pieCenter} cy={pieCenter} r={50} fill="#0d0f17" />
                  <text x={pieCenter} y={pieCenter - 8} textAnchor="middle" dominantBaseline="central" className="fill-white text-xl font-bold">
                    24.8k
                  </text>
                  <text x={pieCenter} y={pieCenter + 12} textAnchor="middle" dominantBaseline="central" className="fill-white/40 text-[10px]">
                    TOTAL
                  </text>
                </svg>
                <div className="flex flex-col gap-4">
                  {pieSegments.map((seg) => (
                    <div key={seg.label} className="flex items-center gap-3">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: seg.color }} />
                      <div>
                        <p className="text-sm font-semibold text-white">{seg.label}</p>
                        <p className="text-xs text-white/40">{seg.value}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
