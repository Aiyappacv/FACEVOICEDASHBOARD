'use client';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { PipelineStage } from '@/types';
import {
  ScanFace,
  Mic,
  Fingerprint,
  Cpu,
  Network,
  ShieldAlert,
  Brain,
  FileCheck,
  ScrollText,
  CheckCircle2,
  AlertCircle,
  Clock,
} from 'lucide-react';

interface PipelineViewProps {
  stages: PipelineStage[];
  activeStage: number;
  className?: string;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  ScanFace,
  Mic,
  Fingerprint,
  Cpu,
  Network,
  ShieldAlert,
  Brain,
  FileCheck,
  ScrollText,
};

function getStageStatus(index: number, activeStage: number) {
  if (index < activeStage) return 'completed';
  if (index === activeStage) return 'active';
  return 'pending';
}

function StageIcon({ name, className }: { name: string; className?: string }) {
  const Icon = iconMap[name];
  return Icon ? <Icon className={className} /> : null;
}

function ConnectionLine({ status, index }: { status: string; index: number }) {
  return (
    <div className="relative flex h-8 w-16 items-center justify-center lg:w-24">
      <svg
        className="h-full w-full"
        viewBox="0 0 100 32"
        preserveAspectRatio="none"
        fill="none"
      >
        <defs>
          <linearGradient id={`lineGrad-${index}`} x1="0" y1="0" x2="1" y2="0">
            <stop
              offset="0%"
              stopColor={status === 'completed' ? '#C44DFF' : status === 'active' ? '#C44DFF' : '#ffffff'}
              stopOpacity={status === 'pending' ? 0.1 : 0.8}
            />
            <stop
              offset="100%"
              stopColor={status === 'completed' ? '#FF6AD5' : status === 'active' ? '#FF6AD5' : '#ffffff'}
              stopOpacity={status === 'pending' ? 0.1 : 0.8}
            />
          </linearGradient>
        </defs>
        <line
          x1="0"
          y1="16"
          x2="100"
          y2="16"
          stroke={`url(#lineGrad-${index})`}
          strokeWidth="2"
          strokeDasharray={status === 'pending' ? '4 4' : '0'}
          strokeLinecap="round"
        />
        {status !== 'pending' && (
          <line
            x1="0"
            y1="16"
            x2="100"
            y2="16"
            stroke={`url(#lineGrad-${index})`}
            strokeWidth="2"
            strokeDasharray="8 16"
            strokeLinecap="round"
            opacity="0.6"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="24"
              to="0"
              dur="1s"
              repeatCount="indefinite"
            />
          </line>
        )}
      </svg>
      {status === 'active' && (
        <motion.div
          className="absolute left-0 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-[#C44DFF]"
          animate={{ x: [0, 96] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
          style={{ boxShadow: '0 0 8px #C44DFF, 0 0 20px #C44DFF60' }}
        />
      )}
    </div>
  );
}

function StageBlock({
  stage,
  status,
  index,
}: {
  stage: PipelineStage;
  status: string;
  index: number;
}) {
  const statusConfig = {
    completed: {
      border: 'border-[#C44DFF]/40',
      bg: 'bg-[#C44DFF]/10',
      text: 'text-white',
      icon: 'text-[#C44DFF]',
      badge: <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />,
      glow: '0 0 20px rgba(196,77,255,0.15)',
    },
    active: {
      border: 'border-[#C44DFF]/70',
      bg: 'bg-[#C44DFF]/15',
      text: 'text-white',
      icon: 'text-[#C44DFF]',
      badge: <Clock className="h-3.5 w-3.5 text-[#C44DFF]" />,
      glow: '0 0 30px rgba(196,77,255,0.25), 0 0 60px rgba(196,77,255,0.1)',
    },
    pending: {
      border: 'border-white/[0.06]',
      bg: 'bg-white/[0.02]',
      text: 'text-white/30',
      icon: 'text-white/20',
      badge: null,
      glow: 'none',
    },
    error: {
      border: 'border-red-500/40',
      bg: 'bg-red-500/10',
      text: 'text-white',
      icon: 'text-red-400',
      badge: <AlertCircle className="h-3.5 w-3.5 text-red-400" />,
      glow: '0 0 20px rgba(239,68,68,0.15)',
    },
  };

  const cfg = statusConfig[status as keyof typeof statusConfig] ?? statusConfig.pending;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4, ease: 'easeOut' }}
      className="relative group"
    >
      <div
        className={cn(
          'flex w-28 flex-col items-center gap-2 rounded-xl border p-3 backdrop-blur-md transition-all duration-300 lg:w-36 lg:p-4',
          cfg.border,
          cfg.bg
        )}
        style={{ boxShadow: cfg.glow }}
      >
        {status === 'active' && (
          <motion.div
            className="absolute -inset-px rounded-xl border border-[#C44DFF]/30"
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}

        <div className="relative flex items-center justify-center">
          <StageIcon name={stage.icon} className={cn('h-5 w-5 lg:h-6 lg:w-6', cfg.icon)} />
          {cfg.badge && <span className="absolute -right-2 -top-2">{cfg.badge}</span>}
        </div>

        <span className={cn('text-[10px] font-semibold uppercase tracking-wider lg:text-xs', cfg.text)}>
          {stage.name}
        </span>

        {stage.duration !== undefined && status !== 'pending' && (
          <span className="text-[9px] text-white/30">{stage.duration}ms</span>
        )}

        <div className="absolute -bottom-8 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-lg border border-white/10 bg-[#130B2C]/95 px-3 py-2 text-[10px] text-white/60 opacity-0 shadow-2xl backdrop-blur-xl transition-opacity group-hover:opacity-100">
          <p className="font-medium text-white/80">{stage.name}</p>
          <p className="mt-0.5">Stage {index + 1}</p>
          {stage.status === 'error' && (
            <p className="mt-0.5 text-red-400">Authentication failed</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function PipelineView({ stages, activeStage, className }: PipelineViewProps) {
  return (
    <div className={cn('w-full overflow-x-auto', className)}>
      <div className="flex items-center justify-start gap-0 px-4 py-8">
        {stages.map((stage, i) => {
          const status = stage.status === 'error' ? 'error' : getStageStatus(i, activeStage);
          return (
            <div key={i} className="flex items-center">
              <StageBlock stage={stage} status={status} index={i} />
              {i < stages.length - 1 && (
                <ConnectionLine
                  status={stage.status === 'error' ? 'error' : status}
                  index={i}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
