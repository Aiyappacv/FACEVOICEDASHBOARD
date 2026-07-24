'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type EventResult = 'success' | 'failure' | 'warning'

interface AuditEvent {
  id: string
  timestamp: string
  actor: string
  actorRole: string
  action: string
  actionCategory: 'auth' | 'access' | 'modification' | 'system' | 'export'
  target: string
  result: EventResult
  ipAddress: string
  location: string
  details: string
}

const actors = [
  { name: 'Elena Vasquez', role: 'Admin' },
  { name: 'Marcus Chen', role: 'Engineer' },
  { name: 'Aria Nakamura', role: 'Analyst' },
  { name: 'David Okafor', role: 'Manager' },
  { name: 'Sophie Laurent', role: 'Director' },
  { name: 'System', role: 'Automated' },
  { name: 'API Gateway', role: 'Service' }
]

const actions: { action: string; category: AuditEvent['actionCategory']; result: EventResult }[] = [
  { action: 'Biometric authentication', category: 'auth', result: 'success' },
  { action: 'Biometric authentication', category: 'auth', result: 'failure' },
  { action: 'Biometric authentication', category: 'auth', result: 'warning' },
  { action: 'Template enrollment', category: 'auth', result: 'success' },
  { action: 'Access control check', category: 'access', result: 'success' },
  { action: 'Access control check', category: 'access', result: 'failure' },
  { action: 'Protected resource access', category: 'access', result: 'success' },
  { action: 'Permission escalation attempt', category: 'access', result: 'failure' },
  { action: 'Biometric template update', category: 'modification', result: 'success' },
  { action: 'User profile modification', category: 'modification', result: 'success' },
  { action: 'Configuration change', category: 'modification', result: 'warning' },
  { action: 'Security policy update', category: 'modification', result: 'success' },
  { action: 'Service health check', category: 'system', result: 'success' },
  { action: 'Service restart', category: 'system', result: 'success' },
  { action: 'Database backup', category: 'system', result: 'success' },
  { action: 'Alert triggered', category: 'system', result: 'warning' },
  { action: 'Report generation', category: 'export', result: 'success' },
  { action: 'Data export', category: 'export', result: 'success' },
  { action: 'Evidence bundle download', category: 'export', result: 'success' },
  { action: 'Bulk data export', category: 'export', result: 'warning' }
]

const targets = [
  'User Profile #8847', 'Biometric Template #1203', 'Access Policy #442',
  'Face Recognition Service', 'Voice Authentication Module', 'Identity Store',
  'Audit Log Database', 'Evidence Vault', 'API Endpoint /v3/auth',
  'Session Manager', 'Encryption Key Store', 'Rate Limiter Config',
  'ML Model v2.4', 'Liveness Detection Engine', 'Cross-Match Service'
]

const locations = ['New York, US', 'London, UK', 'Tokyo, JP', 'Frankfurt, DE', 'Singapore, SG']
const ips = ['192.168.1.42', '10.0.1.107', '172.16.0.88', '203.0.113.55', '198.51.100.12', 'System', 'N/A']

function generateEvents(): AuditEvent[] {
  const events: AuditEvent[] = []
  for (let i = 0; i < 30; i++) {
    const actionData = actions[i % actions.length]
    const actor = actors[i % actors.length]
    events.push({
      id: `AUD-${String(9000 + i).padStart(6, '0')}`,
      timestamp: new Date(Date.now() - i * 3600000 * (0.5 + Math.random() * 2)).toISOString(),
      actor: actor.name,
      actorRole: actor.role,
      action: actionData.action,
      actionCategory: actionData.category,
      target: targets[i % targets.length],
      result: actionData.result,
      ipAddress: ips[i % ips.length],
      location: locations[i % locations.length],
      details: `${actionData.action} performed on ${targets[i % targets.length]} with ${actionData.result} outcome.`
    })
  }
  return events
}

const allEvents = generateEvents()

function GlassCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] ${className}`}>
      {children}
    </div>
  )
}

function ResultBadge({ result }: { result: EventResult }) {
  const config = {
    success: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', dot: 'bg-emerald-400', label: 'Success' },
    failure: { bg: 'bg-red-500/20', text: 'text-red-400', dot: 'bg-red-400', label: 'Failure' },
    warning: { bg: 'bg-amber-500/20', text: 'text-amber-400', dot: 'bg-amber-400', label: 'Warning' }
  }
  const c = config[result]
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${c.bg} ${c.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  )
}

function CategoryDot({ category }: { category: AuditEvent['actionCategory'] }) {
  const colors: Record<string, string> = {
    auth: '#a855f7', access: '#3b82f6', modification: '#f59e0b', system: '#22c55e', export: '#ec4899'
  }
  return <span className="h-2 w-2 rounded-full" style={{ backgroundColor: colors[category] }} />
}

export default function AuditTrailPage() {
  const [actorFilter, setActorFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [resultFilter, setResultFilter] = useState<EventResult | 'all'>('all')

  const filtered = useMemo(() =>
    allEvents.filter(e => {
      if (actorFilter !== 'all' && e.actor !== actorFilter) return false
      if (categoryFilter !== 'all' && e.actionCategory !== categoryFilter) return false
      if (resultFilter !== 'all' && e.result !== resultFilter) return false
      return true
    }), [actorFilter, categoryFilter, resultFilter])

  const stats = useMemo(() => ({
    total: allEvents.length,
    success: allEvents.filter(e => e.result === 'success').length,
    failure: allEvents.filter(e => e.result === 'failure').length,
    warning: allEvents.filter(e => e.result === 'warning').length,
    uniqueActors: new Set(allEvents.map(e => e.actor)).size
  }), [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0014] via-[#110025] to-[#0d001a] p-6 lg:p-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight">Immutable Audit Trail</h1>
          <p className="mt-1 text-sm text-white/50">Cryptographically signed, tamper-proof audit log</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Total Events', value: stats.total, color: 'text-white' },
            { label: 'Success', value: stats.success, color: 'text-emerald-400' },
            { label: 'Failures', value: stats.failure, color: 'text-red-400' },
            { label: 'Warnings', value: stats.warning, color: 'text-amber-400' },
            { label: 'Unique Actors', value: stats.uniqueActors, color: 'text-purple-400' }
          ].map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <GlassCard className="p-4">
                <p className="text-xs text-white/40 uppercase tracking-wider">{stat.label}</p>
                <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        <GlassCard className="p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={actorFilter}
              onChange={e => setActorFilter(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500/50"
            >
              <option value="all" className="bg-[#110025]">All Actors</option>
              {[...new Set(allEvents.map(e => e.actor))].map(a => (
                <option key={a} value={a} className="bg-[#110025]">{a}</option>
              ))}
            </select>
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500/50"
            >
              <option value="all" className="bg-[#110025]">All Categories</option>
              <option value="auth" className="bg-[#110025]">Authentication</option>
              <option value="access" className="bg-[#110025]">Access Control</option>
              <option value="modification" className="bg-[#110025]">Modification</option>
              <option value="system" className="bg-[#110025]">System</option>
              <option value="export" className="bg-[#110025]">Export</option>
            </select>
            <select
              value={resultFilter}
              onChange={e => setResultFilter(e.target.value as EventResult | 'all')}
              className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500/50"
            >
              <option value="all" className="bg-[#110025]">All Results</option>
              <option value="success" className="bg-[#110025]">Success</option>
              <option value="failure" className="bg-[#110025]">Failure</option>
              <option value="warning" className="bg-[#110025]">Warning</option>
            </select>
          </div>
        </GlassCard>

        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-purple-500/30 via-purple-500/10 to-transparent" />

          <div className="space-y-1">
            {filtered.map((event, i) => {
              const time = new Date(event.timestamp)
              const showDate = i === 0 || new Date(filtered[i - 1].timestamp).toDateString() !== time.toDateString()
              return (
                <div key={event.id}>
                  {showDate && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="relative pl-14 py-3"
                    >
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-[#110025] border-2 border-purple-500/50 z-10" />
                      <span className="text-xs font-semibold text-purple-400/60 uppercase tracking-wider">
                        {time.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </motion.div>
                  )}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.02 }}
                    className="relative pl-14"
                  >
                    <div className="absolute left-[18px] top-5 h-3 w-3 rounded-full border-2 z-10"
                      style={{
                        borderColor: event.result === 'success' ? '#22c55e' : event.result === 'failure' ? '#ef4444' : '#f59e0b',
                        backgroundColor: event.result === 'success' ? 'rgba(34,197,94,0.2)' : event.result === 'failure' ? 'rgba(239,68,68,0.2)' : 'rgba(245,158,11,0.2)'
                      }}
                    />
                    <GlassCard className="p-4 hover:bg-white/[0.05] transition-colors mb-1">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <CategoryDot category={event.actionCategory} />
                          <span className="text-sm font-medium text-white">{event.action}</span>
                        </div>
                        <ResultBadge result={event.result} />
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/40">
                        <span className="font-mono">{time.toLocaleTimeString()}</span>
                        <span>Actor: <span className="text-white/60">{event.actor}</span></span>
                        <span>Role: <span className="text-white/50">{event.actorRole}</span></span>
                        <span>Target: <span className="text-purple-400/60 font-mono">{event.target}</span></span>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-[10px] text-white/25">
                        <span>IP: {event.ipAddress}</span>
                        <span>Location: {event.location}</span>
                        <span className="font-mono">ID: {event.id}</span>
                      </div>
                    </GlassCard>
                  </motion.div>
                </div>
              )
            })}
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-white/30 text-sm">No events match your filters</div>
          )}
        </div>
      </motion.div>
    </div>
  )
}