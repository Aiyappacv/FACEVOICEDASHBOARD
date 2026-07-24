'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '@/components/ui/glass-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { cn } from '@/lib/utils';
import { Users, UserPlus, Search, Filter, Mail, Shield, Clock, X } from 'lucide-react';

const users = [
  { id: 1, name: 'Sarah Chen', email: 'sarah.chen@corp.io', role: 'Super Admin', status: 'active', lastActive: '2 min ago', avatar: 'SC' },
  { id: 2, name: 'Marcus Rodriguez', email: 'marcus.r@corp.io', role: 'Security Analyst', status: 'active', lastActive: '5 min ago', avatar: 'MR' },
  { id: 3, name: 'Aisha Patel', email: 'aisha.p@corp.io', role: 'Compliance Officer', status: 'active', lastActive: '12 min ago', avatar: 'AP' },
  { id: 4, name: 'James Wilson', email: 'james.w@corp.io', role: 'Auditor', status: 'active', lastActive: '1 hour ago', avatar: 'JW' },
  { id: 5, name: 'Yuki Tanaka', email: 'yuki.t@corp.io', role: 'Security Analyst', status: 'active', lastActive: '18 min ago', avatar: 'YT' },
  { id: 6, name: 'David Kim', email: 'david.k@corp.io', role: 'API User', status: 'active', lastActive: '30 min ago', avatar: 'DK' },
  { id: 7, name: 'Elena Volkov', email: 'elena.v@corp.io', role: 'Security Analyst', status: 'inactive', lastActive: '3 days ago', avatar: 'EV' },
  { id: 8, name: 'Omar Hassan', email: 'omar.h@corp.io', role: 'Read-Only', status: 'active', lastActive: '45 min ago', avatar: 'OH' },
  { id: 9, name: 'Lisa Chang', email: 'lisa.c@corp.io', role: 'Compliance Officer', status: 'active', lastActive: '10 min ago', avatar: 'LC' },
  { id: 10, name: 'Raj Mehta', email: 'raj.m@corp.io', role: 'API User', status: 'active', lastActive: '22 min ago', avatar: 'RM' },
  { id: 11, name: 'Anna Schmidt', email: 'anna.s@corp.io', role: 'Auditor', status: 'inactive', lastActive: '1 week ago', avatar: 'AS' },
  { id: 12, name: 'Carlos Mendez', email: 'carlos.m@corp.io', role: 'Security Analyst', status: 'active', lastActive: '8 min ago', avatar: 'CM' },
  { id: 13, name: 'Fatima Al-Rashid', email: 'fatima.a@corp.io', role: 'Super Admin', status: 'active', lastActive: '1 min ago', avatar: 'FA' },
  { id: 14, name: 'Tom Bradley', email: 'tom.b@corp.io', role: 'Read-Only', status: 'active', lastActive: '2 hours ago', avatar: 'TB' },
  { id: 15, name: 'Mei Lin', email: 'mei.l@corp.io', role: 'API User', status: 'active', lastActive: '35 min ago', avatar: 'ML' },
];

const roles = ['All', 'Super Admin', 'Security Analyst', 'Compliance Officer', 'Auditor', 'API User', 'Read-Only'];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function UsersPage() {
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState<number | null>(null);
  const [search, setSearch] = useState('');

  const filtered = users.filter((u) => {
    if (filter !== 'All' && u.role !== filter) return false;
    if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const selectedUser = users.find((u) => u.id === selected);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0015] via-[#120025] to-[#0a0015] p-6">
      <motion.div variants={container} initial="hidden" animate="show" className="max-w-7xl mx-auto space-y-6">
        <motion.div variants={item} className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/20">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">User Management</h1>
              <p className="text-sm text-purple-300/60">{users.length} registered users</p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-violet-500 text-white text-sm font-medium hover:opacity-90 transition-opacity">
            <UserPlus className="w-4 h-4" /> Invite User
          </button>
        </motion.div>

        <motion.div variants={item} className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-300/40" />
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-white text-sm placeholder:text-purple-300/30 focus:outline-none focus:border-purple-500/40"
            />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {roles.map((r) => (
              <button
                key={r}
                onClick={() => setFilter(r)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                  filter === r
                    ? 'bg-purple-500/30 text-white border border-purple-500/40'
                    : 'bg-purple-500/5 text-purple-300/50 border border-transparent hover:bg-purple-500/10'
                )}
              >
                {r}
              </button>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-2">
          {filtered.map((u, i) => (
            <motion.div key={u.id} variants={item}>
              <GlassCard
                className={cn('p-4 cursor-pointer transition-all hover:border-purple-500/30', selected === u.id && 'ring-1 ring-purple-500/50')}
                onClick={() => setSelected(selected === u.id ? null : u.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
                    {u.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white">{u.name}</span>
                      <StatusBadge label={u.status} variant={u.status === 'active' ? 'success' : 'danger'} />
                    </div>
                    <p className="text-xs text-purple-300/40 truncate">{u.email}</p>
                  </div>
                  <span className={cn(
                    'px-2.5 py-1 rounded-lg text-xs font-medium shrink-0',
                    u.role === 'Super Admin' && 'bg-red-500/10 text-red-400 border border-red-500/20',
                    u.role === 'Security Analyst' && 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
                    u.role === 'Compliance Officer' && 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
                    u.role === 'Auditor' && 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
                    u.role === 'API User' && 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
                    u.role === 'Read-Only' && 'bg-gray-500/10 text-gray-400 border border-gray-500/20',
                  )}>
                    {u.role}
                  </span>
                  <span className="text-xs text-purple-300/30 shrink-0 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {u.lastActive}
                  </span>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {selectedUser && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-6 right-6 w-80"
            >
              <GlassCard className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-white">User Details</h3>
                  <button onClick={() => setSelected(null)} className="text-purple-300/40 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center text-white font-bold">
                    {selectedUser.avatar}
                  </div>
                  <div>
                    <p className="font-medium text-white">{selectedUser.name}</p>
                    <p className="text-xs text-purple-300/50">{selectedUser.email}</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-purple-300/50">Role</span><span className="text-white">{selectedUser.role}</span></div>
                  <div className="flex justify-between"><span className="text-purple-300/50">Status</span><StatusBadge label={selectedUser.status} variant={selectedUser.status === 'active' ? 'success' : 'danger'} /></div>
                  <div className="flex justify-between"><span className="text-purple-300/50">Last Active</span><span className="text-white/70">{selectedUser.lastActive}</span></div>
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
