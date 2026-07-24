'use client';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { GeoEvent } from '@/types';
import { useState, useMemo, useCallback } from 'react';

interface WorldMapProps {
  events: GeoEvent[];
  className?: string;
}

const CONTINENTS = [
  {
    name: 'North America',
    path: 'M 60,90 L 100,55 L 140,50 L 180,55 L 220,58 L 250,70 L 275,90 L 285,110 L 270,140 L 250,170 L 230,200 L 210,230 L 190,250 L 170,240 L 140,230 L 110,215 L 85,195 L 65,170 L 55,140 L 50,115 Z',
    fill: '#161030',
    stroke: '#26194D',
  },
  {
    name: 'South America',
    path: 'M 200,260 L 220,255 L 245,265 L 260,280 L 275,300 L 280,325 L 275,355 L 265,380 L 250,400 L 235,420 L 220,435 L 210,420 L 200,395 L 190,370 L 185,340 L 188,310 L 192,285 Z',
    fill: '#161030',
    stroke: '#26194D',
  },
  {
    name: 'Europe',
    path: 'M 430,55 L 455,50 L 480,48 L 510,52 L 530,60 L 540,75 L 535,95 L 525,110 L 510,125 L 495,135 L 475,140 L 455,135 L 440,125 L 432,110 L 428,90 L 430,70 Z',
    fill: '#161030',
    stroke: '#26194D',
  },
  {
    name: 'Africa',
    path: 'M 435,155 L 460,145 L 490,142 L 515,148 L 535,160 L 550,180 L 560,205 L 565,235 L 560,265 L 550,295 L 535,320 L 515,340 L 495,350 L 475,345 L 458,330 L 445,305 L 438,275 L 435,245 L 432,215 L 433,185 Z',
    fill: '#161030',
    stroke: '#26194D',
  },
  {
    name: 'Asia',
    path: 'M 540,40 L 580,35 L 630,30 L 680,32 L 730,40 L 770,52 L 800,70 L 815,90 L 810,115 L 795,140 L 775,165 L 750,185 L 720,195 L 690,190 L 660,178 L 630,162 L 600,148 L 575,128 L 555,105 L 542,80 Z',
    fill: '#161030',
    stroke: '#26194D',
  },
  {
    name: 'Australia',
    path: 'M 740,295 L 770,282 L 800,278 L 830,285 L 850,300 L 858,320 L 852,342 L 838,358 L 818,365 L 795,362 L 772,352 L 755,338 L 745,320 L 740,308 Z',
    fill: '#161030',
    stroke: '#26194D',
  },
  {
    name: 'Antarctica',
    path: 'M 350,460 L 420,455 L 500,452 L 580,455 L 650,460 L 700,468 L 650,480 L 550,485 L 450,485 L 370,478 L 340,470 Z',
    fill: '#140E2A',
    stroke: '#26194D',
  },
];

function latLngToSvg(lat: number, lng: number): { x: number; y: number } {
  const x = ((lng + 180) / 360) * 1000;
  const y = ((90 - lat) / 180) * 500;
  return { x, y };
}

const EVENT_COLORS: Record<string, { fill: string; glow: string; ring: string }> = {
  active: { fill: '#A855F7', glow: '#A855F7', ring: '#C084FC' },
  verified: { fill: '#22D3EE', glow: '#22D3EE', ring: '#67E8F9' },
  threat: { fill: '#F43F5E', glow: '#F43F5E', ring: '#FB7185' },
};

const LEGEND_ITEMS = [
  { label: 'Active', color: '#A855F7' },
  { label: 'Verified', color: '#22D3EE' },
  { label: 'Threat Blocked', color: '#F43F5E' },
];

export default function WorldMap({ events, className }: WorldMapProps) {
  const [hoveredEvent, setHoveredEvent] = useState<GeoEvent | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const markers = useMemo(
    () =>
      events.map((e) => ({
        ...e,
        svg: latLngToSvg(e.lat, e.lng),
      })),
    [events]
  );

  const connections = useMemo(() => {
    const pairs: { from: { x: number; y: number }; to: { x: number; y: number }; id: string }[] = [];
    for (let i = 0; i < markers.length - 1; i += 2) {
      pairs.push({
        from: markers[i].svg,
        to: markers[i + 1].svg,
        id: `conn-${i}`,
      });
    }
    return pairs;
  }, [markers]);

  const arcPath = useCallback((from: { x: number; y: number }, to: { x: number; y: number }) => {
    const mx = (from.x + to.x) / 2;
    const my = (from.y + to.y) / 2;
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const curvature = Math.min(dist * 0.25, 60);
    const cx = mx;
    const cy = my - curvature;
    return `M ${from.x},${from.y} Q ${cx},${cy} ${to.x},${to.y}`;
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  }, []);

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden rounded-2xl border border-[#26194D]/50 bg-[#0D0820]',
        className
      )}
      onMouseMove={handleMouseMove}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#1A1238]/40 via-transparent to-[#0D0820]" />

      <div className="relative z-10 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight text-white/90">
            Global Authentication Network
          </h2>
          <div className="flex items-center gap-2 text-xs text-white/40">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            Live
          </div>
        </div>

        <div className="relative w-full" style={{ aspectRatio: '2 / 1' }}>
          <svg
            viewBox="0 0 1000 500"
            className="h-full w-full"
            style={{ filter: 'drop-shadow(0 0 40px rgba(168, 85, 247, 0.06))' }}
          >
            <defs>
              <radialGradient id="glow-purple" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#A855F7" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#A855F7" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="glow-cyan" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#22D3EE" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="glow-rose" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#F43F5E" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#F43F5E" stopOpacity="0" />
              </radialGradient>
              <filter id="blur-glow" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
              </filter>
              <filter id="blur-glow-strong" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="8" />
              </filter>
              <linearGradient id="conn-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#A855F7" stopOpacity="0.1" />
                <stop offset="50%" stopColor="#A855F7" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#A855F7" stopOpacity="0.1" />
              </linearGradient>
            </defs>

            <g opacity="0.08">
              {Array.from({ length: 21 }, (_, i) => (
                <line
                  key={`h-${i}`}
                  x1={0}
                  y1={i * 25}
                  x2={1000}
                  y2={i * 25}
                  stroke="#A855F7"
                  strokeWidth={0.5}
                />
              ))}
              {Array.from({ length: 41 }, (_, i) => (
                <line
                  key={`v-${i}`}
                  x1={i * 25}
                  y1={0}
                  x2={i * 25}
                  y2={500}
                  stroke="#A855F7"
                  strokeWidth={0.5}
                />
              ))}
            </g>

            {CONTINENTS.map((c) => (
              <path
                key={c.name}
                d={c.path}
                fill={c.fill}
                stroke={c.stroke}
                strokeWidth={1}
              />
            ))}

            {connections.map((conn) => {
              const d = arcPath(conn.from, conn.to);
              const totalLen = 800;
              return (
                <g key={conn.id}>
                  <path
                    d={d}
                    fill="none"
                    stroke="#A855F7"
                    strokeWidth={0.8}
                    strokeOpacity={0.12}
                  />
                  <motion.path
                    d={d}
                    fill="none"
                    stroke="url(#conn-gradient)"
                    strokeWidth={1.2}
                    strokeDasharray="8 12"
                    initial={{ strokeDashoffset: 0 }}
                    animate={{ strokeDashoffset: [-20] }}
                    transition={{
                      strokeDashoffset: {
                        duration: 2,
                        repeat: Infinity,
                        ease: 'linear',
                      },
                    }}
                    pathLength={totalLen}
                  />
                  <circle r={2} fill="#A855F7" opacity={0.7}>
                    <animateMotion
                      dur="3s"
                      repeatCount="indefinite"
                      path={d}
                    />
                  </circle>
                </g>
              );
            })}

            {markers.map((m, i) => {
              const type = m.type as keyof typeof EVENT_COLORS;
              const colors = EVENT_COLORS[type] || EVENT_COLORS.active;
              const gradId =
                type === 'verified'
                  ? 'glow-cyan'
                  : type === 'threat'
                  ? 'glow-rose'
                  : 'glow-purple';

              return (
                <g
                  key={m.id || i}
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setHoveredEvent(m)}
                  onMouseLeave={() => setHoveredEvent(null)}
                >
                  <circle
                    cx={m.svg.x}
                    cy={m.svg.y}
                    r={28}
                    fill={`url(#${gradId})`}
                    filter="url(#blur-glow-strong)"
                    opacity={0.3}
                  />

                  <motion.circle
                    cx={m.svg.x}
                    cy={m.svg.y}
                    r={8}
                    fill="none"
                    stroke={colors.ring}
                    strokeWidth={1}
                    initial={{ r: 8, opacity: 0.6 }}
                    animate={{ r: [8, 18, 8], opacity: [0.6, 0, 0.6] }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      delay: i * 0.3,
                      ease: 'easeInOut',
                    }}
                  />

                  <motion.circle
                    cx={m.svg.x}
                    cy={m.svg.y}
                    r={12}
                    fill="none"
                    stroke={colors.ring}
                    strokeWidth={0.5}
                    initial={{ r: 12, opacity: 0.3 }}
                    animate={{ r: [12, 24, 12], opacity: [0.3, 0, 0.3] }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: i * 0.3 + 0.5,
                      ease: 'easeInOut',
                    }}
                  />

                  <motion.circle
                    cx={m.svg.x}
                    cy={m.svg.y}
                    r={4}
                    fill={colors.fill}
                    filter="url(#blur-glow)"
                    animate={{ opacity: [0.8, 1, 0.8] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />

                  <circle
                    cx={m.svg.x}
                    cy={m.svg.y}
                    r={3}
                    fill={colors.fill}
                    stroke="#fff"
                    strokeWidth={0.8}
                    strokeOpacity={0.5}
                  />
                </g>
              );
            })}
          </svg>

          {hoveredEvent && (() => {
            const m = markers.find((e) => e.id === hoveredEvent.id);
            if (!m) return null;
            const type = m.type as keyof typeof EVENT_COLORS;
            const colors = EVENT_COLORS[type] || EVENT_COLORS.active;
            return (
              <div
                className="pointer-events-none fixed z-50 min-w-[180px] rounded-xl border border-white/10 bg-[#1A1238]/90 px-4 py-3 shadow-2xl backdrop-blur-xl"
                style={{
                  left: mousePos.x + 16,
                  top: mousePos.y - 10,
                }}
              >
                <div className="mb-1.5 flex items-center gap-2">
                  <span
                    className="inline-block h-2 w-2 rounded-full"
                    style={{ backgroundColor: colors.fill, boxShadow: `0 0 6px ${colors.glow}` }}
                  />
                  <span className="text-sm font-medium text-white/90">{m.city || m.id}</span>
                </div>
                <div className="space-y-1 text-xs text-white/50">
                  <div className="flex justify-between gap-4">
                    <span>Type</span>
                    <span style={{ color: colors.fill }} className="capitalize font-medium">
                      {m.type}
                    </span>
                  </div>
                  {m.timestamp && (
                    <div className="flex justify-between gap-4">
                      <span>Time</span>
                      <span className="text-white/70">
                        {new Date(m.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between gap-4">
                    <span>Coords</span>
                    <span className="text-white/70">
                      {m.lat.toFixed(1)}, {m.lng.toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-6 border-t border-[#26194D]/30 pt-4">
          {LEGEND_ITEMS.map((item) => (
            <div key={item.label} className="flex items-center gap-2 text-xs text-white/50">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{
                  backgroundColor: item.color,
                  boxShadow: `0 0 8px ${item.color}60`,
                }}
              />
              {item.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
