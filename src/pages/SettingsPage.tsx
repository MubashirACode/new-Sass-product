import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, ExternalLink, RotateCcw, Upload } from 'lucide-react';
import { AgencyLayout } from '../components/AgencyLayout';
import { AgencyLogoMark } from '../components/BrandMark';
import { useApp } from '../context/AppContext';
import { AgencySettings } from '../types';

const COLOR_SWATCHES = [
  { label: 'Indigo', hex: '#4F46E5' },
  { label: 'Teal', hex: '#0D9488' },
  { label: 'Cobalt', hex: '#2563EB' },
  { label: 'Emerald', hex: '#059669' },
  { label: 'Slate', hex: '#0F172A' },
  { label: 'Orange', hex: '#EA580C' },
];

const LOGO_PRESETS: Array<{ id: AgencySettings['logoPresetId']; label: string }> = [
  { id: 'indigo-knot', label: 'Indigo Mark' },
  { id: 'teal-knot', label: 'Teal Mark' },
  { id: 'amber-knot', label: 'Amber Mark' },
  { id: 'emerald-knot', label: 'Emerald Mark' },
];

export default function SettingsPage() {
  const { settings, updateSettings, resetDemoData } = useApp();
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<AgencySettings>(settings);
  const [saved, setSaved] = useState(false);
  const [resetMessage, setResetMessage] = useState(false);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setForm((prev) => ({ ...prev, logoUrl: reader.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = () => {
    resetDemoData();
    setResetMessage(true);
    setTimeout(() => setResetMessage(false), 2500);
  };

  return (
    <AgencyLayout
      breadcrumbs={[
        { label: 'Dashboard', to: '/dashboard' },
        { label: 'Agency Settings' },
      ]}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Agency &amp; White-Label Settings
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Customize how your agency appears inside every client portal and change order.
            </p>
          </div>
          <Link
            to="/portal/veloce-ai-support"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 self-start sm:self-auto"
          >
            <span>Preview White-Label Portal</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* White-Label Identity Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="font-display text-lg font-bold text-slate-900">
                Client Portal Branding
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Clients only see your agency name, logo, and brand color — never ScopeGuard.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="agency-name"
                  className="block text-sm font-medium text-slate-700 mb-1.5"
                >
                  Agency Name
                </label>
                <input
                  id="agency-name"
                  type="text"
                  required
                  value={form.agencyName}
                  onChange={(e) => setForm({ ...form, agencyName: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label
                  htmlFor="brand-color"
                  className="block text-sm font-medium text-slate-700 mb-1.5"
                >
                  Brand Primary Color
                </label>
                <div className="flex items-center gap-2.5">
                  <input
                    id="brand-color"
                    type="color"
                    value={form.brandColor}
                    onChange={(e) => setForm({ ...form, brandColor: e.target.value })}
                    className="h-10 w-12 rounded-lg border border-slate-300 bg-white p-1 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={form.brandColor}
                    onChange={(e) => setForm({ ...form, brandColor: e.target.value })}
                    className="w-32 rounded-lg border border-slate-300 px-3 py-2 text-sm font-mono text-slate-800 focus:border-indigo-500 focus:outline-none"
                  />
                  <div className="flex items-center gap-1.5">
                    {COLOR_SWATCHES.map((swatch) => (
                      <button
                        key={swatch.hex}
                        type="button"
                        title={swatch.label}
                        onClick={() => setForm({ ...form, brandColor: swatch.hex })}
                        style={{ backgroundColor: swatch.hex }}
                        className={`h-6 w-6 rounded-full cursor-pointer border-2 transition-transform ${
                          form.brandColor.toLowerCase() === swatch.hex.toLowerCase()
                            ? 'border-slate-900 scale-110'
                            : 'border-white'
                        }`}
                        aria-label={`Select ${swatch.label} color`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Logo Upload & Presets */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <label className="block text-sm font-medium text-slate-700">Agency Logo</label>
              <div className="flex flex-wrap items-center gap-4">
                <AgencyLogoMark settings={form} size={52} />

                <div className="flex flex-wrap items-center gap-2.5">
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleLogoUpload}
                  />
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    <span>Upload Custom Logo</span>
                  </button>
                  {form.logoUrl && (
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, logoUrl: '' })}
                      className="rounded-lg px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 cursor-pointer"
                    >
                      Remove Image
                    </button>
                  )}
                </div>

                {!form.logoUrl && (
                  <div className="flex items-center gap-2 ml-auto">
                    <span className="text-xs text-slate-400">Presets:</span>
                    {LOGO_PRESETS.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setForm({ ...form, logoPresetId: p.id })}
                        className={`rounded-lg px-2.5 py-1.5 text-xs font-medium border cursor-pointer ${
                          form.logoPresetId === p.id
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Live White-Label Portal Header Preview */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">
              <p className="text-xs font-medium text-slate-500">Live Client Portal Header Preview</p>
              <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <AgencyLogoMark settings={form} size={34} />
                  <span className="font-display font-bold text-slate-900 text-sm sm:text-base">
                    {form.agencyName || 'Your Agency'}
                  </span>
                </div>
                <span
                  style={{ backgroundColor: form.brandColor }}
                  className="rounded-lg px-3 py-1.5 text-xs font-semibold text-white whitespace-nowrap"
                >
                  Client Portal Accent
                </span>
              </div>
            </div>
          </div>

          {/* Billing & Notifications */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-5">
            <h2 className="font-display text-lg font-bold text-slate-900">
              Pricing, Payments &amp; Notifications
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label
                  htmlFor="hourly-rate"
                  className="block text-sm font-medium text-slate-700 mb-1.5"
                >
                  Default Hourly Rate (USD)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-mono text-slate-400">
                    $
                  </span>
                  <input
                    id="hourly-rate"
                    type="number"
                    min={1}
                    required
                    value={form.hourlyRate}
                    onChange={(e) =>
                      setForm({ ...form, hourlyRate: Math.max(1, Number(e.target.value) || 1) })
                    }
                    className="w-full rounded-lg border border-slate-300 pl-8 pr-12 py-2.5 text-sm font-mono tabular-nums text-slate-900 focus:border-indigo-500 focus:outline-none"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                    / hr
                  </span>
                </div>
              </div>

              <div>
                <label
                  htmlFor="notif-email"
                  className="block text-sm font-medium text-slate-700 mb-1.5"
                >
                  Notification Email
                </label>
                <input
                  id="notif-email"
                  type="email"
                  required
                  value={form.notificationEmail}
                  onChange={(e) => setForm({ ...form, notificationEmail: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="payment-link"
                  className="block text-sm font-medium text-slate-700 mb-1.5"
                >
                  Default Change Order Payment Link (Stripe, PayPal, or Custom URL)
                </label>
                <input
                  id="payment-link"
                  type="url"
                  required
                  value={form.paymentLink}
                  onChange={(e) => setForm({ ...form, paymentLink: e.target.value })}
                  placeholder="https://buy.stripe.com/..."
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm font-mono text-slate-700 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>{resetMessage ? 'Demo Data Restored' : 'Reset Demo Data'}</span>
              </button>

              <div className="flex items-center gap-3">
                {saved && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                    <Check className="h-4 w-4" />
                    <span>Settings saved</span>
                  </span>
                )}
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors cursor-pointer"
                >
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </AgencyLayout>
  );
}
