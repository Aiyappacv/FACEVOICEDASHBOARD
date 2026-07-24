'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/glass-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { ProgressRing } from '@/components/ui/progress-ring';
import { cn } from '@/lib/utils';
import { Shield, Users, Lock, CheckCircle, XCircle, Eye, Edit3 } from 'lucide-react';

const roles = [
  { name: 'Super Admin', desc: 'Full platform access and configuration', users: 2, permissions: 42, color: 'from-red-500 to-rose-600', icon: Shield },
  { name: 'Security Analyst', desc: 'Monitor threats, review alerts, manage incidents', users: 5, permissions: 28, color: 'from-blue-500 to-indigo-600', icon: Eye },
  { name: 'Compliance Officer', desc: 'Manage compliance policies and audit trails', users: 2, permissions: 22, color: 'from-amber-500 to-orange-600', icon: Lock },
  { name: 'Auditor', desc: 'View-only access to logs and reports', users: 2, permissions: 15, color: 'from-purple-500 to-violet-600', icon: Edit3 },
  { name: 'API User', desc: 'API-only access with rate limits', users: 3, permissions: 12, color: 'from-emerald-500 to-teal-600', icon: Users },
  { name: 'Read-Only', desc: 'View-only dashboard access', users: 2, permissions: 8, color: 'from-gray-500 to-slate-600', icon: Eye },
];

const permissions = [
  { module: 'Dashboard', actions: ['view', 'edit', 'delete', 'export'] },
  { module: 'Face Recognition', actions: ['enroll', 'verify', 'delete', 'view'] },
  { module: 'Voice Recognition', actions: ['enroll', 'verify', 'delete', 'view'] },
  { module: 'Fraud Analytics', actions: ['view', 'investigate', 'resolve', 'export'] },
  { module: 'MLOps', actions: ['view', 'deploy', 'rollback', 'configure'] },
  { module: 'System Settings', actions: ['view', 'edit', 'admin'] },
  { module: 'User Management', actions: ['view', 'invite', 'edit', 'deactivate'] },
  { module: 'API Keys', actions: ['view', 'create', 'revoke'] },
  { module: 'Audit Logs', actions: ['view', 'export'] },
  { module: 'Reports', actions: ['view', 'create', 'schedule', 'export'] },
];

const rolePermissions: Record<string, string[]> = {
  'Super Admin': ['view', 'edit', 'delete', 'export', 'enroll', 'verify', 'investigate', 'resolve', 'deploy', 'rollback', 'configure', 'admin', 'invite', 'deactivate', 'create', 'revoke', 'schedule'],
  'Security Analyst': ['view', 'verify', 'investigate', 'resolve', 'export', 'enroll', 'invite'],
  'Compliance Officer': ['view', 'export', 'resolve', 'create', 'schedule', 'investigate'],
  'Auditor': ['view', 'export'],
  'API User': ['view', 'enroll', 'verify'],
  'Read-Only': ['view'],
};

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function RolesPage() {
  const [selectedRole, setSelectedRole] = useState('Super Admin');

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0015] via-[#120025] to-[#0a0015] p-6">
      <motion.div variants={container} initial="hidden" animate="show" className="max-w-7xl mx-auto space-y-6">
        <motion.div variants={item} className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/20">
            <Shield className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Roles & Permissions</h1>
            <p className="text-sm text-purple-300/60">{roles.length} roles configured</p>
          </div>
        </motion.div>

        <motion.div variants={item} className="grid grid-cols-3 gap-4">
          {roles.map((r) => (
            <GlassCard
              key={r.name}
              className={cn('p-5 cursor-pointer transition-all', selectedRole === r.name && 'ring-1 ring-purple-500/50')}
              onClick={() => setSelectedRole(r.name)}
            >
              <div className="flex items-start gap-3 mb-3">
                <div className={cn('w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center', r.color)}>
                  <r.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{r.name}</h3>
                  <p className="text-xs text-purple-300/40 mt-0.5">{r.desc}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-center">
                  <p className="text-lg font-bold text-white">{r.users}</p>
                  <p className="text-[10px] text-purple-300/40 uppercase">Users</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-white">{r.permissions}</p>
                  <p className="text-[10px] text-purple-300/40 uppercase">Permissions</p>
                </div>
              </div>
            </GlassCard>
          ))}
        </motion.div>

        <motion.div variants={item}>
          <h2 className="text-lg font-semibold text-white mb-3">Permissions Matrix — {selectedRole}</h2>
          <GlassCard className="p-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-purple-500/10">
                  <th className="text-left py-2 text-purple-300/50 font-medium">Module</th>
                  {permissions[0].actions.map((a) => (
                    <th key={a} className="text-center py-2 text-purple-300/50 font-medium capitalize px-4">{a}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {permissions.map((p) => (
                  <tr key={p.module} className="border-b border-purple-500/5 hover:bg-purple-500/5">
                    <td className="py-2.5 text-white/80">{p.module}</td>
                    {p.actions.map((a) => {
                      const allowed = rolePermissions[selectedRole]?.includes(a);
                      return (
                        <td key={a} className="text-center py-2.5 px-4">
                          {allowed ? (
                            <CheckCircle className="w-4 h-4 text-emerald-400 mx-auto" />
                          ) : (
                            <XCircle className="w-4 h-4 text-purple-500/20 mx-auto" />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </GlassCard>
        </motion.div>
      </motion.div>
    </div>
  );
}
