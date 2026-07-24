'use client';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store';
import { useCurrentTime } from '@/hooks/use-realtime';
import { format } from 'date-fns';
import { useState, useEffect } from 'react';
import {
  Search, Bell, MessageSquare, User, Command, ChevronDown,
  Globe, Monitor, Wifi, WifiOff
} from 'lucide-react';

export function TopNav() {
  const collapsed = useAppStore((s) => s.sidebarCollapsed);
  const time = useCurrentTime();
  const [notificationCount] = useState(7);
  const [realtimeEnabled] = useState(true);

  return (
    <header
      className={cn(
        'fixed right-0 top-0 z-30 flex h-16 items-center border-b border-white/[.05] backdrop-blur-xl transition-all duration-300',
        collapsed ? 'left-[72px]' : 'left-[280px]'
      )}
      style={{ backgroundColor: 'rgba(19, 11, 44, 0.8)' }}
    >
      {/* Left spacer */}
      <div className="flex-1" />

      {/* Center: Global search bar */}
      <div className="relative mx-6 hidden lg:block">
        <div className="flex items-center gap-3 rounded-full border border-white/[.05] bg-white/[.05] px-4 py-2 transition-colors focus-within:border-[#C44DFF]/30 focus-within:bg-white/[.08]">
          <Search className="h-4 w-4 text-white/30" />
          <input
            type="text"
            placeholder="Search identities, threats, models..."
            className="w-[320px] bg-transparent text-sm text-white/70 outline-none placeholder:text-white/30"
          />
          <div className="flex items-center gap-0.5 rounded-md border border-white/[.1] bg-white/[.05] px-1.5 py-0.5">
            <Command className="h-3 w-3 text-white/30" />
            <span className="text-[10px] font-medium text-white/30">K</span>
          </div>
        </div>
      </div>

      {/* Right side items */}
      <div className="flex items-center gap-1 pr-5">
        {/* Workspace selector */}
        <button className="hidden items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium text-white/50 transition-colors hover:bg-white/[.05] hover:text-white/80 md:flex">
          <Monitor className="h-3.5 w-3.5 text-[#C44DFF]/70" />
          <span>Global Operations</span>
          <ChevronDown className="h-3 w-3 text-white/30" />
        </button>

        {/* Environment badge */}
        <div className="hidden items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 md:flex">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
            Production
          </span>
        </div>

        {/* Separator */}
        <div className="mx-2 hidden h-6 w-px bg-white/[.05] md:block" />

        {/* Realtime indicator */}
        <div className="hidden items-center gap-2 rounded-lg px-2.5 py-1.5 md:flex">
          {realtimeEnabled ? (
            <>
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <span className="text-[11px] font-medium text-emerald-400/80">Live</span>
            </>
          ) : (
            <>
              <WifiOff className="h-3.5 w-3.5 text-white/30" />
              <span className="text-[11px] font-medium text-white/30">Offline</span>
            </>
          )}
        </div>

        {/* Separator */}
        <div className="mx-1 hidden h-6 w-px bg-white/[.05] md:block" />

        {/* Notifications */}
        <button className="relative rounded-lg p-2 text-white/40 transition-colors hover:bg-white/[.05] hover:text-white/70">
          <Bell className="h-[18px] w-[18px]" />
          {notificationCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#C44DFF] px-1 text-[9px] font-bold text-white shadow-lg shadow-[#C44DFF]/30"
            >
              {notificationCount}
            </motion.span>
          )}
        </button>

        {/* Messages */}
        <button className="rounded-lg p-2 text-white/40 transition-colors hover:bg-white/[.05] hover:text-white/70">
          <MessageSquare className="h-[18px] w-[18px]" />
        </button>

        {/* Separator */}
        <div className="mx-1 hidden h-6 w-px bg-white/[.05] md:block" />

        {/* Time display */}
        <div className="hidden items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-white/40 md:flex">
          <span className="font-mono tabular-nums">
            {time ? format(time, 'HH:mm:ss') : '--:--:--'}
          </span>
          <span className="text-[10px] text-white/25">
            {time ? format(time, 'MMM dd') : ''}
          </span>
        </div>

        {/* Region */}
        <button className="hidden items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-white/40 transition-colors hover:bg-white/[.05] hover:text-white/70 md:flex">
          <Globe className="h-3.5 w-3.5" />
          <span>US-EAST-1</span>
        </button>

        {/* Separator */}
        <div className="mx-1 hidden h-6 w-px bg-white/[.05] md:block" />

        {/* Profile avatar */}
        <button className="group relative">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#C44DFF] to-[#7B2FBE] p-[2px] transition-shadow group-hover:shadow-lg group-hover:shadow-[#C44DFF]/20">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-[#130B2C]">
              <span className="text-xs font-bold text-white/90">SF</span>
            </div>
          </div>
        </button>
      </div>
    </header>
  );
}
