'use client';

import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useState, useEffect } from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { ProgressRing } from '@/components/ui/progress-ring';
import { RiskGauge } from '@/components/ui/risk-gauge';
import { RealtimeChart } from '@/components/charts/realtime-chart';
import { BiometricRadarChart } from '@/components/charts/radar-chart';
import { cn } from '@/lib/utils';
import {
  Shield,
  AlertTriangle,
  Globe,
  Smartphone,
  Clock,
  TrendingUp,
  MapPin,
  Activity,
} from 'lucide-react';

const riskFactors = [
  { label: 'Behavior Analysis', score: 28, level: 'Low', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', glow: false },
  { label: 'Geo Analysis', score: 41, level: 'Moderate', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', glow: true },
  { label: 'Device Trust', score: 87, level: 'High', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', glow: true },
  { label: 'Velocity', score: 22, level: 'Low', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', glow: false },
  { label: 'Impossible Travel', score: 12, level: 'None', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', glow: false },
];

const deviceInfo = {
  device: 'iPhone 15 Pro Max',
  trustScore: 87,
  lastSeen: '2 min ago',
  fingerprint: 'A7F3-B92C-D4E1',
  os: 'iOS 18.2',
  browser: 'Safari 18.2',
};

const geoInfo = {
  current: 'New York, US',
  history: ['London, UK', 'Paris, FR', 'Tokyo, JP'],
  impossible: false,
  riskZones: 0,
  lastCountry: 'United States',
};

const behaviorInfo = {
  deviationScore: 28,
  sessionRisk: 'Normal',
  avgSession: '12m 34s',
  clickPattern: 'Consistent',
  typingSpeed: '68 WPM',
};

const velocityInfo = {
  frequency: '14 req/min',
  accountAge: '847 days',
  velocityScore: 22,
  peakHour: '14:00 UTC',
  dailyAvg: '1,247 requests',
};

function RiskFactorBar({ factor, index }: { factor: typeof riskFactors[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.8 + index * 0.1, duration: 0.4 }}
      className={cn(
        'relative flex items-center justify-between rounded-lg border p-3',
        factor.bg,
        factor.border,
        factor.glow && 'shadow-[0_0_15px_-3px] shadow-current/20'
      )}
    >
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-white/70">{factor.label}</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="h-1.5 w-20 overflow-hidden rounded-full bg-white/10">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${factor.score}%` }}
            transition={{ delay: 1.0 + index * 0.1, duration: 0.8, ease: 'easeOut' }}
            className={cn('h-full rounded-full', {
              'bg-emerald-500': factor.level === 'Low' || factor.level === 'None',
              'bg-amber-500': factor.level === 'Moderate',
              'bg-red-500': factor.level === 'High',
            })}
          />
        </div>
        <span className={cn('w-8 text-right text-sm font-bold', factor.color)}>
          {factor.score}
        </span>
        <span className={cn(
          'w-16 text-right text-[10px] font-semibold uppercase tracking-wider',
          factor.color
        )}>
          {factor.level}
        </span>
      </div>
    </motion.div>
  );
}

function AnalysisPanel({
  title,
  icon: Icon,
  children,
  delay,
  glowColor,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  delay: number;
  glowColor?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className={cn(
        'rounded-xl border border-white/5 bg-white/[0.02] p-4 backdrop-blur-md',
        glowColor && `shadow-[0_0_20px_-5px] ${glowColor}`
      )}
    >
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/5">
          <Icon className="h-3.5 w-3.5 text-white/60" />
        </div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-white/50">
          {title}
        </h3>
      </div>
      <div className="space-y-2">{children}</div>
    </motion.div>
  );
}

function DataRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[11px] text-white/40">{label}</span>
      <span className={cn('text-xs font-medium', highlight ? 'text-amber-400' : 'text-white/80')}>
        {value}
      </span>
    </div>
  );
}

export default function RiskIntelligencePage() {
  const [mounted, setMounted] = useState(false);
  const [riskScore, setRiskScore] = useState(0);
  const needleProgress = useMotionValue(0);
  const needleRotation = useTransform(needleProgress, [0, 100], [-135, 135]);

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => {
      animate(needleProgress, 34, {
        duration: 2,
        ease: [0.16, 1, 0.3, 1],
      });
      setRiskScore(34);
    }, 500);
    return () => clearTimeout(timer);
  }, [needleProgress]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#06080f] p-6">
      <div className="mx-auto max-w-[1600px] space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/20">
              <Shield className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">
                Risk Intelligence Center
              </h1>
              <p className="text-sm text-white/40">
                Real-time threat analysis and behavioral scoring
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge variant="success" label="Risk Engine v4.2" />
            <StatusBadge variant="warning" label="Threat Level: MODERATE" />
          </div>
        </motion.div>

        {/* Main 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* LEFT: Large Risk Score Gauge (40%) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="lg:col-span-2"
          >
            <GlassCard className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-white/50">
                  Composite Risk Score
                </h2>
                <span className="text-[10px] text-white/30">LIVE</span>
              </div>

              {/* Risk Gauge */}
              <div className="flex justify-center py-4">
                <RiskGauge score={34} size={300} />
              </div>

              {/* Risk Factors Breakdown */}
              <div className="mt-6 space-y-2">
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/40">
                  Risk Factor Breakdown
                </h3>
                {riskFactors.map((factor, index) => (
                  <RiskFactorBar key={factor.label} factor={factor} index={index} />
                ))}
              </div>
            </GlassCard>
          </motion.div>

          {/* RIGHT: Risk Analysis Grid 2x2 (60%) */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Device Trust */}
            <AnalysisPanel
              title="Device Trust"
              icon={Smartphone}
              delay={0.4}
              glowColor="shadow-red-500/10"
            >
              <DataRow label="Device" value={deviceInfo.device} />
              <DataRow label="OS" value={deviceInfo.os} />
              <DataRow label="Browser" value={deviceInfo.browser} />
              <DataRow label="Trust Score" value={`${deviceInfo.trustScore}/100`} highlight />
              <DataRow label="Last Seen" value={deviceInfo.lastSeen} />
              <DataRow label="Fingerprint" value={deviceInfo.fingerprint} />
              <div className="mt-2 flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/20 p-2">
                <AlertTriangle className="h-3 w-3 text-red-400" />
                <span className="text-[10px] text-red-400 font-medium">
                  High risk device — unusual fingerprint pattern detected
                </span>
              </div>
            </AnalysisPanel>

            {/* Geo Analysis */}
            <AnalysisPanel
              title="Geo Analysis"
              icon={Globe}
              delay={0.5}
              glowColor="shadow-amber-500/10"
            >
              <DataRow label="Current Location" value={geoInfo.current} highlight />
              <DataRow label="Last Country" value={geoInfo.lastCountry} />
              <DataRow label="Risk Zones" value={`${geoInfo.riskZones}`} />
              <DataRow label="Impossible Travel" value={geoInfo.impossible ? 'Detected' : 'None'} />
              <div className="mt-2">
                <span className="text-[10px] text-white/30 uppercase tracking-wider">
                  Location History
                </span>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {geoInfo.history.map((loc) => (
                    <span
                      key={loc}
                      className="inline-flex items-center gap-1 rounded-md bg-white/5 border border-white/10 px-2 py-0.5 text-[10px] text-white/60"
                    >
                      <MapPin className="h-2.5 w-2.5" />
                      {loc}
                    </span>
                  ))}
                </div>
              </div>
            </AnalysisPanel>

            {/* Behavior Analysis */}
            <AnalysisPanel
              title="Behavior Analysis"
              icon={Activity}
              delay={0.6}
            >
              <DataRow label="Deviation Score" value={`${behaviorInfo.deviationScore}/100`} />
              <DataRow label="Session Risk" value={behaviorInfo.sessionRisk} />
              <DataRow label="Avg Session" value={behaviorInfo.avgSession} />
              <DataRow label="Click Pattern" value={behaviorInfo.clickPattern} />
              <DataRow label="Typing Speed" value={behaviorInfo.typingSpeed} />
              <div className="mt-2 h-8 w-full overflow-hidden rounded-lg bg-white/5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '28%' }}
                  transition={{ delay: 1.2, duration: 1, ease: 'easeOut' }}
                  className="h-full rounded-lg bg-gradient-to-r from-emerald-500/40 to-emerald-500/20"
                />
              </div>
            </AnalysisPanel>

            {/* Velocity Check */}
            <AnalysisPanel
              title="Velocity Check"
              icon={Clock}
              delay={0.7}
            >
              <DataRow label="Request Frequency" value={velocityInfo.frequency} />
              <DataRow label="Account Age" value={velocityInfo.accountAge} />
              <DataRow label="Velocity Score" value={`${velocityInfo.velocityScore}/100`} />
              <DataRow label="Peak Hour" value={velocityInfo.peakHour} />
              <DataRow label="Daily Average" value={velocityInfo.dailyAvg} />
              <div className="mt-2 flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-2">
                <TrendingUp className="h-3 w-3 text-emerald-400" />
                <span className="text-[10px] text-emerald-400 font-medium">
                  Velocity within normal parameters
                </span>
              </div>
            </AnalysisPanel>
          </div>
        </div>

        {/* Bottom Row: Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Realtime Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
          >
            <GlassCard className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-white/50">
                  Risk Scores Over Time
                </h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-amber-500" />
                    <span className="text-[10px] text-white/40">Composite</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-cyan-500" />
                    <span className="text-[10px] text-white/40">Behavioral</span>
                  </div>
                </div>
              </div>
              <RealtimeChart
                data={[
                  { time: '00:00', value: 32, value2: 28 },
                  { time: '04:00', value: 35, value2: 30 },
                  { time: '08:00', value: 38, value2: 32 },
                  { time: '12:00', value: 41, value2: 35 },
                  { time: '16:00', value: 37, value2: 29 },
                  { time: '20:00', value: 34, value2: 26 },
                  { time: 'Now', value: 34, value2: 28 },
                ]}
              />
            </GlassCard>
          </motion.div>

          {/* Radar Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.5 }}
          >
            <GlassCard className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-white/50">
                  Risk Dimension Analysis
                </h3>
                <StatusBadge variant="warning" label="Multi-dimensional" />
              </div>
              <BiometricRadarChart
                data={[
                  { subject: 'Behavior', value: 28 },
                  { subject: 'Geo', value: 41 },
                  { subject: 'Device', value: 87 },
                  { subject: 'Velocity', value: 22 },
                  { subject: 'Travel', value: 12 },
                  { subject: 'Pattern', value: 30 },
                ]}
              />
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
}