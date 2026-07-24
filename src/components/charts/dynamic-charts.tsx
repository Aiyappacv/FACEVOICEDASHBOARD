'use client';
import dynamic from 'next/dynamic';

export const DynamicRealtimeChart = dynamic(
  () => import('./realtime-chart').then((mod) => ({ default: mod.RealtimeChart })),
  {
    loading: () => (
      <div className="w-full h-[300px] flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#C44DFF]/30 border-t-[#C44DFF]" />
      </div>
    ),
    ssr: false,
  },
);

export const DynamicBiometricBarChart = dynamic(
  () => import('./bar-chart').then((mod) => ({ default: mod.BiometricBarChart })),
  {
    loading: () => (
      <div className="w-full h-[300px] flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#41F3A3]/30 border-t-[#41F3A3]" />
      </div>
    ),
    ssr: false,
  },
);

export const DynamicBiometricPieChart = dynamic(
  () => import('./pie-chart').then((mod) => ({ default: mod.BiometricPieChart })),
  {
    loading: () => (
      <div className="w-full h-[320px] flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#FF6AD5]/30 border-t-[#FF6AD5]" />
      </div>
    ),
    ssr: false,
  },
);

export const DynamicPipelineView = dynamic(
  () => import('./pipeline-view').then((mod) => ({ default: mod.PipelineView })),
  {
    loading: () => (
      <div className="w-full h-[200px] flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#C44DFF]/30 border-t-[#C44DFF]" />
      </div>
    ),
    ssr: false,
  },
);

export const DynamicWorldMap = dynamic(
  () => import('@/components/dashboard/world-map').then((mod) => ({ default: mod.default })),
  {
    loading: () => (
      <div className="w-full h-[380px] flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#3b82f6]/30 border-t-[#3b82f6]" />
      </div>
    ),
    ssr: false,
  },
);

export const DynamicProgressRing = dynamic(
  () => import('@/components/ui/progress-ring').then((mod) => ({ default: mod.ProgressRing })),
  {
    loading: () => (
      <div className="w-10 h-10 flex items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#C44DFF]/30 border-t-[#C44DFF]" />
      </div>
    ),
    ssr: false,
  },
);