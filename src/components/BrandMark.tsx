import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { APP_CONFIG } from '../config/appConfig';
import { AgencySettings } from '../types';

export function ScopeGuardLogo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const iconSize = size === 'sm' ? 'h-7 w-7 rounded-lg' : size === 'lg' ? 'h-10 w-10 rounded-xl' : 'h-8 w-8 rounded-lg';
  const textSize = size === 'sm' ? 'text-base' : size === 'lg' ? 'text-xl' : 'text-lg';

  return (
    <span className="inline-flex items-center gap-2.5 whitespace-nowrap shrink-0">
      <span
        className={`inline-flex items-center justify-center bg-indigo-600 text-white shadow-xs ${iconSize}`}
      >
        <ShieldCheck className={size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-5 w-5' : 'h-4.5 w-4.5'} />
      </span>
      <span className={`font-display font-bold tracking-tight text-slate-900 ${textSize}`}>
        {APP_CONFIG.APP_NAME}
      </span>
    </span>
  );
}

const PRESET_COLORS: Record<AgencySettings['logoPresetId'], string> = {
  'indigo-knot': '#4F46E5',
  'teal-knot': '#0D9488',
  'amber-knot': '#EA580C',
  'emerald-knot': '#16A34A',
};

export function AgencyLogoMark({
  settings,
  size = 36,
}: {
  settings: AgencySettings;
  size?: number;
}) {
  if (settings.logoUrl) {
    return (
      <img
        src={settings.logoUrl}
        alt={`${settings.agencyName} logo`}
        referrerPolicy="no-referrer"
        style={{ width: size, height: size }}
        className="rounded-xl object-cover border border-slate-200 bg-white shrink-0"
      />
    );
  }

  const fill = settings.brandColor || PRESET_COLORS[settings.logoPresetId] || '#4F46E5';

  return (
    <span
      style={{ width: size, height: size, backgroundColor: `${fill}14`, borderColor: `${fill}33` }}
      className="inline-flex items-center justify-center rounded-xl border shrink-0"
      aria-hidden="true"
    >
      <svg
        width={Math.round(size * 0.62)}
        height={Math.round(size * 0.62)}
        viewBox="0 0 32 32"
        fill="none"
      >
        <path
          d="M10.5 6.5L16 3.5L21.5 6.5L26.5 11.5L23.5 17L26.5 22.5L21.5 27.5L16 24.5L10.5 27.5L5.5 22.5L8.5 17L5.5 11.5L10.5 6.5Z"
          stroke={fill}
          strokeWidth="3.2"
          strokeLinejoin="round"
        />
        <path
          d="M11.5 11.5L20.5 20.5M20.5 11.5L11.5 20.5"
          stroke={fill}
          strokeWidth="2.6"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}
