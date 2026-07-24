'use client';
import { useState, useEffect, useRef, useCallback } from 'react';

interface RealtimeMetricsConfig {
  intervalMs?: number;
  fluctuationRange?: [number, number];
}

const SHARED_INTERVALS = new Map<number, NodeJS.Timeout>();
const INTERVAL_REF_COUNTS = new Map<number, number>();

function getSharedInterval(intervalMs: number, callback: () => void): () => void {
  const count = INTERVAL_REF_COUNTS.get(intervalMs) || 0;
  INTERVAL_REF_COUNTS.set(intervalMs, count + 1);

  if (!SHARED_INTERVALS.has(intervalMs)) {
    const id = setInterval(callback, intervalMs);
    SHARED_INTERVALS.set(intervalMs, id);
  }

  return () => {
    const currentCount = INTERVAL_REF_COUNTS.get(intervalMs) || 1;
    if (currentCount <= 1) {
      const id = SHARED_INTERVALS.get(intervalMs);
      if (id) {
        clearInterval(id);
        SHARED_INTERVALS.delete(intervalMs);
      }
      INTERVAL_REF_COUNTS.delete(intervalMs);
    } else {
      INTERVAL_REF_COUNTS.set(intervalMs, currentCount - 1);
    }
  };
}

export function useSharedInterval(callback: () => void, intervalMs: number) {
  useEffect(() => {
    return getSharedInterval(intervalMs, callback);
  }, [callback, intervalMs]);
}

export function useAnimatedCounter(target: number, duration: number = 2000) {
  const [count, setCount] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    startTimeRef.current = null;

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frameRef.current);
  }, [target, duration]);

  return count;
}

const randomBetween = (min: number, max: number) => Math.random() * (max - min) + min;

export function useRealtimeMetrics(initialMetrics: any[], config: RealtimeMetricsConfig = {}) {
  const { intervalMs = 4000, fluctuationRange = [-0.5, 0.5] } = config;
  const [metrics, setMetrics] = useState(initialMetrics);

  useSharedInterval(() => {
    setMetrics((prev) =>
      prev.map((metric) => {
        const fluctuation = randomBetween(fluctuationRange[0], fluctuationRange[1]);
        let newValue = metric.value;

        if (metric.format === 'percentage') {
          newValue = Math.max(80, Math.min(100, metric.value + fluctuation * 0.3));
        } else if (metric.format === 'latency' || metric.format === 'duration') {
          newValue = Math.max(80, Math.min(300, metric.value + randomBetween(-5, 5)));
        } else {
          newValue = Math.max(0, metric.value + Math.round(randomBetween(-15, 25)));
        }

        return {
          ...metric,
          value: Math.round(newValue * 10) / 10,
        };
      })
    );
  }, intervalMs);

  return metrics;
}

const activityTemplates = [
  { type: 'verification', status: 'success', action: 'Multi-factor authentication completed', details: 'Face + Voice verified in 134ms', method: 'biometric' },
  { type: 'verification', status: 'success', action: 'Voice biometric match confirmed', details: 'Voiceprint matched with 99.1% confidence', method: 'voice' },
  { type: 'threat', status: 'blocked', action: 'Deepfake attack detected and blocked', details: 'AI-generated face spoofing attempt intercepted', method: 'deepfake' },
  { type: 'verification', status: 'success', action: 'Fingerprint scan authenticated', details: 'Minutiae matching score 98.9%', method: 'fingerprint' },
  { type: 'risk', status: 'warning', action: 'Unusual location pattern detected', details: 'Login from new geographic region', method: 'behavioral' },
  { type: 'verification', status: 'success', action: 'Liveness verification passed', details: '3D depth mapping confirmed live subject', method: 'face' },
  { type: 'system', status: 'success', action: 'Edge node health check completed', details: 'All nodes operational', method: 'system' },
  { type: 'verification', status: 'success', action: 'Multi-modal fusion verified', details: 'Cross-modal score 99.2%', method: 'biometric' },
  { type: 'threat', status: 'blocked', action: 'Replay attack intercepted', details: 'Recorded audio sample detected', method: 'voice' },
  { type: 'verification', status: 'success', action: 'Contactless face verification', details: 'IR liveness check passed', method: 'face' },
  { type: 'compliance', status: 'success', action: 'Audit log encrypted and stored', details: 'Evidence bundle generated', method: 'system' },
  { type: 'verification', status: 'failed', action: 'Presentation attack detected', details: 'Printed photo held in front of camera', method: 'face' },
  { type: 'verification', status: 'success', action: 'Iris scan verified', details: 'Iris pattern confidence 99.7%', method: 'biometric' },
  { type: 'risk', status: 'warning', action: 'Device fingerprint mismatch', details: 'New device detected for known user', method: 'behavioral' },
  { type: 'verification', status: 'success', action: 'Palm vein scan authenticated', details: 'Vascular pattern match 99.5%', method: 'biometric' },
];

const userNames = [
  'Sarah Chen', 'James Rodriguez', 'Priya Sharma', 'Yuki Tanaka', 'David Kim',
  'Elena Volkov', 'Ahmed Al-Rashid', 'Lisa Anderson', 'Wei Zhang', 'Sophie Laurent',
  'Carlos Mendez', 'Maria Santos', 'Hiroshi Nakamura', 'Fatima Al-Zahra', 'Tom Mitchell',
  'Deepa Krishnan', 'Robert Fischer', 'Amara Okafor', 'Isabella Rossi', 'David Park',
];

const locations = [
  'New York, US', 'London, UK', 'Tokyo, JP', 'Singapore, SG', 'Sydney, AU',
  'Dubai, AE', 'Frankfurt, DE', 'São Paulo, BR', 'Mumbai, IN', 'Seoul, KR',
];

export function useRealtimeActivity(initialEvents: any[], intervalMs: number = 6000) {
  const [events, setEvents] = useState(initialEvents);

  useSharedInterval(() => {
    const template = activityTemplates[Math.floor(Math.random() * activityTemplates.length)];
    const user = template.type === 'system' || template.type === 'threat' ? 'System' : userNames[Math.floor(Math.random() * userNames.length)];
    const riskScore =
      template.status === 'blocked' ? randomBetween(80, 99) :
      template.status === 'failed' ? randomBetween(70, 95) :
      template.status === 'warning' ? randomBetween(40, 70) :
      randomBetween(0, 10);

    const newEvent = {
      id: `evt-rt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      ...template,
      user,
      timestamp: new Date(),
      riskScore: Math.round(riskScore),
      location: locations[Math.floor(Math.random() * locations.length)],
    };

    setEvents((prev) => [newEvent, ...prev.slice(0, 49)]);
  }, intervalMs);

  return events;
}

export function useCurrentTime() {
  const [time, setTime] = useState(new Date());

  useSharedInterval(() => setTime(new Date()), 1000);

  return time;
}

export function usePipelineAnimation(totalStages: number = 9, intervalMs: number = 2500) {
  const [activeStage, setActiveStage] = useState(0);
  const [completedStages, setCompletedStages] = useState<number[]>([]);

  useSharedInterval(() => {
    setActiveStage((prev) => {
      const next = prev + 1;
      if (next >= totalStages) {
        setCompletedStages([]);
        return 0;
      }
      setCompletedStages((completed) => [...completed, prev]);
      return next;
    });
  }, intervalMs);

  return { activeStage, completedStages };
}