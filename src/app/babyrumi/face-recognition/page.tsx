'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { ProgressRing } from '@/components/ui/progress-ring';
import { RealtimeChart } from '@/components/charts/realtime-chart';
import { ScanFace, Eye, Shield, Zap, AlertTriangle, CheckCircle2 } from 'lucide-react';

const LANDMARK_POINTS = [
  // Jawline
  { x: 250, y: 110 }, { x: 245, y: 120 }, { x: 240, y: 132 }, { x: 234, y: 144 },
  { x: 226, y: 155 }, { x: 216, y: 164 }, { x: 205, y: 172 }, { x: 193, y: 178 },
  { x: 180, y: 182 }, { x: 166, y: 184 }, { x: 153, y: 185 }, { x: 140, y: 183 },
  { x: 128, y: 178 }, { x: 118, y: 170 }, { x: 110, y: 160 }, { x: 104, y: 148 },
  { x: 100, y: 135 },
  // Right jawline mirror
  { x: 255, y: 120 }, { x: 260, y: 132 }, { x: 266, y: 144 },
  { x: 274, y: 155 }, { x: 284, y: 164 }, { x: 295, y: 172 }, { x: 307, y: 178 },
  { x: 320, y: 182 }, { x: 334, y: 184 }, { x: 347, y: 185 }, { x: 360, y: 183 },
  { x: 372, y: 178 }, { x: 382, y: 170 }, { x: 390, y: 160 }, { x: 396, y: 148 },
  { x: 400, y: 135 },
  // Left eyebrow
  { x: 152, y: 105 }, { x: 162, y: 98 }, { x: 175, y: 95 }, { x: 188, y: 98 },
  // Right eyebrow
  { x: 312, y: 98 }, { x: 325, y: 95 }, { x: 338, y: 98 }, { x: 348, y: 105 },
  // Nose bridge
  { x: 248, y: 120 }, { x: 250, y: 140 }, { x: 250, y: 160 }, { x: 250, y: 178 },
  // Nose bottom
  { x: 235, y: 185 }, { x: 242, y: 190 }, { x: 250, y: 193 }, { x: 258, y: 190 }, { x: 265, y: 185 },
  // Left eye
  { x: 185, y: 125 }, { x: 192, y: 120 }, { x: 200, y: 118 }, { x: 208, y: 120 },
  { x: 215, y: 125 }, { x: 208, y: 128 }, { x: 200, y: 130 }, { x: 192, y: 128 },
  // Right eye
  { x: 285, y: 125 }, { x: 292, y: 120 }, { x: 300, y: 118 }, { x: 308, y: 120 },
  { x: 315, y: 125 }, { x: 308, y: 128 }, { x: 300, y: 130 }, { x: 292, y: 128 },
  // Mouth
  { x: 215, y: 220 }, { x: 225, y: 218 }, { x: 235, y: 217 }, { x: 245, y: 218 },
  { x: 250, y: 220 }, { x: 255, y: 218 }, { x: 265, y: 217 }, { x: 275, y: 218 },
  { x: 285, y: 220 },
];

const FACE_OUTLINE = `M 250,80 C 200,80 140,110 110,160 C 90,195 95,250 130,280
  C 155,300 190,320 250,330 C 310,320 345,300 370,280 C 405,250 410,195 390,160
  C 360,110 300,80 250,80 Z`;

const scanLinePositions = [0, 80, 160, 240, 320];

function AnimatedCounter({ value, decimals = 0, suffix = '' }: { value: number; decimals?: number; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplay(value);
        clearInterval(timer);
      } else {
        setDisplay(current);
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [value]);
  return <span>{display.toFixed(decimals)}{suffix}</span>;
}

export default function FaceRecognitionPage() {
  const [scanActive, setScanActive] = useState(true);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [confidenceHistory, setConfidenceHistory] = useState<{ time: string; value: number }[]>([]);
  const [qualityDist, setQualityDist] = useState<number[]>([12, 28, 45, 38, 22, 8, 3]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFrame((p) => p + 1);
      setConfidenceHistory((prev) => {
        const next = [...prev, { time: new Date().toLocaleTimeString(), value: 88 + Math.random() * 12 }];
        return next.length > 50 ? next.slice(-50) : next;
      });
    }, 200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a12] text-white p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="relative">
            <ScanFace className="w-10 h-10 text-[#C44DFF]" />
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-[#C44DFF]/40"
              animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#C44DFF] via-[#8B5CF6] to-[#C44DFF] bg-clip-text text-transparent">
                Face Recognition Engine
              </h1>
              <motion.div
                className="h-[2px] w-32 bg-gradient-to-r from-[#C44DFF] to-transparent"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
            <p className="text-gray-400 text-sm mt-1">Real-time biometric analysis pipeline</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge label="Model: ArcFace v3.2" variant="success" />
          <StatusBadge label="Pipeline" variant="success" />
          <StatusBadge label="GPU: 87%" variant="warning" />
        </div>
      </motion.div>

      {/* Main Area */}
      <div className="grid grid-cols-[3fr_2fr] gap-6">
        {/* Left: Face Scanner Visualization */}
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-200 flex items-center gap-2">
                <Eye className="w-5 h-5 text-[#C44DFF]" />
                Live Face Scan
              </h2>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                FRAME {currentFrame} • 512×512 • RGB
              </div>
            </div>

            {/* SVG Face Visualization */}
            <div className="relative mx-auto" style={{ width: 500, height: 400 }}>
              <svg width="500" height="400" viewBox="0 0 500 400" className="rounded-xl overflow-hidden">
                <defs>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <filter id="strongGlow">
                    <feGaussianBlur stdDeviation="8" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <linearGradient id="scanGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#C44DFF" stopOpacity="0" />
                    <stop offset="50%" stopColor="#C44DFF" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#C44DFF" stopOpacity="0" />
                  </linearGradient>
                  <radialGradient id="faceGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#C44DFF" stopOpacity="0.08" />
                    <stop offset="100%" stopColor="#C44DFF" stopOpacity="0" />
                  </radialGradient>
                  <clipPath id="rectClip">
                    <rect x="90" y="60" width="320" height="290" rx="20" />
                  </clipPath>
                </defs>

                {/* Dark background */}
                <rect width="500" height="400" fill="#0d0d1a" rx="12" />

                {/* Grid lines */}
                {Array.from({ length: 11 }).map((_, i) => (
                  <g key={`grid-${i}`} opacity={0.06}>
                    <line x1={i * 50} y1="0" x2={i * 50} y2="400" stroke="#C44DFF" strokeWidth="0.5" />
                    <line x1="0" y1={i * 40} x2="500" y2={i * 40} stroke="#C44DFF" strokeWidth="0.5" />
                  </g>
                ))}

                {/* Face glow area */}
                <ellipse cx="250" cy="190" rx="150" ry="160" fill="url(#faceGlow)" />

                {/* Scan lines */}
                <g clipPath="url(#rectClip)">
                  {scanLinePositions.map((yBase, i) => (
                    <motion.rect
                      key={`scan-${i}`}
                      x="90"
                      width="320"
                      height="40"
                      fill="url(#scanGrad)"
                      initial={{ y: 60 }}
                      animate={{ y: [60, 350, 60] }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: i * 0.4,
                        ease: 'linear',
                      }}
                    />
                  ))}
                </g>

                {/* Bounding box */}
                <motion.rect
                  x="100" y="65" width="300" height="270" rx="16"
                  fill="none" stroke="#C44DFF" strokeWidth="1.5" strokeDasharray="8 4"
                  filter="url(#glow)"
                  animate={{ strokeDashoffset: [0, -48] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                />

                {/* Bounding box corners */}
                {[
                  { cx: 115, cy: 80, rot: 0 },
                  { cx: 385, cy: 80, rot: 90 },
                  { cx: 385, cy: 320, rot: 180 },
                  { cx: 115, cy: 320, rot: 270 },
                ].map((corner, i) => (
                  <motion.g
                    key={`corner-${i}`}
                    animate={{ opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
                  >
                    <motion.path
                      d={`M ${corner.cx - 12} ${corner.cy} L ${corner.cx - 12} ${corner.cy - 12} L ${corner.cx} ${corner.cy - 12}`}
                      fill="none" stroke="#C44DFF" strokeWidth="3" strokeLinecap="round"
                      filter="url(#strongGlow)"
                      transform={`rotate(${corner.rot} ${corner.cx} ${corner.cy})`}
                    />
                  </motion.g>
                ))}

                {/* Face oval outline */}
                <motion.path
                  d={FACE_OUTLINE}
                  fill="none"
                  stroke="#C44DFF"
                  strokeWidth="2"
                  filter="url(#glow)"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 2, ease: 'easeInOut' }}
                />

                {/* Landmark dots */}
                {LANDMARK_POINTS.map((pt, i) => (
                  <motion.circle
                    key={`lm-${i}`}
                    cx={pt.x} cy={pt.y} r={2.5}
                    fill="#C44DFF"
                    filter="url(#glow)"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{
                      scale: [1, 1.6, 1],
                      opacity: [0.7, 1, 0.7],
                    }}
                    transition={{
                      duration: 1.5 + Math.random(),
                      repeat: Infinity,
                      delay: i * 0.02 + Math.random() * 0.5,
                    }}
                  />
                ))}

                {/* Eyes highlight circles */}
                <motion.circle
                  cx="200" cy="124" r="14"
                  fill="none" stroke="#8B5CF6" strokeWidth="1"
                  animate={{ r: [14, 16, 14], opacity: [0.4, 0.8, 0.4] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                />
                <motion.circle
                  cx="300" cy="124" r="14"
                  fill="none" stroke="#8B5CF6" strokeWidth="1"
                  animate={{ r: [14, 16, 14], opacity: [0.4, 0.8, 0.4] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: 0.6 }}
                />

                {/* Crosshair */}
                <motion.line
                  x1="240" y1="190" x2="260" y2="190"
                  stroke="#C44DFF" strokeWidth="1" opacity={0.6}
                  animate={{ opacity: [0.3, 0.8, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                <motion.line
                  x1="250" y1="180" x2="250" y2="200"
                  stroke="#C44DFF" strokeWidth="1" opacity={0.6}
                  animate={{ opacity: [0.3, 0.8, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
                />
                <motion.circle
                  cx="250" cy="190" r="6"
                  fill="none" stroke="#C44DFF" strokeWidth="0.8"
                  animate={{ r: [6, 9, 6], opacity: [0.5, 0.9, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />

                {/* Status overlay bottom-left */}
                <rect x="14" y="360" width="140" height="28" rx="6" fill="#C44DFF" fillOpacity="0.15" />
                <circle cx="30" cy="374" r="4" fill="#22C55E" />
                <text x="42" y="378" fill="#22C55E" fontSize="11" fontFamily="monospace">
                  LOCKED • TRACKING
                </text>

                {/* Corner tech decorations */}
                <text x="14" y="24" fill="#C44DFF" fontSize="9" fontFamily="monospace" opacity="0.5">
                  ARC-FACE v3.2 | SECURE
                </text>
                <text x="340" y="24" fill="#C44DFF" fontSize="9" fontFamily="monospace" opacity="0.5">
                  RES: 512×512
                </text>
              </svg>
            </div>

            {/* Scores below visualization */}
            <div className="grid grid-cols-3 gap-6 mt-6">
              {[
                { label: 'Confidence', value: 98.7, color: '#22C55E', icon: CheckCircle2 },
                { label: 'Quality Score', value: 94.2, color: '#8B5CF6', icon: Eye },
                { label: 'Deepfake Score', value: 3.2, color: '#22C55E', suffix: '%', icon: Shield },
              ].map((item) => (
                <motion.div
                  key={item.label}
                  className="text-center p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <item.icon className="w-5 h-5 mx-auto mb-2" style={{ color: item.color }} />
                  <div className="text-2xl font-bold" style={{ color: item.color }}>
                    <AnimatedCounter
                      value={item.value}
                      decimals={item.suffix ? 1 : 1}
                      suffix={item.suffix || '%'}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{item.label}</div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Right: Metrics Panel */}
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
          <GlassCard className="p-6 space-y-5">
            <h2 className="text-lg font-semibold text-gray-200 flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#C44DFF]" />
              Analysis Metrics
            </h2>

            {/* Face Quality */}
            <motion.div className="flex items-center gap-4 p-3 rounded-lg bg-white/[0.03]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
              <ProgressRing value={94.2} size={60} color="#8B5CF6" />
              <div>
                <div className="text-sm font-medium text-gray-300">Face Quality</div>
                <div className="text-xs text-gray-500">Sharpness, contrast, exposure</div>
              </div>
            </motion.div>

            {/* Pose Estimation */}
            <motion.div className="p-3 rounded-lg bg-white/[0.03]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              <div className="text-sm font-medium text-gray-300 mb-3">Pose Estimation</div>
              {[
                { label: 'Yaw', value: 2.3, max: 10, color: '#8B5CF6' },
                { label: 'Pitch', value: -1.1, max: 10, color: '#A78BFA' },
                { label: 'Roll', value: 0.8, max: 10, color: '#C44DFF' },
              ].map((pose) => (
                <div key={pose.label} className="flex items-center gap-3 mb-2">
                  <span className="text-xs text-gray-500 w-10">{pose.label}</span>
                  <div className="flex-1 h-2 rounded-full bg-white/[0.06] overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: pose.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${(Math.abs(pose.value) / pose.max) * 100}%` }}
                      transition={{ duration: 1.2, delay: 0.6 }}
                    />
                  </div>
                  <span className="text-xs font-mono text-gray-400 w-12 text-right">{pose.value}°</span>
                </div>
              ))}
            </motion.div>

            {/* Grid of Progress Rings */}
            {[
              { label: 'Lighting Score', value: 87.5, color: '#8B5CF6' },
              { label: 'Occlusion', value: 3.2, max: 100, color: '#22C55E' },
              { label: 'Deepfake Score', value: 97.0, color: '#22C55E', subtitle: 'Authentic' },
              { label: 'Liveness Score', value: 99.1, color: '#22C55E' },
              { label: 'Similarity Score', value: 97.8, color: '#22C55E' },
            ].map((metric, i) => (
              <motion.div
                key={metric.label}
                className="flex items-center gap-4 p-3 rounded-lg bg-white/[0.03]"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
              >
                <ProgressRing
                  value={metric.value}
                  size={50}
                  color={metric.color}
                />
                <div>
                  <div className="text-sm font-medium text-gray-300">{metric.label}</div>
                  <div className="text-xs text-gray-500">{metric.subtitle || `Score: ${metric.value}`}</div>
                </div>
              </motion.div>
            ))}

            {/* Security badges */}
            <motion.div
              className="flex flex-wrap gap-2 pt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              {['Liveness Verified', 'Anti-Spoof', 'Template Matched'].map((badge) => (
                <span
                  key={badge}
                  className="px-3 py-1 text-xs rounded-full bg-green-500/10 text-green-400 border border-green-500/20"
                >
                  ✓ {badge}
                </span>
              ))}
            </motion.div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-2 gap-6">
        {/* Confidence Over Time */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <GlassCard className="p-6">
            <h3 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
              <motion.div
                className="w-2 h-2 rounded-full bg-[#C44DFF]"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              Detection Confidence — Real-time
            </h3>
            <RealtimeChart
              data={confidenceHistory}
              color="#C44DFF"
              height={160}
            />
          </GlassCard>
        </motion.div>

        {/* Quality Distribution */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
          <GlassCard className="p-6">
            <h3 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#8B5CF6]" />
              Recent Scan Quality Distribution
            </h3>
            <div className="flex items-end gap-2 h-[160px] px-2">
              {qualityDist.map((val, i) => {
                const colors = ['#7C3AED', '#8B5CF6', '#A78BFA', '#C44DFF', '#DDD6FE', '#EDE9FE', '#F5F3FF'];
                const labels = ['Poor', 'Low', 'Fair', 'Good', 'Very Good', 'Excellent', 'Perfect'];
                return (
                  <motion.div
                    key={i}
                    className="flex-1 flex flex-col items-center gap-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 + i * 0.08 }}
                  >
                    <span className="text-[10px] text-gray-500 font-mono">{val}</span>
                    <motion.div
                      className="w-full rounded-t-md"
                      style={{ backgroundColor: colors[i] }}
                      initial={{ height: 0 }}
                      animate={{ height: `${(val / 50) * 120}px` }}
                      transition={{ duration: 0.8, delay: 0.8 + i * 0.08 }}
                    />
                    <span className="text-[9px] text-gray-600 mt-1">{labels[i]}</span>
                  </motion.div>
                );
              })}
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
