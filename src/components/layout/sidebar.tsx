'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard, ScanFace, Mic, Fingerprint, Network, ShieldAlert,
  Eye, AlertTriangle, Activity, UserCheck, Key, GitBranch, FileCheck,
  ScrollText, FolderSearch, Shield, Building2, ShieldCheck, BadgeCheck,
  Server, Globe, Cloud, Cpu, BarChart3, PieChart, Brain, Database,
  Users, Settings, KeyRound, ChevronLeft, ChevronRight, Zap
} from 'lucide-react';

const navGroups = [
{
      title: 'Command Center',
      items: [
        { label: 'Overview', icon: LayoutDashboard, href: '/babyrumi' },
        { label: 'Command Center', icon: Zap, href: '/babyrumi/command-center' },
      ],
    },
  {
    title: 'Biometric AI',
    items: [
      { label: 'Face Recognition', icon: ScanFace, href: '/babyrumi/face-recognition' },
      { label: 'Voice Biometrics', icon: Mic, href: '/babyrumi/voice-biometrics' },
      { label: 'Fingerprint', icon: Fingerprint, href: '/babyrumi/fingerprint' },
      { label: 'Fusion Engine', icon: Network, href: '/babyrumi/fusion-engine' },
    ],
  },
  {
    title: 'AI Security',
    items: [
      { label: 'Deepfake Detection', icon: ShieldAlert, href: '/babyrumi/deepfake-detection' },
      { label: 'Liveness Detection', icon: Eye, href: '/babyrumi/liveness-detection' },
      { label: 'Risk Intelligence', icon: AlertTriangle, href: '/babyrumi/risk-intelligence' },
      { label: 'Threat Monitor', icon: Activity, href: '/babyrumi/threat-monitor' },
    ],
  },
  {
    title: 'Identity',
    items: [
      { label: 'Identity Verification', icon: UserCheck, href: '/babyrumi/identity-verification' },
      { label: 'Auth Sessions', icon: Key, href: '/babyrumi/authentication-sessions' },
      { label: 'Identity Graph', icon: GitBranch, href: '/babyrumi/identity-graph' },
    ],
  },
  {
    title: 'Forensics',
    items: [
      { label: 'Evidence Center', icon: FileCheck, href: '/babyrumi/evidence-center' },
      { label: 'Audit Trail', icon: ScrollText, href: '/babyrumi/audit-trail' },
      { label: 'Case Investigation', icon: FolderSearch, href: '/babyrumi/case-investigation' },
    ],
  },
  {
    title: 'Compliance',
    items: [
      { label: 'GDPR', icon: Shield, href: '/babyrumi/compliance/gdpr' },
      { label: 'HIPAA', icon: Building2, href: '/babyrumi/compliance/hipaa' },
      { label: 'PDPA', icon: ShieldCheck, href: '/babyrumi/compliance/pdpa' },
      { label: 'SOC 2', icon: BadgeCheck, href: '/babyrumi/compliance/soc2' },
      { label: 'ISO 30107', icon: ShieldCheck, href: '/babyrumi/compliance/iso30107' },
    ],
  },
  {
    title: 'Infrastructure',
    items: [
      { label: 'Devices', icon: Server, href: '/babyrumi/devices' },
      { label: 'Edge Nodes', icon: Globe, href: '/babyrumi/edge-nodes' },
      { label: 'API Gateway', icon: Cloud, href: '/babyrumi/api-gateway' },
      { label: 'Cloud', icon: Cloud, href: '/babyrumi/cloud' },
      { label: 'MLOps', icon: Cpu, href: '/babyrumi/mlops' },
    ],
  },
  {
    title: 'Analytics',
    items: [
      { label: 'Fraud Analytics', icon: BarChart3, href: '/babyrumi/fraud-analytics' },
      { label: 'Performance', icon: PieChart, href: '/babyrumi/performance' },
      { label: 'AI Models', icon: Brain, href: '/babyrumi/ai-models' },
      { label: 'Usage', icon: Database, href: '/babyrumi/usage' },
    ],
  },
  {
    title: 'Administration',
    items: [
      { label: 'Users', icon: Users, href: '/babyrumi/users' },
      { label: 'Roles & Permissions', icon: KeyRound, href: '/babyrumi/roles' },
      { label: 'Settings', icon: Settings, href: '/babyrumi/settings' },
      { label: 'API Keys', icon: Key, href: '/babyrumi/api-keys' },
    ],
  },
];

const SIDEBAR_WIDTH = 280;
const SIDEBAR_COLLAPSED_WIDTH = 72;

export function Sidebar() {
  const pathname = usePathname();
  const collapsed = useAppStore((s) => s.sidebarCollapsed);
  const toggle = useAppStore((s) => s.toggleSidebar);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      className="fixed left-0 top-0 bottom-0 z-40 flex flex-col overflow-hidden"
      style={{ backgroundColor: '#170F33' }}
    >
      {/* Dot pattern overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(196,77,255,0.6) 1px, transparent 0)',
          backgroundSize: '20px 20px',
        }}
      />

      {/* Subtle top glow */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#C44DFF]/[0.07] to-transparent" />

      {/* Logo area */}
      <div className="relative flex h-16 shrink-0 items-center border-b border-white/[.05]">
        <div className="flex w-full items-center gap-3 px-5">
          {/* Glowing orb icon */}
          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#C44DFF] to-[#7B2FBE] shadow-lg shadow-[#C44DFF]/20">
            <div className="absolute inset-0 animate-pulse rounded-xl bg-[#C44DFF]/20 blur-md" />
            <ScanFace className="relative h-5 w-5 text-white" />
          </div>

          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col overflow-hidden"
              >
                <span className="whitespace-nowrap bg-gradient-to-r from-white via-white to-[#C44DFF] bg-clip-text text-sm font-bold text-transparent">
                  SPECTRAFACEVOICE
                </span>
                <span className="whitespace-nowrap text-[10px] font-medium tracking-[0.2em] text-white/30">
                  ENTERPRISE
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <nav className="scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent relative flex-1 overflow-y-auto overflow-x-hidden px-3 py-3">
        <div className="space-y-1">
          {navGroups.map((group) => (
            <div key={group.title}>
              {/* Group title */}
              <AnimatePresence>
                {!collapsed && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="mb-1.5 px-3 pt-4 pb-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-white/25"
                  >
                    {group.title}
                  </motion.p>
                )}
              </AnimatePresence>

              {collapsed && (
                <div className="mx-auto my-2 h-px w-6 bg-white/[.05]" />
              )}

              {group.items.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onMouseEnter={() => setHoveredItem(item.href)}
                    onMouseLeave={() => setHoveredItem(null)}
                    className={cn(
                      'group relative mb-0.5 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'bg-[#26194D] text-white'
                        : 'text-white/50 hover:bg-[#26194D]/60 hover:text-white/80',
                      collapsed && 'justify-center px-0'
                    )}
                  >
                    {/* Active indicator bar */}
                    {isActive && (
                      <motion.div
                        layoutId="sidebar-active"
                        className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-gradient-to-b from-[#C44DFF] to-[#7B2FBE]"
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}

                    {/* Hover glow */}
                    {hoveredItem === item.href && !isActive && (
                      <motion.div
                        layoutId="sidebar-hover"
                        className="absolute inset-0 rounded-xl bg-white/[.03]"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}

                    <Icon
                      className={cn(
                        'relative z-10 h-[18px] w-[18px] shrink-0 transition-colors',
                        isActive ? 'text-[#C44DFF]' : 'text-white/40 group-hover:text-white/70'
                      )}
                    />

                    <AnimatePresence>
                      {!collapsed && (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.15 }}
                          className="relative z-10 whitespace-nowrap"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>

                    {/* Tooltip for collapsed state */}
                    {collapsed && (
                      <div className="pointer-events-none absolute left-full ml-3 rounded-lg bg-[#26194D] px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-xl shadow-black/40 transition-opacity group-hover:opacity-100">
                        {item.label}
                        <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 border-4 border-transparent border-r-[#26194D]" />
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>
      </nav>

      {/* Bottom gradient fade */}
      <div className="pointer-events-none absolute bottom-14 left-0 right-0 h-16 bg-gradient-to-t from-[#170F33] to-transparent" />

      {/* Collapse toggle */}
      <div className="relative shrink-0 border-t border-white/[.05] px-3 py-3">
        <button
          onClick={toggle}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/[.05] bg-white/[.03] py-2 text-xs text-white/40 transition-all hover:border-[#C44DFF]/20 hover:bg-[#C44DFF]/10 hover:text-white/70"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4" />
              <span className="text-[11px] font-medium">Collapse</span>
            </>
          )}
        </button>
      </div>
    </motion.aside>
  );
}
