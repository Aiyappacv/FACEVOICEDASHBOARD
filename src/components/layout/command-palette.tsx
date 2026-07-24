'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store';
import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search, ScanFace, Mic, Fingerprint, ShieldAlert, Users,
  Settings, FileText, BarChart3, Brain, ArrowRight, Zap,
  Eye, Activity, Globe, Server, Cpu, LayoutDashboard
} from 'lucide-react';

interface CommandItem {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  href: string;
  category: string;
  keywords: string[];
}

const commands: CommandItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    description: 'Go to main dashboard',
    icon: LayoutDashboard,
    href: '/babyrumi',
    category: 'Navigation',
    keywords: ['home', 'overview', 'main'],
  },
  {
    id: 'command-center',
    label: 'Command Center',
    description: 'Operational command center',
    icon: Zap,
    href: '/babyrumi/command-center',
    category: 'Navigation',
    keywords: ['ops', 'control', 'operations'],
  },
  {
    id: 'face-recognition',
    label: 'Face Recognition',
    description: 'Biometric face analysis engine',
    icon: ScanFace,
    href: '/babyrumi/face-recognition',
    category: 'Biometric AI',
    keywords: ['face', 'scan', 'biometric', 'detect'],
  },
  {
    id: 'voice-biometrics',
    label: 'Voice Biometrics',
    description: 'Voice identification system',
    icon: Mic,
    href: '/babyrumi/voice-biometrics',
    category: 'Biometric AI',
    keywords: ['voice', 'audio', 'speaker'],
  },
  {
    id: 'fingerprint',
    label: 'Fingerprint',
    description: 'Fingerprint matching engine',
    icon: Fingerprint,
    href: '/babyrumi/fingerprint',
    category: 'Biometric AI',
    keywords: ['fingerprint', 'print', 'scan'],
  },
  {
    id: 'deepfake-detection',
    label: 'Deepfake Detection',
    description: 'AI-powered deepfake analysis',
    icon: ShieldAlert,
    href: '/babyrumi/deepfake-detection',
    category: 'AI Security',
    keywords: ['deepfake', 'fake', 'fraud', 'spoof'],
  },
  {
    id: 'liveness-detection',
    label: 'Liveness Detection',
    description: 'Verify live presence',
    icon: Eye,
    href: '/babyrumi/liveness-detection',
    category: 'AI Security',
    keywords: ['liveness', 'live', 'real', 'presence'],
  },
  {
    id: 'threat-monitor',
    label: 'Threat Monitor',
    description: 'Real-time threat monitoring',
    icon: Activity,
    href: '/babyrumi/threat-monitor',
    category: 'AI Security',
    keywords: ['threat', 'monitor', 'alert', 'security'],
  },
  {
    id: 'identity-verification',
    label: 'Identity Verification',
    description: 'Verify user identities',
    icon: Users,
    href: '/babyrumi/identity-verification',
    category: 'Identity',
    keywords: ['identity', 'verify', 'kyc', 'kyc'],
  },
  {
    id: 'devices',
    label: 'Devices',
    description: 'Manage edge devices',
    icon: Server,
    href: '/babyrumi/devices',
    category: 'Infrastructure',
    keywords: ['device', 'server', 'hardware'],
  },
  {
    id: 'ai-models',
    label: 'AI Models',
    description: 'Model registry & versions',
    icon: Brain,
    href: '/babyrumi/ai-models',
    category: 'Analytics',
    keywords: ['model', 'ai', 'ml', 'version'],
  },
  {
    id: 'settings',
    label: 'Settings',
    description: 'System settings',
    icon: Settings,
    href: '/babyrumi/admin/settings',
    category: 'Administration',
    keywords: ['settings', 'config', 'preferences'],
  },
  {
    id: 'users',
    label: 'User Management',
    description: 'Manage system users',
    icon: Users,
    href: '/babyrumi/admin/users',
    category: 'Administration',
    keywords: ['user', 'admin', 'account', 'manage'],
  },
  {
    id: 'fraud-analytics',
    label: 'Fraud Analytics',
    description: 'Fraud detection analytics',
    icon: BarChart3,
    href: '/babyrumi/fraud-analytics',
    category: 'Analytics',
    keywords: ['fraud', 'analytics', 'report'],
  },
  {
    id: 'reports',
    label: 'Reports',
    description: 'Generate & view reports',
    icon: FileText,
    href: '/babyrumi/fraud-analytics',
    category: 'Analytics',
    keywords: ['report', 'export', 'pdf', 'csv'],
  },
  {
    id: 'edge-nodes',
    label: 'Edge Nodes',
    description: 'Edge computing infrastructure',
    icon: Globe,
    href: '/babyrumi/edge-nodes',
    category: 'Infrastructure',
    keywords: ['edge', 'node', 'cdn', 'distributed'],
  },
  {
    id: 'mlops',
    label: 'MLOps',
    description: 'ML operations pipeline',
    icon: Cpu,
    href: '/babyrumi/mlops',
    category: 'Infrastructure',
    keywords: ['ml', 'ops', 'pipeline', 'deploy'],
  },
];

export function CommandPalette() {
  const isOpen = useAppStore((s) => s.commandPaletteOpen);
  const setIsOpen = useAppStore((s) => s.setCommandPaletteOpen);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const filteredCommands = commands.filter((cmd) => {
    const q = query.toLowerCase();
    return (
      cmd.label.toLowerCase().includes(q) ||
      cmd.description.toLowerCase().includes(q) ||
      cmd.category.toLowerCase().includes(q) ||
      cmd.keywords.some((k) => k.includes(q))
    );
  });

  const grouped = filteredCommands.reduce(
    (acc, cmd) => {
      if (!acc[cmd.category]) acc[cmd.category] = [];
      acc[cmd.category].push(cmd);
      return acc;
    },
    {} as Record<string, CommandItem[]>
  );

  const executeCommand = useCallback(
    (cmd: CommandItem) => {
      router.push(cmd.href);
      setIsOpen(false);
      setQuery('');
      setSelectedIndex(0);
    },
    [router, setIsOpen]
  );

  // Global keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(!isOpen);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, setIsOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, filteredCommands.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
        e.preventDefault();
        executeCommand(filteredCommands[selectedIndex]);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, filteredCommands, selectedIndex, executeCommand]);

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Scroll selected into view
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const selected = list.querySelector(`[data-index="${selectedIndex}"]`);
    if (selected) {
      selected.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Palette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed left-1/2 top-[15vh] z-50 w-full max-w-[560px] -translate-x-1/2 overflow-hidden rounded-2xl border border-white/[.08] bg-[#1A1035] shadow-2xl shadow-black/60"
          >
            {/* Search input */}
            <div className="flex items-center gap-3 border-b border-white/[.05] px-5 py-4">
              <Search className="h-5 w-5 shrink-0 text-[#C44DFF]/70" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                placeholder="Type a command or search..."
                className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/30"
              />
              <kbd className="rounded-md border border-white/[.1] bg-white/[.05] px-2 py-0.5 text-[10px] font-medium text-white/30">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div ref={listRef} className="max-h-[400px] overflow-y-auto p-2">
              {filteredCommands.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-white/30">
                  <Search className="mb-3 h-8 w-8 opacity-40" />
                  <p className="text-sm">No results found</p>
                </div>
              )}

              {Object.entries(grouped).map(([category, items]) => (
                <div key={category} className="mb-2">
                  <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-white/25">
                    {category}
                  </p>
                  {items.map((cmd) => {
                    const globalIndex = filteredCommands.indexOf(cmd);
                    const Icon = cmd.icon;

                    return (
                      <button
                        key={cmd.id}
                        data-index={globalIndex}
                        onClick={() => executeCommand(cmd)}
                        onMouseEnter={() => setSelectedIndex(globalIndex)}
                        className={cn(
                          'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors',
                          globalIndex === selectedIndex
                            ? 'bg-[#C44DFF]/15 text-white'
                            : 'text-white/60 hover:bg-white/[.04]'
                        )}
                      >
                        <div
                          className={cn(
                            'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                            globalIndex === selectedIndex
                              ? 'bg-[#C44DFF]/20'
                              : 'bg-white/[.05]'
                          )}
                        >
                          <Icon
                            className={cn(
                              'h-4 w-4',
                              globalIndex === selectedIndex
                                ? 'text-[#C44DFF]'
                                : 'text-white/40'
                            )}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{cmd.label}</p>
                          <p className="text-xs text-white/30 truncate">{cmd.description}</p>
                        </div>
                        {globalIndex === selectedIndex && (
                          <ArrowRight className="h-4 w-4 shrink-0 text-[#C44DFF]/50" />
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-center gap-4 border-t border-white/[.05] px-5 py-2.5 text-[10px] text-white/25">
              <span className="flex items-center gap-1">
                <kbd className="rounded border border-white/[.1] bg-white/[.05] px-1 py-0.5">↑↓</kbd>
                Navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="rounded border border-white/[.1] bg-white/[.05] px-1 py-0.5">↵</kbd>
                Open
              </span>
              <span className="flex items-center gap-1">
                <kbd className="rounded border border-white/[.1] bg-white/[.05] px-1 py-0.5">esc</kbd>
                Close
              </span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
