'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type CustodyStatus = 'verified' | 'pending' | 'tampered' | 'sealed'

interface EvidenceBundle {
  id: string
  caseId: string
  title: string
  timestamp: string
  hash: string
  chainOfCustody: CustodyStatus
  digitalSignature: string
  fileCount: number
  totalSize: string
  description: string
  files: { name: string; type: string; size: string }[]
  custodian: string
  lastAccessed: string
}

const cases = ['CASE-2024-0847', 'CASE-2024-0912', 'CASE-2024-1003', 'CASE-2024-1156', 'CASE-2024-1201', 'CASE-2024-1289', 'CASE-2024-1337', 'CASE-2024-1402', 'CASE-2024-1518', 'CASE-2024-1605']
const titles = [
  'Facial Recognition Match Report', 'Voice Authentication Transcript', 'Multi-Modal Biometric Analysis',
  'Device Enrollment Verification', 'Identity Theft Evidence Package', 'Cross-Border Verification Log',
  'Access Control Breach Evidence', 'Biometric Template Comparison', 'Liveness Detection Report',
  'Authentication Anomaly Evidence'
]
const custodians = ['Dr. Sarah Mitchell', 'Agent James Park', 'Officer Maria Garcia', 'Analyst Tom Reeves', 'Inspector Diana Cole']

const evidenceData: EvidenceBundle[] = titles.map((title, i) => {
  const fileCount = 3 + Math.floor(Math.random() * 8)
  return {
    id: `EVD-${String(4000 + i).padStart(6, '0')}`,
    caseId: cases[i],
    title,
    timestamp: new Date(Date.now() - Math.floor(Math.random() * 30 * 86400000)).toISOString(),
    hash: `${Array.from({ length: 8 }, () => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join('')}...${Array.from({ length: 4 }, () => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join('')}`,
    chainOfCustody: (['verified', 'verified', 'verified', 'pending', 'sealed', 'tampered'] as CustodyStatus[])[i % 6],
    digitalSignature: `SHA-256:${Array.from({ length: 12 }, () => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join('')}`,
    fileCount,
    totalSize: `${(Math.random() * 500 + 10).toFixed(1)} MB`,
    description: `Comprehensive digital evidence bundle for ${title.toLowerCase()}. Contains verified biometric data, chain of custody documentation, and cryptographic proof of integrity.`,
    files: Array.from({ length: fileCount }, (_, j) => ({
      name: ['biometric_scan.dat', 'auth_log.json', 'face_template.bin', 'voice_print.wav', 'liveness_video.mp4', 'device_info.xml', 'access_record.db', 'hash_manifest.sha256', 'signature_cert.pem', 'audit_export.csv'][j % 10],
      type: ['Data', 'JSON', 'Binary', 'Audio', 'Video', 'XML', 'Database', 'Hash', 'Certificate', 'CSV'][j % 10],
      size: `${(Math.random() * 80 + 1).toFixed(1)} MB`
    })),
    custodian: custodians[i % custodians.length],
    lastAccessed: new Date(Date.now() - Math.floor(Math.random() * 7 * 86400000)).toISOString()
  }
})

function GlassCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] ${className}`}>
      {children}
    </div>
  )
}

function StatusBadge({ status }: { status: CustodyStatus }) {
  const config = {
    verified: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', label: 'Verified', icon: '✓' },
    pending: { bg: 'bg-amber-500/20', text: 'text-amber-400', label: 'Pending', icon: '◷' },
    sealed: { bg: 'bg-blue-500/20', text: 'text-blue-400', label: 'Sealed', icon: '🔒' },
    tampered: { bg: 'bg-red-500/20', text: 'text-red-400', label: 'Tampered', icon: '⚠' }
  }
  const c = config[status]
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${c.bg} ${c.text}`}>
      {c.icon} {c.label}
    </span>
  )
}

export default function EvidenceCenterPage() {
  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceBundle | null>(null)
  const [filter, setFilter] = useState<CustodyStatus | 'all'>('all')

  const filtered = filter === 'all' ? evidenceData : evidenceData.filter(e => e.chainOfCustody === filter)
  const stats = {
    total: evidenceData.length,
    verified: evidenceData.filter(e => e.chainOfCustody === 'verified').length,
    pending: evidenceData.filter(e => e.chainOfCustody === 'pending').length,
    sealed: evidenceData.filter(e => e.chainOfCustody === 'sealed').length,
    tampered: evidenceData.filter(e => e.chainOfCustody === 'tampered').length
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0014] via-[#110025] to-[#0d001a] p-6 lg:p-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Digital Evidence Center</h1>
            <p className="mt-1 text-sm text-white/50">Forensic evidence management & chain of custody</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mt-4 sm:mt-0 inline-flex items-center gap-2 rounded-xl bg-purple-600/80 px-5 py-2.5 text-sm font-medium text-white hover:bg-purple-500/80 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            Export Report
          </motion.button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Total Bundles', value: stats.total, color: 'text-white' },
            { label: 'Verified', value: stats.verified, color: 'text-emerald-400' },
            { label: 'Pending', value: stats.pending, color: 'text-amber-400' },
            { label: 'Sealed', value: stats.sealed, color: 'text-blue-400' },
            { label: 'Tampered', value: stats.tampered, color: 'text-red-400' }
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
          {(['all', 'verified', 'pending', 'sealed', 'tampered'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === f ? 'bg-purple-600/60 text-white' : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/60'}`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-3">
            {filtered.map((evidence, i) => (
              <motion.div
                key={evidence.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setSelectedEvidence(evidence)}
                className={`cursor-pointer transition-all ${selectedEvidence?.id === evidence.id ? 'ring-2 ring-purple-500/50 rounded-2xl' : ''}`}
              >
                <GlassCard className="p-5 hover:bg-white/[0.05] transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] text-white/25 font-mono">{evidence.id}</span>
                        <span className="text-[10px] text-white/20">|</span>
                        <span className="text-[10px] text-purple-400/60 font-mono">{evidence.caseId}</span>
                      </div>
                      <h3 className="text-sm font-semibold text-white">{evidence.title}</h3>
                    </div>
                    <StatusBadge status={evidence.chainOfCustody} />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <span className="text-white/30 block">Timestamp</span>
                      <span className="text-white/60 font-mono">{new Date(evidence.timestamp).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <span className="text-white/30 block">Files</span>
                      <span className="text-white/60">{evidence.fileCount} files</span>
                    </div>
                    <div>
                      <span className="text-white/30 block">Size</span>
                      <span className="text-white/60">{evidence.totalSize}</span>
                    </div>
                    <div>
                      <span className="text-white/30 block">Hash</span>
                      <span className="text-white/60 font-mono">{evidence.hash}</span>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          <div className="xl:col-span-1">
            <div className="sticky top-6">
              <AnimatePresence mode="wait">
                {selectedEvidence ? (
                  <motion.div
                    key={selectedEvidence.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <GlassCard className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white">Evidence Details</h3>
                        <StatusBadge status={selectedEvidence.chainOfCustody} />
                      </div>

                      <div className="space-y-3 mb-6">
                        <div>
                          <span className="text-[10px] text-white/30 uppercase tracking-wider">Title</span>
                          <p className="text-sm text-white/80">{selectedEvidence.title}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <span className="text-[10px] text-white/30 uppercase tracking-wider">Evidence ID</span>
                            <p className="text-xs text-white/60 font-mono">{selectedEvidence.id}</p>
                          </div>
                          <div>
                            <span className="text-[10px] text-white/30 uppercase tracking-wider">Case ID</span>
                            <p className="text-xs text-purple-400 font-mono">{selectedEvidence.caseId}</p>
                          </div>
                        </div>
                        <div>
                          <span className="text-[10px] text-white/30 uppercase tracking-wider">Description</span>
                          <p className="text-xs text-white/50 mt-0.5">{selectedEvidence.description}</p>
                        </div>
                        <div className="py-2 border-t border-white/5">
                          <span className="text-[10px] text-white/30 uppercase tracking-wider block mb-1">Cryptographic Hash</span>
                          <p className="text-[11px] text-emerald-400/80 font-mono bg-white/5 rounded-lg px-3 py-2 break-all">{selectedEvidence.hash}</p>
                        </div>
                        <div className="py-2 border-t border-white/5">
                          <span className="text-[10px] text-white/30 uppercase tracking-wider block mb-1">Digital Signature</span>
                          <p className="text-[11px] text-blue-400/80 font-mono bg-white/5 rounded-lg px-3 py-2 break-all">{selectedEvidence.digitalSignature}</p>
                        </div>
                      </div>

                      <div className="border-t border-white/5 pt-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs text-white/40 uppercase tracking-wider">Files ({selectedEvidence.fileCount})</span>
                          <span className="text-xs text-white/30">{selectedEvidence.totalSize}</span>
                        </div>
                        <div className="space-y-1.5 max-h-48 overflow-y-auto">
                          {selectedEvidence.files.map((file, j) => (
                            <motion.div
                              key={j}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: j * 0.05 }}
                              className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.05]"
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] text-white/20">{'📄'}</span>
                                <span className="text-xs text-white/60">{file.name}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-[10px] text-white/25">{file.type}</span>
                                <span className="text-[10px] text-white/30 font-mono">{file.size}</span>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-white/5">
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div>
                            <span className="text-white/30 block">Custodian</span>
                            <span className="text-white/60">{selectedEvidence.custodian}</span>
                          </div>
                          <div>
                            <span className="text-white/30 block">Last Accessed</span>
                            <span className="text-white/60 font-mono">{new Date(selectedEvidence.lastAccessed).toLocaleDateString()}</span>
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
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                      <p className="text-sm text-white/30">Select an evidence bundle to view details</p>
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