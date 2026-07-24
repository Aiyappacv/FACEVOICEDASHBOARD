'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { ProgressRing } from '@/components/ui/progress-ring';
import { BiometricRadarChart } from '@/components/charts/radar-chart';
import { RealtimeChart } from '@/components/charts/realtime-chart';
import { cn } from '@/lib/utils';
import {
  ScanFace,
  Mic,
  Fingerprint,
  Network,
  Brain,
  Shield,
  Zap,
  ArrowDown,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

const radarData = [
  { subject: 'Face', value: 97.8, fullMark: 100 },
  { subject: 'Voice', value: 96.4, fullMark: 100 },
  { subject: 'Fingerprint', value: 98.6, fullMark: 100 },
  { subject: 'Confidence', value: 99.7, fullMark: 100 },
  { subject: 'Speed', value: 92.1, fullMark: 100 },
  { subject: 'Security', value: 99.2, fullMark: 100 },
];

interface NetworkNode {
  id: string;
  label: string;
  sublabel?: string;
  icon?: React.ReactNode;
  row: number;
  col: number;
  width: number;
  height: number;
  glowColor: string;
  bgGradient: string;
  large?: boolean;
  final?: boolean;
}

const networkNodes: NetworkNode[] = [
  {
    id: 'face',
    label: 'Face Embedding',
    sublabel: '512D',
    icon: <ScanFace className="w-7 h-7" />,
    row: 0,
    col: 0,
    width: 140,
    height: 140,
    glowColor: 'rgba(168, 85, 247, 0.6)',
    bgGradient: 'from-purple-500/30 to-purple-700/10',
  },
  {
    id: 'voice',
    label: 'Voice Embedding',
    sublabel: '192D',
    icon: <Mic className="w-7 h-7" />,
    row: 0,
    col: 1,
    width: 140,
    height: 140,
    glowColor: 'rgba(236, 72, 153, 0.6)',
    bgGradient: 'from-pink-500/30 to-pink-700/10',
  },
  {
    id: 'fingerprint',
    label: 'Fingerprint Template',
    sublabel: '256D',
    icon: <Fingerprint className="w-7 h-7" />,
    row: 0,
    col: 2,
    width: 140,
    height: 140,
    glowColor: 'rgba(59, 130, 246, 0.6)',
    bgGradient: 'from-blue-500/30 to-blue-700/10',
  },
{
    id: 'embedding',
    label: 'Embedding Layer',
    icon: <Network className="w-5 h-5" />,
    row: 1,
    col: 1,
    width: 360,
    height: 72,
    glowColor: 'rgba(168, 85, 247, 0.3)',
    bgGradient: 'from-violet-500/20 to-indigo-600/10',
  },
  {
    id: 'feature-fusion',
    label: 'Feature Fusion',
    icon: <Zap className="w-5 h-5" />,
    row: 2,
    col: 1,
    width: 360,
    height: 72,
    glowColor: 'rgba(139, 92, 246, 0.3)',
    bgGradient: 'from-violet-500/20 to-purple-600/10',
  },
  {
    id: 'score-fusion',
    label: 'Score Fusion',
    icon: <Shield className="w-5 h-5" />,
    row: 3,
    col: 1,
    width: 360,
    height: 72,
    glowColor: 'rgba(99, 102, 241, 0.3)',
    bgGradient: 'from-indigo-500/20 to-blue-600/10',
  },
  {
    id: 'meta-classifier',
    label: 'AI Meta Classifier',
    icon: <Brain className="w-6 h-6" />,
    row: 4,
    col: 1,
    width: 360,
    height: 72,
    glowColor: 'rgba(168, 85, 247, 0.5)',
    bgGradient: 'from-purple-500/30 via-violet-500/20 to-fuchsia-600/10',
    large: true,
  },
  {
    id: 'risk-engine',
    label: 'Risk Engine',
    icon: <Shield className="w-5 h-5" />,
    row: 5,
    col: 1,
    width: 360,
    height: 72,
    glowColor: 'rgba(234, 179, 8, 0.3)',
    bgGradient: 'from-amber-500/20 to-orange-600/10',
  },
  {
    id: 'decision',
    label: 'Decision',
    icon: <CheckCircle2 className="w-6 h-6" />,
    row: 6,
    col: 1,
    width: 360,
    height: 72,
    glowColor: 'rgba(34, 197, 94, 0.4)',
    bgGradient: 'from-emerald-500/20 to-green-600/10',
    final: true,
  },
];

function FusionNetwork() {
  const [activeStage, setActiveStage] = useState(0);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const totalWidth = 700;
  const totalHeight = 1200;
  const colSpacing = 200;
  const rowSpacing = 130;
  const startY = 80;

  const getNodeCenter = (node: NetworkNode) => {
    let yOffset = 0;
    if (node.row === 1) yOffset = 25; // Extra gap below row 0 circles
    return {
      x: totalWidth / 2 + (node.col - 1) * colSpacing,
      y: startY + node.row * rowSpacing + node.height / 2 + yOffset,
    };
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStage((prev) => (prev + 1) % 8);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="relative w-full rounded-2xl border border-white/[0.06] bg-white/[0.02]"
      style={{ maxHeight: '1150px' }}
    >
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(168,85,247,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.3) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <svg
        viewBox={`0 0 ${totalWidth} ${totalHeight}`}
        className="relative w-full"
        style={{ maxHeight: '1150px' }}
        preserveAspectRatio="xMidYMin meet"
      >
        <defs>
          <linearGradient id="arrowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.5" />
          </linearGradient>
          <linearGradient id="faceGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="voiceGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ec4899" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#db2777" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="fingerprintGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#2563eb" stopOpacity="0.1" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glowStrong">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <clipPath id="glassClip">
            <rect rx="12" ry="12" width="100%" height="100%" />
          </clipPath>
        </defs>

        {/* Arrows from three input circles to embedding layer */}
        {(() => {
          const embeddingNode = networkNodes.find((n) => n.id === 'embedding')!;
          const ec = getNodeCenter(embeddingNode);
          const inputNodes = ['face', 'voice', 'fingerprint'].map((id) =>
            networkNodes.find((n) => n.id === id)!
          );
          return inputNodes.map((node, i) => {
            const nc = getNodeCenter(node);
            const x1 = nc.x;
            const y1 = nc.y + node.height / 2;
            const x2 = ec.x;
            const y2 = ec.y - embeddingNode.height / 2 - 2;
            const ctrlX = x1 + (x2 - x1) * 0.5;
            const ctrlY = y1 + (y2 - y1) * 0.5;
            const colors = ['#a855f7', '#ec4899', '#3b82f6'];
            return (
              <motion.g
                key={`input-arrow-${i}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
              >
                <path
                  d={`M ${x1} ${y1} Q ${ctrlX} ${ctrlY} ${x2} ${y2}`}
                  stroke={colors[i]}
                  strokeWidth={4}
                  strokeDasharray="10 6"
                  strokeLinecap="round"
                  fill="none"
                  opacity="0.9"
                  filter={`drop-shadow(0 0 6px ${colors[i]})`}
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    from="32"
                    to="0"
                    dur="0.8s"
                    repeatCount="indefinite"
                  />
                </path>
                <polygon
                  points={`${x2 - 8},${y2 - 12} ${x2 + 8},${y2 - 12} ${x2},${y2}`}
                  fill={colors[i]}
                  opacity="0.9"
                  filter={`drop-shadow(0 0 6px ${colors[i]})`}
                >
                  <animate
                    attributeName="opacity"
                    values="0.7;1;0.7"
                    dur="0.8s"
                    repeatCount="indefinite"
                  />
                </polygon>
              </motion.g>
            );
          });
        })()}

        {/* Vertical arrows between pipeline stages - centered for alignment */}
        {([
          ['embedding', 'feature-fusion', 0],
          ['feature-fusion', 'score-fusion', 0],
          ['score-fusion', 'meta-classifier', 0],
          ['meta-classifier', 'risk-engine', 0],
          ['risk-engine', 'decision', 0],
        ] as const).map(([fromId, toId, xOffset], i) => {
          const from = networkNodes.find((n) => n.id === fromId)!;
          const to = networkNodes.find((n) => n.id === toId)!;
          const fc = getNodeCenter(from);
          const tc = getNodeCenter(to);
          const x = (fc.x + tc.x) / 2 + xOffset;
          const y1 = fc.y + from.height / 2 + 4;
          const y2 = tc.y - to.height / 2 - 2;
          return (
            <motion.g
              key={`varrow-${i}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 + i * 0.1, duration: 0.5 }}
            >
              <path
                d={`M ${x} ${y1} L ${x} ${y2}`}
                stroke="#a855f7"
                strokeWidth={5}
                strokeDasharray="14 8"
                strokeLinecap="round"
                fill="none"
                opacity="1"
                filter="drop-shadow(0 0 6px #a855f7)"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  from="44"
                  to="0"
                  dur="0.8s"
                  repeatCount="indefinite"
                />
              </path>
              <polygon
                points={`${x - 10},${y2 - 14} ${x + 10},${y2 - 14} ${x},${y2}`}
                fill="#a855f7"
                opacity="1"
                filter="drop-shadow(0 0 8px #a855f7)"
              >
                <animate
                  attributeName="opacity"
                  values="0.8;1;0.8"
                  dur="0.8s"
                  repeatCount="indefinite"
                />
              </polygon>
            </motion.g>
          );
        })}

        {/* Decision output arrows - clean symmetrical branching */}
        {(() => {
          const decisionNode = networkNodes.find((n) => n.id === 'decision')!;
          const dc = getNodeCenter(decisionNode);
          
          // Configuration for clean layout
          const branchOffsetY = 50; // Distance from decision box to branch point
          const branchY = dc.y + decisionNode.height / 2 + branchOffsetY;
          const outcomeSpacing = 160; // Equal spacing between outcomes
          const outcomeY = branchY + 90; // Vertical distance from branch to outcomes
          const circleR = 20;
          
          const outcomes = [
            { label: 'ALLOW', color: '#22c55e', offsetX: -outcomeSpacing },
            { label: 'DENY', color: '#ef4444', offsetX: 0 },
            { label: 'STEP-UP', color: '#eab308', offsetX: outcomeSpacing },
          ];

          return (
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.0, duration: 0.6 }}
            >
              {/* Vertical trunk from decision box to branch point */}
              <path
                d={`M ${dc.x} ${dc.y + decisionNode.height / 2} L ${dc.x} ${branchY}`}
                stroke="#a855f7"
                strokeWidth={4}
                strokeDasharray="12 6"
                strokeLinecap="round"
                fill="none"
                opacity="0.9"
                filter="drop-shadow(0 0 8px #a855f7)"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  from="36"
                  to="0"
                  dur="0.8s"
                  repeatCount="indefinite"
                />
              </path>

              {/* Branch point indicator */}
              <circle
                cx={dc.x}
                cy={branchY}
                r={6}
                fill="#a855f7"
                opacity="0.9"
                filter="drop-shadow(0 0 8px #a855f7)"
              >
                <animate
                  attributeName="r"
                  values="6;9;6"
                  dur="1.5s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.7;1;0.7"
                  dur="1.5s"
                  repeatCount="indefinite"
                />
              </circle>

              {/* Horizontal branch bar */}
              <path
                d={`M ${dc.x - outcomeSpacing} ${branchY} L ${dc.x + outcomeSpacing} ${branchY}`}
                stroke="#a855f7"
                strokeWidth={3}
                strokeDasharray="8 4"
                strokeLinecap="round"
                fill="none"
                opacity="0.6"
                filter="drop-shadow(0 0 4px #a855f7)"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  from="24"
                  to="0"
                  dur="1s"
                  repeatCount="indefinite"
                />
              </path>

              {outcomes.map((o, i) => {
                const ox = dc.x + o.offsetX;
                const curveDepth = 35; // Control point depth for smooth curves
                
                // Smooth Bézier curve: vertical down from branch, then curve to outcome
                const pathD = `
                  M ${ox} ${branchY}
                  Q ${ox} ${branchY + curveDepth} ${ox} ${branchY + curveDepth * 2}
                  L ${ox} ${outcomeY - circleR - 10}
                `.trim();

                return (
                  <motion.g key={`outcome-${i}`}>
                    {/* Curved arrow path */}
                    <path
                      d={pathD}
                      stroke={o.color}
                      strokeWidth={4}
                      strokeDasharray="12 6"
                      strokeLinecap="round"
                      fill="none"
                      opacity="1"
                      filter={`drop-shadow(0 0 6px ${o.color})`}
                    >
                      <animate
                        attributeName="stroke-dashoffset"
                        from="36"
                        to="0"
                        dur="0.8s"
                        repeatCount="indefinite"
                      />
                    </path>

                    {/* Arrowhead at end of curve */}
                    <polygon
                      points={`${ox - 9},${outcomeY - circleR - 14} ${ox + 9},${outcomeY - circleR - 14} ${ox},${outcomeY - circleR - 4}`}
                      fill={o.color}
                      opacity="1"
                      filter={`drop-shadow(0 0 8px ${o.color})`}
                    >
                      <animate
                        attributeName="opacity"
                        values="0.8;1;0.8"
                        dur="0.8s"
                        repeatCount="indefinite"
                      />
                    </polygon>

                    {/* Outcome circle */}
                    <circle
                      cx={ox}
                      cy={outcomeY}
                      r={circleR}
                      fill={o.color}
                      opacity="0.2"
                      filter={`drop-shadow(0 0 12px ${o.color})`}
                    >
                      <animate
                        attributeName="opacity"
                        values="0.15;0.3;0.15"
                        dur="2s"
                        repeatCount="indefinite"
                      />
                    </circle>
                    <circle
                      cx={ox}
                      cy={outcomeY}
                      r={circleR - 2}
                      fill="none"
                      stroke={o.color}
                      strokeWidth={2}
                      opacity="0.6"
                    />

                    {/* Label below circle */}
                    <text
                      x={ox}
                      y={outcomeY + circleR + 20}
                      textAnchor="middle"
                      fill={o.color}
                      fontSize="11"
                      fontWeight="700"
                      fontFamily="monospace"
                      letterSpacing="0.5px"
                    >
                      {o.label}
                    </text>
                  </motion.g>
                );
              })}
            </motion.g>
          );
        })()}

        {/* Render nodes */}
        {networkNodes.map((node, i) => {
          const center = getNodeCenter(node);
          const isActive = i === activeStage;
          const isHovered = hoveredNode === node.id;

          if (node.row === 0) {
            return (
              <motion.g
                key={node.id}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + i * 0.15, duration: 0.6, type: 'spring' }}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                style={{ cursor: 'pointer' }}
              >
                <circle
                  cx={center.x}
                  cy={center.y}
                  r={node.width / 2 + (isHovered ? 6 : 0)}
                  fill="none"
                  stroke={node.glowColor}
                  strokeWidth={isHovered ? 2 : 1}
                  opacity={isHovered ? 0.8 : 0.3}
                  filter={isActive ? 'url(#glowStrong)' : 'url(#glow)'}
                >
                  {isActive && (
                    <animate
                      attributeName="r"
                      values={`${node.width / 2};${node.width / 2 + 10};${node.width / 2}`}
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  )}
                  {isActive && (
                    <animate
                      attributeName="opacity"
                      values="0.3;0.7;0.3"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  )}
                </circle>
                <circle
                  cx={center.x}
                  cy={center.y}
                  r={node.width / 2 - 2}
                  fill="rgba(10, 10, 30, 0.7)"
                  stroke={node.glowColor}
                  strokeWidth={1.5}
                  opacity={0.9}
                />
                <foreignObject
                  x={center.x - node.width / 2}
                  y={center.y - node.height / 2}
                  width={node.width}
                  height={node.height}
                >
                  <div className="flex h-full w-full flex-col items-center justify-center gap-1">
                    <div style={{ color: node.glowColor }} className="mb-1">
                      {node.icon}
                    </div>
                    <span className="text-[11px] font-semibold text-white/90 leading-tight text-center">
                      {node.label}
                    </span>
                    {node.sublabel && (
                      <span
                        className="text-[10px] font-mono font-bold"
                        style={{ color: node.glowColor }}
                      >
                        {node.sublabel}
                      </span>
                    )}
                  </div>
                </foreignObject>
              </motion.g>
            );
          }

          return (
            <motion.g
              key={node.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.12, duration: 0.5, type: 'spring' }}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              style={{ cursor: 'pointer' }}
            >
              {isActive && (
                <rect
                  x={center.x - node.width / 2 - 4}
                  y={center.y - node.height / 2 - 4}
                  width={node.width + 8}
                  height={node.height + 8}
                  rx={14}
                  fill="none"
                  stroke={node.glowColor}
                  strokeWidth={1.5}
                  opacity={0.4}
                  filter="url(#glow)"
                >
                  <animate
                    attributeName="opacity"
                    values="0.2;0.5;0.2"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </rect>
              )}
              <rect
                x={center.x - node.width / 2}
                y={center.y - node.height / 2}
                width={node.width}
                height={node.height}
                rx={12}
                fill="rgba(10, 10, 30, 0.65)"
                stroke={isHovered ? node.glowColor : 'rgba(255,255,255,0.08)'}
                strokeWidth={isHovered ? 1.5 : 1}
              />
              <foreignObject
                x={center.x - node.width / 2}
                y={center.y - node.height / 2}
                width={node.width}
                height={node.height}
              >
                <div className="flex h-full w-full items-center justify-center gap-2 px-3">
                  <div style={{ color: node.glowColor }}>{node.icon}</div>
                  <span
                    className={cn(
                      'font-semibold text-white/90 leading-tight',
                      node.large ? 'text-sm' : 'text-xs'
                    )}
                  >
                    {node.label}
                  </span>
                </div>
              </foreignObject>
            </motion.g>
          );
        })}
      </svg>
    </div>
  );
}

export default function FusionEnginePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#06060f] p-4 md:p-8">
      <div className="mx-auto max-w-[1800px] space-y-8">
        {/* ── Header ── */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
              <span className="bg-gradient-to-r from-purple-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                Multimodal Fusion Engine
              </span>
            </h1>
            <p className="mt-1 text-sm text-white/40">
              Biometric identity verification pipeline
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge variant="success" label="Meta-Classifier v5.0" />
            <StatusBadge variant="info" label="Accuracy: 99.7%" />
            <StatusBadge variant="neutral" label="Models: 3 Active" />
          </div>
        </motion.header>

        {/* ── AI Network Visualization ── */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <GlassCard className="p-4 md:p-6 min-h-[1070px]">
            <div className="mb-4 flex items-center gap-2">
              <Network className="h-4 w-4 text-purple-400" />
              <span className="text-xs font-semibold uppercase tracking-widest text-white/50">
                Fusion Pipeline — Live Network
              </span>
            </div>
            <FusionNetwork />
          </GlassCard>
        </motion.section>

        {/* ── Radar + Weight Config ── */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Radar Chart */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <GlassCard className="flex h-full flex-col p-6">
              <div className="mb-4 flex items-center gap-2">
                <Zap className="h-4 w-4 text-violet-400" />
                <span className="text-xs font-semibold uppercase tracking-widest text-white/50">
                  Biometric Score Radar
                </span>
              </div>
              <div className="flex flex-1 items-center justify-center">
                <BiometricRadarChart data={radarData} />
              </div>
            </GlassCard>
          </motion.div>

          {/* Weight Configuration */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <GlassCard className="flex h-full flex-col p-6">
              <div className="mb-5 flex items-center gap-2">
                <Brain className="h-4 w-4 text-fuchsia-400" />
                <span className="text-xs font-semibold uppercase tracking-widest text-white/50">
                  Weight Configuration
                </span>
              </div>

              <div className="space-y-5">
                {/* Sliders */}
                {[
                  { label: 'Face Weight', value: 0.4, color: '#a855f7', icon: <ScanFace className="h-3.5 w-3.5" /> },
                  { label: 'Voice Weight', value: 0.35, color: '#ec4899', icon: <Mic className="h-3.5 w-3.5" /> },
                  { label: 'Fingerprint Weight', value: 0.25, color: '#3b82f6', icon: <Fingerprint className="h-3.5 w-3.5" /> },
                ].map((w, i) => (
                  <div key={w.label}>
                    <div className="mb-1.5 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-white/70">
                        <span style={{ color: w.color }}>{w.icon}</span>
                        {w.label}
                      </div>
                      <span className="font-mono text-sm font-bold" style={{ color: w.color }}>
                        {w.value.toFixed(2)}
                      </span>
                    </div>
                    <div className="relative h-2 w-full overflow-hidden rounded-full bg-white/[0.06]">
                      <motion.div
                        className="absolute inset-y-0 left-0 rounded-full"
                        style={{ backgroundColor: w.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${w.value * 100}%` }}
                        transition={{ duration: 1, delay: 0.6 + i * 0.15, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                ))}

                <div className="flex items-center justify-between border-t border-white/[0.06] pt-4">
                  <span className="text-sm text-white/40">Total Weight</span>
                  <span className="font-mono text-lg font-bold text-white/90">1.00</span>
                </div>

                {/* Decision Logic */}
                <div className="mt-4 border-t border-white/[0.06] pt-5">
                  <span className="mb-3 block text-xs font-semibold uppercase tracking-widest text-white/40">
                    Decision Logic
                  </span>
                  <div className="space-y-2.5">
                    {[
                      {
                        label: 'Allow',
                        threshold: '≥ 0.95',
                        color: '#22c55e',
                        icon: <CheckCircle2 className="h-3.5 w-3.5" />,
                      },
                      {
                        label: 'Step-Up',
                        threshold: '0.80 – 0.95',
                        color: '#eab308',
                        icon: <AlertTriangle className="h-3.5 w-3.5" />,
                      },
                      {
                        label: 'Deny',
                        threshold: '< 0.80',
                        color: '#ef4444',
                        icon: <ArrowDown className="h-3.5 w-3.5 rotate-180" />,
                      },
                    ].map((d) => (
                      <div
                        key={d.label}
                        className="flex items-center justify-between rounded-lg border border-white/[0.04] bg-white/[0.02] px-3 py-2.5"
                      >
                        <div className="flex items-center gap-2">
                          <span style={{ color: d.color }}>{d.icon}</span>
                          <span className="text-sm font-medium text-white/80">{d.label}</span>
                        </div>
                        <span
                          className="font-mono text-xs font-bold"
                          style={{ color: d.color }}
                        >
                          {d.threshold}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* ── Realtime Fusion Score Chart ── */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <GlassCard className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <Fingerprint className="h-4 w-4 text-blue-400" />
              <span className="text-xs font-semibold uppercase tracking-widest text-white/50">
                Fusion Score Timeline
              </span>
            </div>
            <RealtimeChart data={[]} color="#3b82f6" height={200} />
          </GlassCard>
        </motion.section>
      </div>
    </div>
  );
}
