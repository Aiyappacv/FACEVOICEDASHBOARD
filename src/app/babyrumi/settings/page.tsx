'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/glass-card';
import { cn } from '@/lib/utils';
import { Settings, Shield, Bell, Key, Database, Save, ToggleLeft, ToggleRight } from 'lucide-react';

const sections = [
  {
    title: 'General',
    icon: Settings,
    settings: [
      { label: 'Platform Name', value: 'SPECTRAFACEVOICE', type: 'text' },
      { label: 'Default Language', value: 'English (US)', type: 'select' },
      { label: 'Time Zone', value: 'UTC-5 (EST)', type: 'select' },
      { label: 'Dark Mode', value: true, type: 'toggle' },
    ],
  },
  {
    title: 'Security',
    icon: Shield,
    settings: [
      { label: 'Two-Factor Authentication', value: true, type: 'toggle' },
      { label: 'Session Timeout', value: '30 minutes', type: 'select' },
      { label: 'IP Whitelisting', value: false, type: 'toggle' },
      { label: 'Rate Limiting', value: true, type: 'toggle' },
      { label: 'Max Login Attempts', value: '5', type: 'text' },
    ],
  },
  {
    title: 'Notifications',
    icon: Bell,
    settings: [
      { label: 'Email Notifications', value: true, type: 'toggle' },
      { label: 'Slack Alerts', value: true, type: 'toggle' },
      { label: 'Fraud Alert Threshold', value: 'High', type: 'select' },
      { label: 'Daily Digest', value: false, type: 'toggle' },
      { label: 'Incident Reports', value: true, type: 'toggle' },
    ],
  },
  {
    title: 'API',
    icon: Key,
    settings: [
      { label: 'API Version', value: 'v2', type: 'select' },
      { label: 'Default Rate Limit', value: '1000 req/min', type: 'text' },
      { label: 'Webhook Retries', value: '3', type: 'text' },
      { label: 'CORS Enabled', value: true, type: 'toggle' },
    ],
  },
  {
    title: 'Data Retention',
    icon: Database,
    settings: [
      { label: 'Audit Log Retention', value: '90 days', type: 'select' },
      { label: 'Biometric Data Retention', value: '365 days', type: 'select' },
      { label: 'Auto-Purge Enabled', value: false, type: 'toggle' },
      { label: 'Backup Frequency', value: 'Daily', type: 'select' },
    ],
  },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

function ToggleSwitch({ enabled }: { enabled: boolean }) {
  const [on, setOn] = useState(enabled);
  return (
    <button onClick={() => setOn(!on)} className="shrink-0">
      {on ? (
        <ToggleRight className="w-8 h-8 text-emerald-400" />
      ) : (
        <ToggleLeft className="w-8 h-8 text-purple-300/30" />
      )}
    </button>
  );
}

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0015] via-[#120025] to-[#0a0015] p-6">
      <motion.div variants={container} initial="hidden" animate="show" className="max-w-4xl mx-auto space-y-6">
        <motion.div variants={item} className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-gray-500/20 to-slate-500/20 border border-gray-500/20">
              <Settings className="w-6 h-6 text-gray-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Platform Settings</h1>
              <p className="text-sm text-purple-300/60">Configure your platform preferences</p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-violet-500 text-white text-sm font-medium hover:opacity-90 transition-opacity">
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </motion.div>

        {sections.map((section) => (
          <motion.div key={section.title} variants={item}>
            <GlassCard className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <section.icon className="w-5 h-5 text-purple-400" />
                <h2 className="text-lg font-semibold text-white">{section.title}</h2>
              </div>
              <div className="space-y-4">
                {section.settings.map((s) => (
                  <div key={s.label} className="flex items-center justify-between py-2 border-b border-purple-500/5 last:border-0">
                    <span className="text-sm text-white/80">{s.label}</span>
                    {s.type === 'toggle' ? (
                      <ToggleSwitch enabled={s.value as boolean} />
                    ) : s.type === 'select' ? (
                      <select className="bg-purple-500/10 border border-purple-500/20 rounded-lg px-3 py-1.5 text-sm text-white/80 focus:outline-none focus:border-purple-500/40">
                        <option>{s.value as string}</option>
                      </select>
                    ) : (
                      <input
                        type="text"
                        defaultValue={s.value as string}
                        className="bg-purple-500/10 border border-purple-500/20 rounded-lg px-3 py-1.5 text-sm text-white/80 w-48 text-right focus:outline-none focus:border-purple-500/40"
                      />
                    )}
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
