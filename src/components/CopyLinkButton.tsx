import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface CopyLinkButtonProps {
  path: string;
  label?: string;
  variant?: 'secondary' | 'primary';
  className?: string;
}

export function CopyLinkButton({
  path,
  label = 'Copy Client Link',
  variant = 'secondary',
  className = '',
}: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const fullUrl =
      typeof window !== 'undefined' ? `${window.location.origin}${path}` : path;
    try {
      await navigator.clipboard.writeText(fullUrl);
    } catch {
      // Fallback for restricted clipboard environments
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const baseStyles =
    variant === 'primary'
      ? 'bg-indigo-600 text-white hover:bg-indigo-700 border-transparent'
      : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200';

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${baseStyles} ${className}`}
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5 text-emerald-500" />
          <span>Copied Link</span>
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
}
