import React from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  FileCheck2,
  HelpCircle,
  ShieldAlert,
} from 'lucide-react';

export type BadgeTone = 'green' | 'red' | 'amber' | 'slate' | 'indigo';

interface StatusBadgeProps {
  label: string;
  tone?: BadgeTone;
  size?: 'sm' | 'md';
  showIcon?: boolean;
}

const TONE_MAP: Record<string, BadgeTone> = {
  'In Scope': 'green',
  Done: 'green',
  Received: 'green',
  Paid: 'green',
  Completed: 'green',
  'Added to Tasks': 'green',
  'Out of Scope': 'red',
  'At Risk': 'red',
  Unclear: 'amber',
  Pending: 'amber',
  'Pending Review': 'amber',
  'In progress': 'amber',
  'In Progress': 'indigo',
  Sent: 'amber',
  'Change Order Sent': 'indigo',
  Onboarding: 'amber',
  'Not started': 'slate',
  Upcoming: 'slate',
  Draft: 'slate',
  'Included Anyway': 'slate',
};

const STYLES: Record<BadgeTone, string> = {
  green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  red: 'bg-rose-50 text-rose-700 border-rose-200',
  amber: 'bg-amber-50 text-amber-800 border-amber-200',
  indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  slate: 'bg-slate-100 text-slate-700 border-slate-200',
};

export function StatusBadge({
  label,
  tone,
  size = 'sm',
  showIcon = true,
}: StatusBadgeProps) {
  const resolvedTone = tone || TONE_MAP[label] || 'slate';

  const IconComponent =
    resolvedTone === 'green'
      ? CheckCircle2
      : resolvedTone === 'red'
        ? label === 'Out of Scope'
          ? ShieldAlert
          : AlertCircle
        : resolvedTone === 'amber'
          ? label === 'Unclear'
            ? HelpCircle
            : Clock
          : resolvedTone === 'indigo'
            ? FileCheck2
            : Clock;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium whitespace-nowrap shrink-0 ${
        size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-xs'
      } ${STYLES[resolvedTone]}`}
    >
      {showIcon && <IconComponent className="h-3.5 w-3.5 shrink-0" />}
      <span>{label}</span>
    </span>
  );
}
