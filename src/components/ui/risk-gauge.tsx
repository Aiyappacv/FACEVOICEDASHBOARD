'use client';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface RiskGaugeProps {
  score: number;
  size?: number;
  label?: string;
  className?: string;
}

function getScoreColor(score: number): string {
  if (score <= 30) return '#41F3A3';
  if (score <= 60) return '#FFC857';
  if (score <= 80) return '#FF9F43';
  return '#FF5A7D';
}

function getScoreLabel(score: number): string {
  if (score <= 30) return 'Low Risk';
  if (score <= 60) return 'Moderate';
  if (score <= 80) return 'Elevated';
  return 'Critical';
}

function RiskGauge({ score, size = 200, label, className }: RiskGaugeProps) {
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const startAngle = -180;
  const endAngle = 0;
  const totalArc = Math.abs(endAngle - startAngle);
  const clampedScore = Math.max(0, Math.min(100, score));
  const needleAngle = startAngle + (clampedScore / 100) * totalArc;

  const color = getScoreColor(clampedScore);
  const riskLabel = label || getScoreLabel(clampedScore);

  const arcPath = (
    start: number,
    end: number,
    r: number,
    cx: number,
    cy: number,
  ) => {
    const rad1 = (start * Math.PI) / 180;
    const rad2 = (end * Math.PI) / 180;
    const x1 = cx + r * Math.cos(rad1);
    const y1 = cy + r * Math.sin(rad1);
    const x2 = cx + r * Math.cos(rad2);
    const y2 = cy + r * Math.sin(rad2);
    const largeArc = Math.abs(end - start) > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`;
  };

  const needleRad = (needleAngle * Math.PI) / 180;
  const needleLength = radius - 20;
  const needleX = center + needleLength * Math.cos(needleRad);
  const needleY = center + needleLength * Math.sin(needleRad);

  const segments = [
    { start: -180, end: -108, color: '#41F3A3' },
    { start: -108, end: -36, color: '#FFC857' },
    { start: -36, end: 36, color: '#FF9F43' },
    { start: 36, end: 108, color: '#FF5A7D' },
  ];

  return (
    <div className={cn('relative inline-flex flex-col items-center', className)}>
      <svg width={size} height={size * 0.6} viewBox={`0 0 ${size} ${size * 0.6}`}>
        {segments.map((seg, i) => (
          <path
            key={i}
            d={arcPath(seg.start, seg.end, radius, center, center)}
            fill="none"
            stroke={seg.color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            opacity={0.2}
          />
        ))}

        <motion.path
          d={arcPath(startAngle, needleAngle, radius, center, center)}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{ filter: `drop-shadow(0 0 10px ${color}66)` }}
        />

        <motion.line
          x1={center}
          y1={center}
          x2={needleX}
          y2={needleY}
          stroke={color}
          strokeWidth={2.5}
          strokeLinecap="round"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          style={{ filter: `drop-shadow(0 0 4px ${color})` }}
        />

        <circle cx={center} cy={center} r={5} fill={color} />
        <circle cx={center} cy={center} r={2.5} fill="#130B2C" />
      </svg>

      <div className="flex flex-col items-center -mt-2">
        <motion.span
          className="text-3xl font-bold font-mono tabular-nums text-white"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{ textShadow: `0 0 20px ${color}44` }}
        >
          {Math.round(clampedScore)}
        </motion.span>
        <span className="text-xs font-medium text-white/40 mt-0.5">
          {riskLabel}
        </span>
      </div>
    </div>
  );
}

export { RiskGauge, type RiskGaugeProps };
