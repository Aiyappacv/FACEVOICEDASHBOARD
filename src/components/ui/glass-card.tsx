'use client';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

interface GlassCardProps extends HTMLMotionProps<'div'> {
  variant?: 'default' | 'elevated' | 'interactive';
  glow?: 'none' | 'purple' | 'pink' | 'success' | 'danger';
  noPadding?: boolean;
}

const glowMap: Record<NonNullable<GlassCardProps['glow']>, string> = {
  none: '',
  purple: 'hover:shadow-[0_0_30px_rgba(196,77,255,0.15)]',
  pink: 'hover:shadow-[0_0_30px_rgba(255,106,213,0.15)]',
  success: 'hover:shadow-[0_0_30px_rgba(65,243,163,0.15)]',
  danger: 'hover:shadow-[0_0_30px_rgba(255,90,125,0.15)]',
};

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  (
    {
      variant = 'default',
      glow = 'none',
      noPadding = false,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={
          variant === 'interactive'
            ? { scale: 1.01, transition: { duration: 0.2 } }
            : undefined
        }
        className={cn(
          'rounded-[24px] border border-white/[.05] bg-[rgba(38,24,74,0.85)] backdrop-blur-xl',
          !noPadding && 'p-6',
          variant === 'elevated' && 'shadow-[0_8px_32px_rgba(0,0,0,0.4)] shadow-[0_0_60px_rgba(196,77,255,0.08)]',
          variant === 'interactive' && 'cursor-pointer transition-shadow duration-300',
          glowMap[glow],
          className,
        )}
        {...props}
      >
        {children}
      </motion.div>
    );
  },
);

GlassCard.displayName = 'GlassCard';

export { GlassCard, type GlassCardProps };
