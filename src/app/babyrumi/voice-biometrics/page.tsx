'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { GlassCard } from '@/components/ui/glass-card'
import { StatusBadge } from '@/components/ui/status-badge'
import { ProgressRing } from '@/components/ui/progress-ring'
import { RealtimeChart } from '@/components/charts/realtime-chart'
import { cn } from '@/lib/utils'
import {
  Mic,
  Volume2,
  Shield,
  Brain,
  AlertTriangle,
  CheckCircle2,
  Radio,
  Waves,
} from 'lucide-react'

const WAVEFORM_BARS = 100
const SPECTROGRAM_COLS = 50
const SPECTROGRAM_ROWS = 20
const FREQUENCY_BANDS = [
  { label: '63Hz', value: 78 },
  { label: '125Hz', value: 85 },
  { label: '250Hz', value: 72 },
  { label: '500Hz', value: 90 },
  { label: '1kHz', value: 88 },
  { label: '2kHz', value: 65 },
  { label: '4kHz', value: 42 },
  { label: '8kHz', value: 28 },
]

function generateInitialWaveform(): number[] {
  return Array.from({ length: WAVEFORM_BARS }, (_, i) => {
    const center = WAVEFORM_BARS / 2
    const dist = Math.abs(i - center) / center
    return Math.random() * 60 * (1 - dist * 0.6) + 10
  })
}

function generateSpectrogramCell(): number {
  return Math.random()
}

export default function VoiceBiometricsPage() {
  const [waveformHeights, setWaveformHeights] = useState<number[]>(() =>
    generateInitialWaveform()
  )
  const [spectrogram, setSpectrogram] = useState<number[][]>(() =>
    Array.from({ length: SPECTROGRAM_COLS }, () =>
      Array.from({ length: SPECTROGRAM_ROWS }, () => generateSpectrogramCell())
    )
  )
  const [confidenceHistory, setConfidenceHistory] = useState<{ time: string; value: number }[]>(() =>
    Array.from({ length: 60 }, (_, i) => ({ time: `${i}`, value: 90 + Math.random() * 8 }))
  )

  useEffect(() => {
    const interval = setInterval(() => {
      setWaveformHeights(
        Array.from({ length: WAVEFORM_BARS }, (_, i) => {
          const center = WAVEFORM_BARS / 2
          const dist = Math.abs(i - center) / center
          return Math.random() * 60 * (1 - dist * 0.6) + 10
        })
      )
    }, 100)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setSpectrogram((prev) => {
        const next = [...prev.slice(1)]
        next.push(
          Array.from({ length: SPECTROGRAM_ROWS }, () => generateSpectrogramCell())
        )
        return next
      })
    }, 200)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setConfidenceHistory((prev) => {
        const next = [...prev.slice(1)]
        next.push({ time: `${prev.length}`, value: 90 + Math.random() * 8 })
        return next
      })
    }, 500)
    return () => clearInterval(interval)
  }, [])

  const stagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.07 } },
  }
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <div className="min-h-screen bg-[#0a0a12] text-white p-6 lg:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="relative">
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <Waves className="h-9 w-9 text-purple-400" />
            </motion.div>
            <div className="absolute -inset-2 rounded-full bg-purple-500/10 blur-md" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-400 via-pink-400 to-purple-300 bg-clip-text text-transparent">
            Voice Biometrics Engine
          </h1>
        </div>
        <div className="flex flex-wrap gap-3">
          {[
            { label: 'Model', value: 'ECAPA-TDNN v2.1', icon: Brain },
            { label: 'Language', value: 'English', icon: Radio },
            { label: 'Sample Rate', value: '16kHz', icon: Volume2 },
          ].map((badge) => (
            <motion.div
              key={badge.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs font-medium text-white/70"
            >
              <badge.icon className="h-3.5 w-3.5 text-purple-400" />
              <span className="text-white/40">{badge.label}:</span>
              <span className="text-white/90">{badge.value}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Main Area */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 mb-6">
        {/* LEFT - Waveform Visualization */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="xl:col-span-3"
        >
          <GlassCard className="p-6 h-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">
                Audio Waveform
              </h2>
              <div className="flex items-center gap-2">
                <motion.div
                  className="w-2.5 h-2.5 rounded-full bg-red-500"
                  animate={{ opacity: [1, 0.3, 1], scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1.2 }}
                />
                <span className="text-xs font-bold text-red-400 tracking-widest">
                  LISTENING
                </span>
              </div>
            </div>

            {/* Waveform Canvas */}
            <div className="relative rounded-xl overflow-hidden bg-[#0d0d1a] border border-white/5 mb-4"
              style={{ height: 250 }}
            >
              <div className="absolute inset-0 flex items-end justify-center gap-[1px] px-4 pb-4 pt-6">
                {waveformHeights.map((h, i) => {
                  const center = WAVEFORM_BARS / 2
                  const dist = Math.abs(i - center) / center
                  const hue = 280 - dist * 40
                  const sat = 80 + dist * 20
                  return (
                    <motion.div
                      key={i}
                      className="rounded-t-sm flex-1 min-w-0"
                      animate={{ height: `${h}%` }}
                      transition={{ duration: 0.08, ease: 'easeOut' }}
                      style={{
                        background: `linear-gradient(to top, hsla(${hue}, ${sat}%, 65%, 0.9), hsla(${hue - 15}, ${sat}%, 75%, 0.5))`,
                        boxShadow: `0 0 8px hsla(${hue}, ${sat}%, 65%, 0.3)`,
                      }}
                    />
                  )
                })}
              </div>
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pink-500/40 to-transparent" />
            </div>

            {/* Spectrogram */}
            <div className="rounded-xl overflow-hidden bg-[#0d0d1a] border border-white/5 p-3">
              <p className="text-[10px] uppercase tracking-widest text-white/30 mb-2 font-semibold">
                Spectrogram
              </p>
              <div className="flex gap-[2px]" style={{ height: 120 }}>
                {spectrogram.map((col, ci) => (
                  <div key={ci} className="flex-1 flex flex-col-reverse gap-[1px]">
                    {col.map((intensity, ri) => {
                      const hue = 280 + ri * 2
                      const lightness = 20 + intensity * 45
                      const alpha = 0.3 + intensity * 0.7
                      return (
                        <motion.div
                          key={ri}
                          className="flex-1 rounded-[1px]"
                          animate={{ opacity: [alpha, alpha * 0.7, alpha] }}
                          transition={{
                            repeat: Infinity,
                            duration: 1.5 + Math.random(),
                            delay: Math.random() * 0.5,
                          }}
                          style={{
                            backgroundColor: `hsla(${hue}, 70%, ${lightness}%, ${alpha})`,
                          }}
                        />
                      )
                    })}
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-2 text-[9px] text-white/20">
                <span>0 Hz</span>
                <span>2 kHz</span>
                <span>4 kHz</span>
                <span>8 kHz</span>
              </div>
            </div>

            {/* Info Row */}
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="rounded-lg bg-white/[0.03] border border-white/5 p-3">
                <p className="text-[10px] uppercase tracking-widest text-white/30 mb-1">
                  Language Detected
                </p>
                <p className="text-sm font-semibold text-purple-300">English</p>
              </div>
              <div className="rounded-lg bg-white/[0.03] border border-white/5 p-3">
                <p className="text-[10px] uppercase tracking-widest text-white/30 mb-1">
                  Duration
                </p>
                <p className="text-sm font-semibold text-white/90">3.42s</p>
              </div>
              <div className="rounded-lg bg-white/[0.03] border border-white/5 p-3">
                <p className="text-[10px] uppercase tracking-widest text-white/30 mb-1">
                  Noise Level
                </p>
                <div className="flex gap-1 mt-1.5">
                  {Array.from({ length: 8 }, (_, i) => (
                    <div
                      key={i}
                      className={cn(
                        'h-3 flex-1 rounded-sm',
                        i < 2 ? 'bg-green-500/70' : i < 4 ? 'bg-yellow-500/30' : 'bg-white/10'
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* RIGHT - Voice Metrics Panel */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="xl:col-span-2"
        >
          <GlassCard className="p-6 h-full">
            <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-6">
              Voice Metrics
            </h2>

            <div className="space-y-5">
              {/* Speaker Confidence */}
              <motion.div variants={fadeUp} className="flex items-center gap-4">
                <ProgressRing value={96.4} size={56} strokeWidth={5} color="#C44DFF" />
                <div className="flex-1">
                  <p className="text-xs text-white/40 mb-0.5">Speaker Confidence</p>
                  <p className="text-lg font-bold text-purple-300">96.4%</p>
                </div>
                <CheckCircle2 className="h-4 w-4 text-green-400" />
              </motion.div>

              {/* Voiceprint Match */}
              <motion.div variants={fadeUp} className="flex items-center gap-4">
                <ProgressRing value={98.1} size={56} strokeWidth={5} color="#FF6AD5" />
                <div className="flex-1">
                  <p className="text-xs text-white/40 mb-0.5">Voiceprint Match</p>
                  <p className="text-lg font-bold text-pink-300">98.1%</p>
                </div>
                <CheckCircle2 className="h-4 w-4 text-green-400" />
              </motion.div>

              {/* Language Detection */}
              <motion.div variants={fadeUp} className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full border-2 border-purple-500/30 flex items-center justify-center">
                  <Radio className="h-5 w-5 text-purple-400" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-white/40 mb-1">Language Detection</p>
                  <StatusBadge variant="success" label="English" />
                </div>
              </motion.div>

              {/* Noise Level */}
              <motion.div variants={fadeUp} className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full border-2 border-green-500/30 flex items-center justify-center">
                  <Volume2 className="h-5 w-5 text-green-400" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-white/40 mb-1">Noise Level</p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-400"
                        initial={{ width: 0 }}
                        animate={{ width: '12.3%' }}
                        transition={{ duration: 1.2, delay: 0.4 }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-green-400">12.3%</span>
                  </div>
                </div>
              </motion.div>

              {/* Spoof Detection */}
              <motion.div variants={fadeUp} className="flex items-center gap-4">
                <ProgressRing value={97.8} size={56} strokeWidth={5} color="#22c55e" />
                <div className="flex-1">
                  <p className="text-xs text-white/40 mb-0.5">Spoof Detection</p>
                  <p className="text-lg font-bold text-green-300">97.8%</p>
                </div>
                <Shield className="h-4 w-4 text-green-400" />
              </motion.div>

              {/* Voice Clone Probability */}
              <motion.div variants={fadeUp} className="flex items-center gap-4">
                <ProgressRing value={3.2} size={56} strokeWidth={5} color="#22c55e" />
                <div className="flex-1">
                  <p className="text-xs text-white/40 mb-0.5">Voice Clone Probability</p>
                  <p className="text-lg font-bold text-green-300">3.2%</p>
                </div>
                <CheckCircle2 className="h-4 w-4 text-green-400" />
              </motion.div>

              {/* Replay Detection */}
              <motion.div variants={fadeUp} className="flex items-center gap-4">
                <ProgressRing value={99.1} size={56} strokeWidth={5} color="#22c55e" />
                <div className="flex-1">
                  <p className="text-xs text-white/40 mb-0.5">Replay Detection</p>
                  <p className="text-lg font-bold text-green-300">99.1%</p>
                </div>
                <CheckCircle2 className="h-4 w-4 text-green-400" />
              </motion.div>

              {/* Embedding Dimension */}
              <motion.div variants={fadeUp} className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full border-2 border-purple-500/30 flex items-center justify-center">
                  <Brain className="h-5 w-5 text-purple-400" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-white/40 mb-0.5">Embedding Dimension</p>
                  <p className="text-lg font-bold text-purple-300">192</p>
                </div>
              </motion.div>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Confidence Over Time */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <GlassCard className="p-6">
            <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">
              Voice Confidence Over Time
            </h2>
              <RealtimeChart
                data={confidenceHistory}
                color="#C44DFF"
                height={200}
                title="Confidence %"
              />
          </GlassCard>
        </motion.div>

        {/* Frequency Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <GlassCard className="p-6">
            <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">
              Frequency Distribution
            </h2>
            <div className="flex items-end justify-between gap-2" style={{ height: 200 }}>
              {FREQUENCY_BANDS.map((band, i) => (
                <div key={band.label} className="flex flex-col items-center flex-1 h-full justify-end">
                  <motion.div
                    className="w-full rounded-t-md"
                    style={{
                      background: `linear-gradient(to top, hsla(${280 - i * 8}, 70%, 60%, 0.8), hsla(${280 - i * 8}, 80%, 75%, 0.4))`,
                      boxShadow: `0 0 12px hsla(${280 - i * 8}, 70%, 60%, 0.2)`,
                    }}
                    initial={{ height: 0 }}
                    animate={{ height: `${band.value}%` }}
                    transition={{ duration: 0.8, delay: 0.5 + i * 0.08, ease: 'easeOut' }}
                  />
                  <p className="text-[10px] text-white/30 mt-2 font-medium">{band.label}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  )
}
