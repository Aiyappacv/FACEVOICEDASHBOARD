'use client'

import { useState, useCallback, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type NodeType = 'user' | 'device' | 'biometric' | 'verification'

interface GraphNode {
  id: string
  label: string
  type: NodeType
  x: number
  y: number
  metadata: Record<string, string>
}

interface GraphEdge {
  from: string
  to: string
  label: string
  strength: number
}

const typeConfig: Record<NodeType, { color: string; fill: string; radius: number; label: string }> = {
  user: { color: '#a855f7', fill: 'rgba(168,85,247,0.25)', radius: 28, label: 'User' },
  device: { color: '#3b82f6', fill: 'rgba(59,130,246,0.25)', radius: 22, label: 'Device' },
  biometric: { color: '#22c55e', fill: 'rgba(34,197,94,0.25)', radius: 20, label: 'Biometric' },
  verification: { color: '#f59e0b', fill: 'rgba(245,158,11,0.25)', radius: 18, label: 'Verification' }
}

const graphNodes: GraphNode[] = [
  { id: 'u1', label: 'Elena Vasquez', type: 'user', x: 400, y: 200, metadata: { role: 'Admin', trust: '98%', enrollDate: '2024-01-15' } },
  { id: 'u2', label: 'Marcus Chen', type: 'user', x: 700, y: 150, metadata: { role: 'Engineer', trust: '95%', enrollDate: '2024-03-22' } },
  { id: 'u3', label: 'Aria Nakamura', type: 'user', x: 250, y: 400, metadata: { role: 'Analyst', trust: '92%', enrollDate: '2024-02-10' } },
  { id: 'u4', label: 'David Okafor', type: 'user', x: 650, y: 400, metadata: { role: 'Manager', trust: '97%', enrollDate: '2023-11-05' } },
  { id: 'u5', label: 'Sophie Laurent', type: 'user', x: 500, y: 500, metadata: { role: 'Director', trust: '99%', enrollDate: '2023-08-18' } },
  { id: 'd1', label: 'iPhone 15 Pro', type: 'device', x: 250, y: 150, metadata: { os: 'iOS 17.4', lastSync: '2m ago', trust: '96%' } },
  { id: 'd2', label: 'MacBook Pro', type: 'device', x: 550, y: 100, metadata: { os: 'macOS 14.4', lastSync: '5m ago', trust: '94%' } },
  { id: 'd3', label: 'Pixel 9 Pro', type: 'device', x: 150, y: 300, metadata: { os: 'Android 15', lastSync: '12m ago', trust: '91%' } },
  { id: 'd4', label: 'Surface Pro 9', type: 'device', x: 800, y: 300, metadata: { os: 'Windows 11', lastSync: '1h ago', trust: '88%' } },
  { id: 'd5', label: 'iPad Pro', type: 'device', x: 450, y: 350, metadata: { os: 'iPadOS 17.4', lastSync: '8m ago', trust: '95%' } },
  { id: 'b1', label: 'Face Template #1', type: 'biometric', x: 130, y: 180, metadata: { quality: '99.2%', liveness: 'Verified', hash: 'a3f2...c91d' } },
  { id: 'b2', label: 'Voice Print #1', type: 'biometric', x: 620, y: 80, metadata: { quality: '97.8%', liveness: 'Verified', hash: '7b1e...4f2a' } },
  { id: 'b3', label: 'Face Template #2', type: 'biometric', x: 320, y: 480, metadata: { quality: '98.5%', liveness: 'Verified', hash: 'c9d4...8e7b' } },
  { id: 'b4', label: 'Fingerprint #1', type: 'biometric', x: 750, y: 450, metadata: { quality: '96.1%', liveness: 'Verified', hash: '2f8a...d3c5' } },
  { id: 'b5', label: 'Voice Print #2', type: 'biometric', x: 580, y: 500, metadata: { quality: '95.4%', liveness: 'Pending', hash: 'e1b7...6a9f' } },
  { id: 'v1', label: 'Login 08:14', type: 'verification', x: 180, y: 100, metadata: { result: 'Passed', confidence: '99.1%', method: 'Face+Voice' } },
  { id: 'v2', label: 'Access 09:30', type: 'verification', x: 480, y: 60, metadata: { result: 'Passed', confidence: '97.4%', method: 'Face' } },
  { id: 'v3', label: 'Transfer 11:00', type: 'verification', x: 350, y: 320, metadata: { result: 'Passed', confidence: '98.8%', method: 'Face+Voice' } },
  { id: 'v4', label: 'Admin 13:45', type: 'verification', x: 700, y: 500, metadata: { result: 'Failed', confidence: '72.3%', method: 'Fingerprint' } },
  { id: 'v5', label: 'Export 15:20', type: 'verification', x: 850, y: 200, metadata: { result: 'Passed', confidence: '96.7%', method: 'Voice' } }
]

const graphEdges: GraphEdge[] = [
  { from: 'u1', to: 'd1', label: 'owns', strength: 0.9 },
  { from: 'u1', to: 'b1', label: 'enrolled', strength: 1.0 },
  { from: 'u1', to: 'v1', label: 'initiated', strength: 0.8 },
  { from: 'd1', to: 'v1', label: 'used', strength: 0.9 },
  { from: 'b1', to: 'v1', label: 'matched', strength: 0.95 },
  { from: 'u2', to: 'd2', label: 'owns', strength: 0.85 },
  { from: 'u2', to: 'b2', label: 'enrolled', strength: 0.95 },
  { from: 'u2', to: 'v2', label: 'initiated', strength: 0.8 },
  { from: 'd2', to: 'v2', label: 'used', strength: 0.85 },
  { from: 'b2', to: 'v2', label: 'matched', strength: 0.9 },
  { from: 'u3', to: 'd3', label: 'owns', strength: 0.8 },
  { from: 'u3', to: 'b3', label: 'enrolled', strength: 0.9 },
  { from: 'u3', to: 'v3', label: 'initiated', strength: 0.75 },
  { from: 'd5', to: 'v3', label: 'used', strength: 0.85 },
  { from: 'b3', to: 'v3', label: 'matched', strength: 0.88 },
  { from: 'u4', to: 'd4', label: 'owns', strength: 0.85 },
  { from: 'u4', to: 'b4', label: 'enrolled', strength: 0.92 },
  { from: 'u4', to: 'v4', label: 'initiated', strength: 0.7 },
  { from: 'd4', to: 'v4', label: 'used', strength: 0.75 },
  { from: 'b4', to: 'v4', label: 'matched', strength: 0.65 },
  { from: 'u5', to: 'd5', label: 'owns', strength: 0.9 },
  { from: 'u5', to: 'b5', label: 'enrolled', strength: 0.88 },
  { from: 'u5', to: 'v5', label: 'initiated', strength: 0.85 },
  { from: 'd4', to: 'v5', label: 'used', strength: 0.8 },
  { from: 'b5', to: 'v5', label: 'matched', strength: 0.82 },
  { from: 'u1', to: 'u4', label: 'supervises', strength: 0.7 },
  { from: 'u2', to: 'u3', label: 'collaborates', strength: 0.5 },
  { from: 'u5', to: 'u1', label: 'manages', strength: 0.85 }
]

function GlassCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] ${className}`}>
      {children}
    </div>
  )
}

function StatusBadge({ label, color }: { label: string; color: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium" style={{ backgroundColor: `${color}20`, color }}>
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
      {label}
    </span>
  )
}

export default function IdentityGraphPage() {
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  const getNode = useCallback((id: string) => graphNodes.find(n => n.id === id), [])

  const connectedNodes = useMemo(() => {
    if (!selectedNode) return new Set<string>()
    const connected = new Set<string>([selectedNode.id])
    graphEdges.forEach(e => {
      if (e.from === selectedNode.id) connected.add(e.to)
      if (e.to === selectedNode.id) connected.add(e.from)
    })
    return connected
  }, [selectedNode])

  const stats = useMemo(() => ({
    users: graphNodes.filter(n => n.type === 'user').length,
    devices: graphNodes.filter(n => n.type === 'device').length,
    biometrics: graphNodes.filter(n => n.type === 'biometric').length,
    verifications: graphNodes.filter(n => n.type === 'verification').length,
    edges: graphEdges.length
  }), [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0014] via-[#110025] to-[#0d001a] p-6 lg:p-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white tracking-tight">Identity Graph</h1>
          <p className="mt-1 text-sm text-white/50">Network visualization of identity relationships</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <div className="xl:col-span-3">
            <GlassCard className="p-4 overflow-hidden">
              <svg
                ref={svgRef}
                viewBox="0 0 1000 600"
                className="w-full h-auto"
                style={{ minHeight: '400px' }}
              >
                <defs>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                    <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                  <filter id="glow-strong">
                    <feGaussianBlur stdDeviation="8" result="coloredBlur" />
                    <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                </defs>

                {graphEdges.map((edge, i) => {
                  const from = getNode(edge.from)
                  const to = getNode(edge.to)
                  if (!from || !to) return null
                  const highlighted = selectedNode && (edge.from === selectedNode.id || edge.to === selectedNode.id)
                  const hovered = hoveredNode && (edge.from === hoveredNode || edge.to === hoveredNode)
                  return (
                    <motion.g key={`edge-${i}`}>
                      <motion.line
                        x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                        stroke={highlighted || hovered ? typeConfig[from.type].color : 'rgba(255,255,255,0.08)'}
                        strokeWidth={highlighted ? 2 : 1}
                        strokeDasharray={edge.label === 'supervises' || edge.label === 'manages' || edge.label === 'collaborates' ? '6 4' : 'none'}
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: highlighted || hovered ? 0.8 : 0.3 }}
                        transition={{ duration: 0.8, delay: i * 0.03 }}
                      />
                      {highlighted && (
                        <motion.text
                          x={(from.x + to.x) / 2} y={(from.y + to.y) / 2 - 6}
                          textAnchor="middle" fill={typeConfig[from.type].color}
                          fontSize="9" opacity="0.7"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 0.7 }}
                        >
                          {edge.label}
                        </motion.text>
                      )}
                    </motion.g>
                  )
                })}

                {graphNodes.map((node, i) => {
                  const config = typeConfig[node.type]
                  const isSelected = selectedNode?.id === node.id
                  const isHovered = hoveredNode === node.id
                  const isConnected = connectedNodes.has(node.id)
                  const dimmed = selectedNode && !isConnected
                  return (
                    <motion.g
                      key={node.id}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{
                        scale: 1,
                        opacity: dimmed ? 0.2 : 1
                      }}
                      transition={{ duration: 0.5, delay: i * 0.04, type: 'spring', stiffness: 200 }}
                      onClick={() => setSelectedNode(isSelected ? null : node)}
                      onMouseEnter={() => setHoveredNode(node.id)}
                      onMouseLeave={() => setHoveredNode(null)}
                      style={{ cursor: 'pointer' }}
                    >
                      <motion.circle
                        cx={node.x} cy={node.y}
                        r={config.radius + (isSelected ? 4 : isHovered ? 2 : 0)}
                        fill={config.fill}
                        stroke={config.color}
                        strokeWidth={isSelected ? 3 : isHovered ? 2 : 1}
                        filter={isSelected || isHovered ? 'url(#glow-strong)' : 'url(#glow)'}
                        whileHover={{ scale: 1.15 }}
                        animate={isSelected ? { scale: [1, 1.1, 1] } : {}}
                        transition={isSelected ? { duration: 1.5, repeat: Infinity, ease: 'easeInOut' } : {}}
                      />
                      {node.type === 'user' && (
                        <text x={node.x} y={node.y + 1} textAnchor="middle" dominantBaseline="middle" fill={config.color} fontSize="16" fontWeight="bold">
                          {node.label.split(' ').map(n => n[0]).join('')}
                        </text>
                      )}
                      {node.type === 'device' && (
                        <text x={node.x} y={node.y + 1} textAnchor="middle" dominantBaseline="middle" fill={config.color} fontSize="14">
                          &#128241;
                        </text>
                      )}
                      {node.type === 'biometric' && (
                        <text x={node.x} y={node.y + 1} textAnchor="middle" dominantBaseline="middle" fill={config.color} fontSize="12" fontWeight="bold">
                          &#10003;
                        </text>
                      )}
                      {node.type === 'verification' && (
                        <text x={node.x} y={node.y + 1} textAnchor="middle" dominantBaseline="middle" fill={config.color} fontSize="12" fontWeight="bold">
                          {node.metadata.result === 'Failed' ? '&#10007;' : '&#10003;'}
                        </text>
                      )}
                      <text x={node.x} y={node.y + config.radius + 14} textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="10" fontWeight="500">
                        {node.label}
                      </text>
                    </motion.g>
                  )
                })}

                <motion.circle cx="50" cy="560" r="6" fill="rgba(168,85,247,0.25)" stroke="#a855f7" strokeWidth="1" />
                <text x="64" y="564" fill="rgba(255,255,255,0.4)" fontSize="10">User</text>
                <motion.circle cx="110" cy="560" r="5" fill="rgba(59,130,246,0.25)" stroke="#3b82f6" strokeWidth="1" />
                <text x="123" y="564" fill="rgba(255,255,255,0.4)" fontSize="10">Device</text>
                <motion.circle cx="190" cy="560" r="5" fill="rgba(34,197,94,0.25)" stroke="#22c55e" strokeWidth="1" />
                <text x="203" y="564" fill="rgba(255,255,255,0.4)" fontSize="10">Biometric</text>
                <motion.circle cx="290" cy="560" r="4.5" fill="rgba(245,158,11,0.25)" stroke="#f59e0b" strokeWidth="1" />
                <text x="303" y="564" fill="rgba(255,255,255,0.4)" fontSize="10">Verification</text>
              </svg>
            </GlassCard>
          </div>

          <div className="xl:col-span-1 space-y-4">
            <GlassCard className="p-5">
              <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wider mb-4">Graph Statistics</h3>
              <div className="space-y-3">
                {[
                  { label: 'Users', value: stats.users, color: '#a855f7' },
                  { label: 'Devices', value: stats.devices, color: '#3b82f6' },
                  { label: 'Biometrics', value: stats.biometrics, color: '#22c55e' },
                  { label: 'Verifications', value: stats.verifications, color: '#f59e0b' },
                  { label: 'Connections', value: stats.edges, color: '#8b5cf6' }
                ].map(s => (
                  <div key={s.label} className="flex items-center justify-between py-2 border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
                      <span className="text-xs text-white/50">{s.label}</span>
                    </div>
                    <span className="text-sm font-bold text-white">{s.value}</span>
                  </div>
                ))}
              </div>
            </GlassCard>

            <AnimatePresence mode="wait">
              {selectedNode ? (
                <motion.div
                  key={selectedNode.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <GlassCard className="p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wider">Node Details</h3>
                      <button onClick={() => setSelectedNode(null)} className="text-white/30 hover:text-white/60 text-xs">Clear</button>
                    </div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-12 w-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: typeConfig[selectedNode.type].fill, border: `1px solid ${typeConfig[selectedNode.type].color}` }}>
                        <span className="text-lg font-bold" style={{ color: typeConfig[selectedNode.type].color }}>
                          {selectedNode.type === 'user' ? selectedNode.label.split(' ').map(n => n[0]).join('') : selectedNode.type === 'verification' ? '&#10003;' : selectedNode.type === 'biometric' ? '&#9679;' : '&#9743;'}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{selectedNode.label}</p>
                        <StatusBadge label={typeConfig[selectedNode.type].label} color={typeConfig[selectedNode.type].color} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      {Object.entries(selectedNode.metadata).map(([key, value]) => (
                        <div key={key} className="flex justify-between py-1.5 border-b border-white/5">
                          <span className="text-[11px] text-white/30 uppercase tracking-wider">{key}</span>
                          <span className="text-xs text-white/70 font-mono">{value}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4">
                      <p className="text-[11px] text-white/30 uppercase tracking-wider mb-2">Connections</p>
                      <div className="space-y-1">
                        {graphEdges.filter(e => e.from === selectedNode.id || e.to === selectedNode.id).map((e, i) => {
                          const otherId = e.from === selectedNode.id ? e.to : e.from
                          const other = getNode(otherId)
                          if (!other) return null
                          return (
                            <div key={i} className="flex items-center gap-2 py-1 text-xs text-white/50">
                              <span className="h-1 w-1 rounded-full" style={{ backgroundColor: typeConfig[other.type].color }} />
                              <span>{other.label}</span>
                              <span className="text-white/20 ml-auto">{e.label}</span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <GlassCard className="p-8 text-center">
                    <p className="text-sm text-white/30">Click a node to view details</p>
                  </GlassCard>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  )
}