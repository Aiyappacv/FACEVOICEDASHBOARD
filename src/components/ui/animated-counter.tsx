'use client';
import { useEffect, useState, useRef } from 'react';
import { useInView } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  format?: 'number' | 'percentage' | 'currency' | 'duration';
  className?: string;
  prefix?: string;
  suffix?: string;
}

function formatValue(
  raw: number,
  format: AnimatedCounterProps['format'],
): string {
  switch (format) {
    case 'currency':
      return `$${raw.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    case 'percentage':
      return `${raw.toFixed(1)}%`;
    case 'duration': {
      const ms = Math.round(raw);
      if (ms < 1000) return `${ms}ms`;
      return `${(ms / 1000).toFixed(1)}s`;
    }
    default:
      return raw.toLocaleString('en-US');
  }
}

function AnimatedCounter({
  value,
  duration = 1200,
  format = 'number',
  className,
  prefix,
  suffix,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const [display, setDisplay] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!isInView) return;

    const start = performance.now();
    const from = 0;
    const to = value;

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(from + (to - from) * eased);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isInView, value, duration]);

  return (
    <span ref={ref} className={cn('font-mono tabular-nums', className)}>
      {prefix}
      {formatValue(display, format)}
      {suffix}
    </span>
  );
}

export { AnimatedCounter, type AnimatedCounterProps };
