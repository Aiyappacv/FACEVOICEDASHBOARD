'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ActivityEvent } from '@/types';
import {
  ShieldCheck,
  ShieldAlert,
  Mic,
  ScanFace,
  Fingerprint,
  AlertTriangle,
  Zap,
  Wifi,
  Brain,
  TrendingUp,
  UserX,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useRef, useEffect } from 'react';

interface ActivityFeedProps {
  events: ActivityEvent[];
  maxItems?: number;
}

const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  identity_verified: ShieldCheck,
  deepfake_blocked: ShieldAlert,
  voice_clone_detected: Mic,
  replay_attack: AlertTriangle,
  fingerprint_match: Fingerprint,
  liveness_passed: ScanFace,
  auth_failed: UserX,
  api_connected: Wifi,
  model_updated: Brain,
  risk_increased: TrendingUp,
};

const severityColorMap: Record<string, string> = {
  info: '#C44DFF',
  warning: '#FFC857',
  danger: '#FF5A7D',
  success: '#41F3A3',
};

function ActivityFeed({ events, maxItems = 50 }: ActivityFeedProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const visible = events.slice(0, maxItems);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [events.length]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2.5 mb-4">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#C44DFF] opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#C44DFF]" />
        </span>
        <h3 className="text-sm font-semibold text-white/80 tracking-wide uppercase">
          Live AI Activity
        </h3>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[400px] scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
      >
        <AnimatePresence initial={false}>
          {visible.map((event) => {
            const IconComp = iconMap[event.type] || Zap;
            const color = severityColorMap[event.severity] || '#C44DFF';

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex items-start gap-3 rounded-2xl border border-white/[.04] bg-white/[.03] p-3 hover:bg-white/[.05] transition-colors"
              >
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg mt-0.5"
                  style={{ backgroundColor: `${color}15` }}
                >
                  <IconComp className="h-4 w-4" style={{ color }} />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white/80 leading-snug">
                    {event.message}
                  </p>
                  <p className="text-[11px] text-white/30 mt-1">
                    {formatDistanceToNow(new Date(event.timestamp), {
                      addSuffix: true,
                    })}
                  </p>
                </div>

                <div
                  className="h-1.5 w-1.5 rounded-full shrink-0 mt-2"
                  style={{ backgroundColor: color }}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

export { ActivityFeed, type ActivityFeedProps };
