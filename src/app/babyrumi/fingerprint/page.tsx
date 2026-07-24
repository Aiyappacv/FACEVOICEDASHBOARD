'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { ProgressRing } from '@/components/ui/progress-ring';
import { RealtimeChart } from '@/components/charts/realtime-chart';
import { cn } from '@/lib/utils';
import {
  Fingerprint,
  Shield,
  Zap,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

const FINGERPRINT_PATHS = [
  'M 120 380 Q 100 340 110 300 Q 125 260 140 240 Q 160 210 180 190 Q 200 170 220 160 Q 240 150 260 148 Q 280 146 300 150 Q 320 156 335 170 Q 350 190 358 215 Q 365 245 362 280 Q 358 320 345 355 Q 330 380 310 395',
  'M 130 370 Q 115 330 120 290 Q 130 255 145 230 Q 165 205 185 185 Q 205 168 225 158 Q 245 148 265 145 Q 285 143 305 148 Q 325 155 340 170 Q 355 190 362 218 Q 370 250 368 288 Q 362 325 348 358 Q 335 378 315 390',
  'M 140 360 Q 128 325 132 285 Q 140 250 155 225 Q 172 202 192 183 Q 212 166 232 155 Q 252 145 272 142 Q 292 140 312 145 Q 332 152 348 168 Q 362 188 370 215 Q 375 248 372 285 Q 365 322 352 352 Q 340 372 322 385',
  'M 150 348 Q 140 318 142 280 Q 150 248 162 222 Q 178 200 198 180 Q 218 163 238 152 Q 258 142 278 138 Q 298 136 318 140 Q 338 148 355 165 Q 370 185 378 212 Q 382 245 378 282 Q 372 318 358 348 Q 345 365 328 378',
  'M 162 335 Q 152 308 155 275 Q 162 245 175 220 Q 190 198 210 178 Q 230 160 250 148 Q 270 138 290 135 Q 310 133 330 138 Q 348 145 365 162 Q 380 182 388 210 Q 392 242 388 280 Q 382 315 368 342 Q 355 358 338 370',
  'M 175 322 Q 165 298 168 268 Q 175 240 188 218 Q 204 196 224 176 Q 244 158 264 148 Q 284 138 304 134 Q 324 132 342 138 Q 360 145 375 162 Q 390 182 398 210 Q 402 242 398 278 Q 392 312 378 338 Q 365 352 348 362',
  'M 188 310 Q 180 288 182 260 Q 188 235 200 215 Q 215 195 235 176 Q 255 158 275 148 Q 295 140 315 136 Q 335 134 352 140 Q 370 148 385 165 Q 400 185 408 212 Q 412 244 408 278 Q 400 308 386 332 Q 374 345 358 355',
  'M 200 298 Q 192 278 195 252 Q 202 230 214 212 Q 228 194 248 176 Q 268 160 288 150 Q 308 142 328 138 Q 348 136 365 142 Q 382 150 398 168 Q 412 188 418 215 Q 422 246 418 278 Q 410 305 396 328 Q 384 340 368 350',
  'M 212 286 Q 205 268 208 244 Q 214 225 226 208 Q 240 192 260 175 Q 280 160 300 152 Q 320 145 340 142 Q 358 140 375 148 Q 392 158 406 176 Q 420 198 426 225 Q 428 256 424 285 Q 418 308 404 328 Q 392 340 378 348',
  'M 225 275 Q 218 258 220 236 Q 226 220 238 204 Q 252 190 272 174 Q 292 160 312 153 Q 332 147 350 145 Q 368 144 385 152 Q 402 162 416 180 Q 428 200 434 228 Q 436 258 430 286 Q 424 306 412 324 Q 400 336 388 344',
  'M 238 265 Q 232 250 234 230 Q 240 215 250 200 Q 264 188 284 174 Q 304 162 324 156 Q 342 152 360 150 Q 378 150 395 158 Q 410 168 424 186 Q 436 206 440 232 Q 442 260 436 286 Q 428 305 418 320 Q 406 332 395 340',
  'M 250 255 Q 244 242 246 224 Q 252 210 262 198 Q 274 186 294 174 Q 314 164 334 158 Q 352 155 370 154 Q 388 155 404 164 Q 418 175 430 194 Q 442 216 444 242 Q 444 268 436 290 Q 428 306 418 318 Q 408 328 398 335',
  'M 262 246 Q 258 235 260 220 Q 264 208 274 196 Q 286 186 306 176 Q 326 168 344 163 Q 362 160 378 160 Q 396 162 410 172 Q 424 184 436 204 Q 446 226 448 250 Q 446 272 438 290 Q 430 304 420 314 Q 410 322 400 328',
  'M 275 238 Q 270 228 272 216 Q 278 205 288 194 Q 300 185 318 178 Q 336 172 354 168 Q 370 166 388 168 Q 404 172 418 182 Q 430 196 440 216 Q 448 238 448 260 Q 444 278 436 294 Q 428 306 418 314 Q 408 320 398 325',
  'M 288 230 Q 284 222 286 212 Q 290 202 300 192 Q 312 184 330 178 Q 348 174 366 172 Q 382 172 398 176 Q 414 184 426 198 Q 438 214 444 236 Q 446 256 442 274 Q 434 290 424 302 Q 414 310 404 316',
  'M 300 224 Q 296 218 298 210 Q 304 202 312 194 Q 324 188 342 184 Q 358 182 376 182 Q 392 184 406 192 Q 420 202 430 218 Q 440 236 442 254 Q 440 272 432 286 Q 422 298 412 306 Q 402 312 392 316',
  'M 312 220 Q 308 214 310 208 Q 316 200 324 194 Q 334 188 352 186 Q 368 186 384 188 Q 400 192 412 202 Q 424 214 432 230 Q 438 248 436 266 Q 430 280 422 292 Q 412 302 402 308',
  'M 324 218 Q 322 214 324 208 Q 330 202 338 198 Q 348 194 364 194 Q 380 194 394 200 Q 406 208 416 220 Q 424 236 428 252 Q 426 268 420 282 Q 412 292 402 300',
];

const MINUTIAE_POINTS = [
  { x: 180, y: 200, type: 'ridge_ending' },
  { x: 220, y: 175, type: 'bifurcation' },
  { x: 260, y: 160, type: 'dot' },
  { x: 300, y: 155, type: 'ridge_ending' },
  { x: 340, y: 165, type: 'bifurcation' },
  { x: 160, y: 260, type: 'dot' },
  { x: 200, y: 240, type: 'ridge_ending' },
  { x: 250, y: 220, type: 'bifurcation' },
  { x: 290, y: 210, type: 'dot' },
  { x: 330, y: 215, type: 'ridge_ending' },
  { x: 370, y: 230, type: 'bifurcation' },
  { x: 150, y: 310, type: 'dot' },
  { x: 190, y: 290, type: 'ridge_ending' },
  { x: 240, y: 270, type: 'bifurcation' },
  { x: 280, y: 260, type: 'dot' },
  { x: 320, y: 265, type: 'ridge_ending' },
  { x: 360, y: 275, type: 'bifurcation' },
  { x: 170, y: 345, type: 'dot' },
  { x: 210, y: 325, type: 'ridge_ending' },
  { x: 260, y: 310, type: 'bifurcation' },
  { x: 300, y: 305, type: 'dot' },
  { x: 340, y: 315, type: 'ridge_ending' },
  { x: 380, y: 330, type: 'bifurcation' },
  { x: 220, y: 355, type: 'dot' },
  { x: 310, y: 350, type: 'ridge_ending' },
];

const MINUTIAE_COLORS = {
  ridge_ending: '#4D9EFF',
  bifurcation: '#FF6EB4',
  dot: '#4DFF88',
};

function QualityHeatmap() {
  const grid = Array.from({ length: 10 }, () =>
    Array.from({ length: 10 }, () => Math.random())
  );

  const getColor = (v: number) => {
    if (v > 0.8) return 'bg-emerald-400/80';
    if (v > 0.6) return 'bg-emerald-500/60';
    if (v > 0.4) return 'bg-yellow-400/60';
    if (v > 0.2) return 'bg-orange-400/60';
    return 'bg-red-400/60';
  };

  return (
    <div className="grid grid-cols-10 gap-[2px]">
      {grid.flat().map((v, i) => (
        <motion.div
          key={i}
          className={cn('aspect-square rounded-[2px]', getColor(v))}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.008, duration: 0.3 }}
        />
      ))}
    </div>
  );
}

export default function FingerprintPage() {
  const [scanState, setScanState] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [matchHistory, setMatchHistory] = useState<{ time: string; value: number }[]>([]);

  const scanLabels = [
    'Scanning minutiae points...',
    'Analyzing ridge patterns...',
    'Matching bifurcations...',
    'Computing template hash...',
    'Verifying identity...',
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setMatchHistory((prev) => {
        const next = [...prev, { time: new Date().toLocaleTimeString(), value: 85 + Math.random() * 15 }];
        return next.length > 50 ? next.slice(-50) : next;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setScanState((prev) => (prev + 1) % scanLabels.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a1a] via-[#0d0d24] to-[#0a0a1a] p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-[1600px] space-y-6"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/20 ring-1 ring-purple-500/30">
              <Fingerprint className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">
                Fingerprint Analysis Engine
              </h1>
              <p className="text-sm text-gray-400">
                Biometric minutiae extraction & matching
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge
              label="Model: CNN Minutiae v3.0"
              variant="purple"
            />
            <StatusBadge
              label="Quality: A+"
              variant="success"
            />
            <StatusBadge
              label="Template: ISO 19794-2"
              variant="info"
            />
          </div>
        </motion.div>

        {/* Main Area */}
        <div className="grid gap-6 lg:grid-cols-[55%_45%]">
          {/* Left - Fingerprint Visualization */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <GlassCard className="relative overflow-hidden p-0">
              <div className="relative flex items-center justify-center bg-[#08081a]/80" style={{ height: 450, minHeight: 400 }}>
                <svg
                  viewBox="0 0 500 450"
                  className="h-full w-full"
                  style={{ maxWidth: 500 }}
                >
                  <defs>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                    <filter id="scanGlow">
                      <feGaussianBlur stdDeviation="6" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                    <linearGradient id="scanGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#C44DFF" stopOpacity="0" />
                      <stop offset="30%" stopColor="#C44DFF" stopOpacity="0.6" />
                      <stop offset="50%" stopColor="#C44DFF" stopOpacity="1" />
                      <stop offset="70%" stopColor="#C44DFF" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="#C44DFF" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* Fingerprint paths */}
                  {FINGERPRINT_PATHS.map((d, i) => (
                    <motion.path
                      key={i}
                      d={d}
                      fill="none"
                      stroke="#C44DFF"
                      strokeWidth={1.5}
                      strokeLinecap="round"
                      filter="url(#glow)"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={mounted ? { pathLength: 1, opacity: 0.7 + (i % 3) * 0.1 } : {}}
                      transition={{
                        pathLength: { duration: 1.8, delay: i * 0.06, ease: 'easeInOut' },
                        opacity: { duration: 0.5, delay: i * 0.06 },
                      }}
                    />
                  ))}

                  {/* Scan line */}
                  {mounted && (
                    <motion.line
                      x1="110"
                      x2="440"
                      stroke="url(#scanGrad)"
                      strokeWidth="2"
                      filter="url(#scanGlow)"
                      initial={{ y1: 140, y2: 140 }}
                      animate={{ y1: [140, 400, 140], y2: [140, 400, 140] }}
                      transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                    />
                  )}

                  {/* Bounding rectangle */}
                  <motion.rect
                    x="130"
                    y="130"
                    width="260"
                    height="260"
                    rx="8"
                    fill="none"
                    stroke="#C44DFF"
                    strokeWidth="1"
                    strokeDasharray="8 4"
                    opacity="0.4"
                    initial={{ opacity: 0 }}
                    animate={mounted ? { opacity: 0.4 } : {}}
                    transition={{ delay: 1.2, duration: 0.5 }}
                  />

                  {/* Corner indicators */}
                  {[
                    { x: 126, y: 126, rotate: 0 },
                    { x: 386, y: 126, rotate: 90 },
                    { x: 386, y: 386, rotate: 180 },
                    { x: 126, y: 386, rotate: 270 },
                  ].map((corner, i) => (
                    <motion.g
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={mounted ? { opacity: 1, scale: 1 } : {}}
                      transition={{ delay: 1.4 + i * 0.1, duration: 0.3 }}
                    >
                      <line
                        x1={corner.x}
                        y1={corner.y}
                        x2={corner.x + (corner.rotate === 90 || corner.rotate === 180 ? -16 : 16)}
                        y2={corner.y}
                        stroke="#C44DFF"
                        strokeWidth="2"
                        opacity="0.8"
                      />
                      <line
                        x1={corner.x}
                        y1={corner.y}
                        x2={corner.x}
                        y2={corner.y + (corner.rotate === 180 || corner.rotate === 270 ? -16 : 16)}
                        stroke="#C44DFF"
                        strokeWidth="2"
                        opacity="0.8"
                      />
                    </motion.g>
                  ))}

                  {/* Minutiae points */}
                  {MINUTIAE_POINTS.map((point, i) => (
                    <motion.g key={i}>
                      <motion.circle
                        cx={point.x}
                        cy={point.y}
                        r={3}
                        fill={MINUTIAE_COLORS[point.type as keyof typeof MINUTIAE_COLORS]}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={mounted ? { opacity: 1, scale: [1, 1.3, 1] } : {}}
                        transition={{
                          opacity: { delay: 1.6 + i * 0.04, duration: 0.3 },
                          scale: {
                            delay: 2 + i * 0.04,
                            duration: 1.8,
                            repeat: Infinity,
                            ease: 'easeInOut',
                          },
                        }}
                      />
                      <motion.circle
                        cx={point.x}
                        cy={point.y}
                        r={6}
                        fill="none"
                        stroke={MINUTIAE_COLORS[point.type as keyof typeof MINUTIAE_COLORS]}
                        strokeWidth="0.5"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={mounted ? { opacity: [0, 0.5, 0], scale: [0.8, 2, 0.8] } : {}}
                        transition={{
                          delay: 2.2 + i * 0.04,
                          duration: 2.5,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                      />
                    </motion.g>
                  ))}
                </svg>

                {/* Scan state label */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={scanState}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center gap-2 rounded-full bg-purple-500/10 px-4 py-1.5 ring-1 ring-purple-500/20"
                    >
                      <motion.div
                        className="h-2 w-2 rounded-full bg-purple-400"
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ duration: 1.2, repeat: Infinity }}
                      />
                      <span className="text-xs font-medium text-purple-300">
                        {scanLabels[scanState]}
                      </span>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Legend */}
                <div className="absolute left-4 top-4 flex flex-col gap-1.5 rounded-lg bg-[#0a0a1a]/80 p-3 ring-1 ring-white/5">
                  {(
                    Object.entries(MINUTIAE_COLORS) as [
                      string,
                      string,
                    ][]
                  ).map(([label, color]) => (
                    <div key={label} className="flex items-center gap-2">
                      <div
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-[10px] capitalize text-gray-400">
                        {label.replace('_', ' ')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Right - Metrics */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            {/* Quality & Match Score row */}
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <GlassCard className="flex flex-col items-center gap-3 p-5">
                  <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
                    Quality Score
                  </span>
                  <ProgressRing value={92.4} size={100} strokeWidth={8} color="#4DFF88" />
                  <span className="text-lg font-bold text-white">92.4%</span>
                </GlassCard>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <GlassCard className="flex flex-col items-center gap-3 p-5">
                  <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
                    Match Score
                  </span>
                  <ProgressRing value={98.6} size={100} strokeWidth={8} color="#C44DFF" />
                  <span className="text-lg font-bold text-white">98.6%</span>
                </GlassCard>
              </motion.div>
            </div>

            {/* Minutiae Count - large display */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <GlassCard className="p-5">
                <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
                  Minutiae Detected
                </span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-5xl font-bold tabular-nums text-white">47</span>
                  <span className="text-sm text-gray-400">features extracted</span>
                </div>
                <div className="mt-3 flex gap-4">
                  <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-[#4D9EFF]" />
                    <span className="text-xs text-gray-400">18 ridges</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-[#FF6EB4]" />
                    <span className="text-xs text-gray-400">16 bifurcations</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-[#4DFF88]" />
                    <span className="text-xs text-gray-400">13 dots</span>
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            {/* Template & Size */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <GlassCard className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
                      Template Size
                    </span>
                    <p className="mt-1 text-2xl font-bold text-white">2.4 KB</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
                      Ridge Clarity
                    </span>
                    <div className="mt-1">
                      <ProgressRing value={88.7} size={56} strokeWidth={5} color="#4D9EFF" />
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            {/* Quality Heatmap */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <GlassCard className="p-5">
                <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
                  Quality Heatmap
                </span>
                <div className="mt-3">
                  <QualityHeatmap />
                </div>
                <div className="mt-2 flex items-center justify-between text-[10px] text-gray-500">
                  <span>Low quality</span>
                  <span>High quality</span>
                </div>
              </GlassCard>
            </motion.div>

            {/* Noise & Error Rates */}
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <GlassCard className="flex flex-col items-center gap-2 p-4">
                  <span className="text-[10px] font-medium uppercase tracking-wider text-gray-400">
                    Noise Level
                  </span>
                  <ProgressRing value={15.2} size={64} strokeWidth={5} color="#FFB347" />
                  <span className="text-sm font-bold text-white">15.2%</span>
                </GlassCard>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.85 }}
                className="flex flex-col gap-3"
              >
                <GlassCard className="flex items-center gap-3 p-4">
                  <AlertTriangle className="h-4 w-4 text-amber-400" />
                  <div>
                    <span className="text-[10px] font-medium uppercase tracking-wider text-gray-400">
                      FAR
                    </span>
                    <p className="text-sm font-bold text-white">0.001%</p>
                  </div>
                </GlassCard>
                <GlassCard className="flex items-center gap-3 p-4">
                  <AlertTriangle className="h-4 w-4 text-orange-400" />
                  <div>
                    <span className="text-[10px] font-medium uppercase tracking-wider text-gray-400">
                      FRR
                    </span>
                    <p className="text-sm font-bold text-white">0.01%</p>
                  </div>
                </GlassCard>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Bottom - Realtime Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
        >
          <GlassCard className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white">
                  Match Confidence Over Recent Scans
                </h3>
                <p className="text-xs text-gray-400">
                  Last 50 fingerprint scan attempts
                </p>
              </div>
              <StatusBadge
                label="Live"
                variant="success"
                pulse
              />
            </div>
            <RealtimeChart
              data={matchHistory}
              height={220}
              color="#C44DFF"
              title="Match %"
            />
          </GlassCard>
        </motion.div>
      </motion.div>
    </div>
  );
}
