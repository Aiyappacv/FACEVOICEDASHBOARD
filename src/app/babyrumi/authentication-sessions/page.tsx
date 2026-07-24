'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type SessionStatus = 'active' | 'completed' | 'failed'

interface Session {
  id: string
  user: string
  method: 'Face' | 'Voice' | 'Face+Voice' | 'Fingerprint'
  device: string
  location: string
  startTime: string
  duration: string
  status: SessionStatus
  riskScore: number
  ipAddress: string
  browser: string
}

const methods: Session['method'][] = ['Face', 'Voice', 'Face+Voice', 'Fingerprint']
const statuses: SessionStatus[] = ['active', 'completed', 'failed']
const users = ['Elena Vasquez', 'Marcus Chen', 'Aria Nakamura', 'David Okafor', 'Sophie Laurent', 'Raj Patel', 'Lena Kowalski', 'Carlos Mendez', 'Yuki Tanaka', 'Amara Johnson', 'Thomas Berg', 'Fatima Al-Hassan']
const devices = ['iPhone 15 Pro', 'Samsung Galaxy S24', 'Pixel 9 Pro', 'MacBook Pro 16"', 'Dell XPS 15', 'iPad Pro 12.9"', 'OnePlus 12', 'Surface Pro 9']
const locations = ['New York, US', 'London, UK', 'Tokyo, JP', 'Lagos, NG', 'Berlin, DE', 'Mumbai, IN', 'São Paulo, BR', 'Seoul, KR', 'Paris, FR', 'Sydney, AU']
const browsers = ['Chrome 124', 'Safari 17.4', 'Firefox 125', 'Edge 124', 'Opera 109']

function generateSessions(): Session[] {
  return Array.from({ length: 20 }, (_, i) => {
    const status = statuses[i % 3 === 0 ? 0 : i % 5 === 0 ? 2 : 1]
    const riskScore = status === 'failed' ? 70 + Math.floor(Math.random() * 30) : status === 'active' ? 10 + Math.floor(Math.random() * 40) : 5 + Math.floor(Math.random() * 50)
    return {
      id: `SES-${String(1000 + i).padStart(6, '0')}`,
      user: users[i % users.length],
      method: methods[i % methods.length],
      device: devices[i % devices.length],
      location: locations[i % locations.length],
      startTime: new Date(Date.now() - Math.floor(Math.random() * 86400000)).toISOString(),
      duration: status === 'active' ? `${Math.floor(Math.random() * 120)}m ${Math.floor(Math.random() * 59)}s` : `${Math.floor(Math.random() * 30) + 1}m ${Math.floor(Math.random() * 59)}s`,
      status,
      riskScore,
      ipAddress: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      browser: browsers[i % browsers.length]
    }
  })
}

const sessions = generateSessions()

function GlassCard({ children, className = '', ...props }: { children: React.ReactNode; className?: string; [key: string]: unknown }) {
  return (
    <div
      className={`rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

function StatusBadge({ status }: { status: SessionStatus }) {
  const config = {
    active: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', dot: 'bg-emerald-400', label: 'Active' },
    completed: { bg: 'bg-blue-500/20', text: 'text-blue-400', dot: 'bg-blue-400', label: 'Completed' },
    failed: { bg: 'bg-red-500/20', text: 'text-red-400', dot: 'bg-red-400', label: 'Failed' }
  }
  const c = config[status]
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${c.bg} ${c.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${c.dot} ${status === 'active' ? 'animate-pulse' : ''}`} />
      {c.label}
    </span>
  )
}

function ProgressRing({ progress, size = 40, stroke = 3 }: { progress: number; size?: number; stroke?: number }) {
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (progress / 100) * circumference
  const color = progress > 70 ? '#ef4444' : progress > 40 ? '#f59e0b' : '#22c55e'
  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={stroke} />
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

export default function AuthenticationSessionsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<SessionStatus | 'all'>('all')
  const [methodFilter, setMethodFilter] = useState<Session['method'] | 'all'>('all')
  const [selectedSession, setSelectedSession] = useState<Session | null>(null)

  const filtered = useMemo(() =>
    sessions.filter(s => {
      if (statusFilter !== 'all' && s.status !== statusFilter) return false
      if (methodFilter !== 'all' && s.method !== methodFilter) return false
      if (search && !s.user.toLowerCase().includes(search.toLowerCase()) && !s.id.toLowerCase().includes(search.toLowerCase()) && !s.location.toLowerCase().includes(search.toLowerCase())) return false
      return true
    }), [search, statusFilter, methodFilter])

  const stats = useMemo(() => ({
    total: sessions.length,
    active: sessions.filter(s => s.status === 'active').length,
    completed: sessions.filter(s => s.status === 'completed').length,
    failed: sessions.filter(s => s.status === 'failed').length,
    avgRisk: Math.round(sessions.reduce((a, s) => a + s.riskScore, 0) / sessions.length)
  }), [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0014] via-[#110025] to-[#0d001a] p-6 lg:p-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight">Authentication Sessions</h1>
          <p className="mt-1 text-sm text-white/50">Real-time biometric authentication monitoring</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Total Sessions', value: stats.total, color: 'text-white' },
            { label: 'Active Now', value: stats.active, color: 'text-emerald-400' },
            { label: 'Completed', value: stats.completed, color: 'text-blue-400' },
            { label: 'Failed', value: stats.failed, color: 'text-red-400' },
            { label: 'Avg Risk', value: `${stats.avgRisk}%`, color: stats.avgRisk > 50 ? 'text-orange-400' : 'text-emerald-400' }
          ].map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <GlassCard className="p-4">
                <p className="text-xs text-white/40 uppercase tracking-wider">{stat.label}</p>
                <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        <GlassCard className="p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Search by user, session ID, or location..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50"
            />
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as SessionStatus | 'all')}
              className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500/50"
            >
              <option value="all" className="bg-[#110025]">All Status</option>
              <option value="active" className="bg-[#110025]">Active</option>
              <option value="completed" className="bg-[#110025]">Completed</option>
              <option value="failed" className="bg-[#110025]">Failed</option>
            </select>
            <select
              value={methodFilter}
              onChange={e => setMethodFilter(e.target.value as Session['method'] | 'all')}
              className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500/50"
            >
              <option value="all" className="bg-[#110025]">All Methods</option>
              <option value="Face" className="bg-[#110025]">Face</option>
              <option value="Voice" className="bg-[#110025]">Voice</option>
              <option value="Face+Voice" className="bg-[#110025]">Face + Voice</option>
              <option value="Fingerprint" className="bg-[#110025]">Fingerprint</option>
            </select>
          </div>
        </GlassCard>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-2">
            <AnimatePresence>
              {filtered.map((session, i) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => setSelectedSession(session)}
                  className={`cursor-pointer transition-all ${selectedSession?.id === session.id ? 'ring-2 ring-purple-500/50' : ''}`}
                >
                  <GlassCard className="p-4 hover:bg-white/[0.05] transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500/30 to-blue-500/30 flex items-center justify-center text-white text-sm font-semibold">
                          {session.user.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-white">{session.user}</span>
                            <span className="text-[10px] text-white/30 font-mono">{session.id}</span>
                          </div>
                          <div className="flex items-center gap-3 mt-0.5">
                            <span className="text-xs text-white/40">{session.method}</span>
                            <span className="text-xs text-white/20">|</span>
                            <span className="text-xs text-white/40">{session.device}</span>
                            <span className="text-xs text-white/20">|</span>
                            <span className="text-xs text-white/40">{session.location}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <StatusBadge status={session.status} />
                        <div className="relative flex items-center justify-center">
                          <ProgressRing progress={session.riskScore} size={40} stroke={3} />
                          <span className="absolute text-[10px] font-bold text-white">{session.riskScore}</span>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </AnimatePresence>
            {filtered.length === 0 && (
              <div className="text-center py-12 text-white/30 text-sm">No sessions match your filters</div>
            )}
          </div>

          <div className="xl:col-span-1">
            <div className="sticky top-6">
              <AnimatePresence mode="wait">
                {selectedSession ? (
                  <motion.div
                    key={selectedSession.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <GlassCard className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-white">Session Details</h3>
                        <StatusBadge status={selectedSession.status} />
                      </div>
                      <div className="space-y-4">
                        {[
                          { label: 'Session ID', value: selectedSession.id },
                          { label: 'User', value: selectedSession.user },
                          { label: 'Method', value: selectedSession.method },
                          { label: 'Device', value: selectedSession.device },
                          { label: 'Browser', value: selectedSession.browser },
                          { label: 'IP Address', value: selectedSession.ipAddress },
                          { label: 'Location', value: selectedSession.location },
                          { label: 'Start Time', value: new Date(selectedSession.startTime).toLocaleString() },
                          { label: 'Duration', value: selectedSession.duration }
                        ].map(item => (
                          <div key={item.label} className="flex justify-between items-center py-2 border-b border-white/5">
                            <span className="text-xs text-white/40 uppercase tracking-wider">{item.label}</span>
                            <span className="text-sm text-white/80 font-mono">{item.value}</span>
                          </div>
                        ))}
                        <div className="pt-2">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs text-white/40 uppercase tracking-wider">Risk Score</span>
                            <span className="text-sm text-white/80 font-mono">{selectedSession.riskScore}%</span>
                          </div>
                          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full rounded-full"
                              style={{ backgroundColor: selectedSession.riskScore > 70 ? '#ef4444' : selectedSession.riskScore > 40 ? '#f59e0b' : '#22c55e' }}
                              initial={{ width: 0 }}
                              animate={{ width: `${selectedSession.riskScore}%` }}
                              transition={{ duration: 0.8, ease: 'easeOut' }}
                            />
                          </div>
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                ) : (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <GlassCard className="p-8 flex flex-col items-center justify-center text-center">
                      <div className="h-16 w-16 rounded-full bg-purple-500/10 flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-purple-400/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                        </svg>
                      </div>
                      <p className="text-sm text-white/30">Select a session to view details</p>
                    </GlassCard>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}