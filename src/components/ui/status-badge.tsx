import { cn } from '@/lib/utils';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'purple' | 'cyan' | 'orange';

interface StatusBadgeProps {
  label: string;
  variant: BadgeVariant;
  size?: 'sm' | 'md';
  pulse?: boolean;
}

const colorMap: Record<BadgeVariant, { dot: string; bg: string; text: string }> = {
  success: { dot: 'bg-[#41F3A3]', bg: 'bg-[#41F3A3]/10', text: 'text-[#41F3A3]' },
  warning: { dot: 'bg-[#FFC857]', bg: 'bg-[#FFC857]/10', text: 'text-[#FFC857]' },
  danger: { dot: 'bg-[#FF5A7D]', bg: 'bg-[#FF5A7D]/10', text: 'text-[#FF5A7D]' },
  info: { dot: 'bg-[#C44DFF]', bg: 'bg-[#C44DFF]/10', text: 'text-[#C44DFF]' },
  neutral: { dot: 'bg-[#8F88B2]', bg: 'bg-[#8F88B2]/10', text: 'text-[#8F88B2]' },
  purple: { dot: 'bg-[#A855F7]', bg: 'bg-[#A855F7]/10', text: 'text-[#A855F7]' },
  cyan: { dot: 'bg-[#06b6d4]', bg: 'bg-[#06b6d4]/10', text: 'text-[#06b6d4]' },
  orange: { dot: 'bg-[#f97316]', bg: 'bg-[#f97316]/10', text: 'text-[#f97316]' },
};

const sizeMap = {
  sm: 'px-2 py-0.5 text-[10px] gap-1.5',
  md: 'px-2.5 py-1 text-xs gap-2',
};

const dotSizeMap = {
  sm: 'h-1.5 w-1.5',
  md: 'h-2 w-2',
};

function StatusBadge({ label, variant, size = 'sm', pulse = false }: StatusBadgeProps) {
  const colors = colorMap[variant];

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        colors.bg,
        colors.text,
        sizeMap[size],
      )}
    >
      <span className="relative flex">
        <span className={cn('rounded-full', colors.dot, dotSizeMap[size])} />
        {pulse && (
          <span
            className={cn(
              'absolute inset-0 rounded-full animate-ping opacity-75',
              colors.dot,
            )}
          />
        )}
      </span>
      {label}
    </span>
  );
}

export { StatusBadge, type StatusBadgeProps, type BadgeVariant };
