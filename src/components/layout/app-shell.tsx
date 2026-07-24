'use client';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store';
import { Sidebar } from './sidebar';
import { TopNav } from './top-nav';
import { CommandPalette } from './command-palette';
import { motion } from 'framer-motion';

const SIDEBAR_WIDTH = 280;
const SIDEBAR_COLLAPSED_WIDTH = 72;
const TOPNAV_HEIGHT = 64;

export function AppShell({ children }: { children: React.ReactNode }) {
  const collapsed = useAppStore((s) => s.sidebarCollapsed);

  return (
    <div className="min-h-screen bg-[#130B2C]">
      {/* Ambient background effects */}
      <div className="pointer-events-none fixed inset-0 z-0">
        {/* Top-left gradient orb */}
        <div
          className="absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full opacity-[0.07]"
          style={{
            background: 'radial-gradient(circle, #C44DFF 0%, transparent 70%)',
          }}
        />
        {/* Bottom-right gradient orb */}
        <div
          className="absolute -bottom-32 -right-32 h-[400px] w-[400px] rounded-full opacity-[0.04]"
          style={{
            background: 'radial-gradient(circle, #7B2FBE 0%, transparent 70%)',
          }}
        />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(196,77,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(196,77,255,0.3) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Sidebar */}
      <Sidebar />

      {/* Top nav */}
      <TopNav />

      {/* Command palette */}
      <CommandPalette />

      {/* Main content */}
      <motion.main
        initial={false}
        animate={{
          marginLeft: collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH,
        }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative z-10"
        style={{ paddingTop: TOPNAV_HEIGHT }}
      >
        <div className="p-6">{children}</div>
      </motion.main>
    </div>
  );
}
