import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Check,
  ChevronDown,
  FileText,
  FolderCheck,
  Menu,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react';
import { APP_CONFIG } from '../config/appConfig';
import { ScopeGuardLogo } from '../components/BrandMark';
import { StatusBadge } from '../components/StatusBadge';

type PreviewScenario = 'out' | 'in' | 'unclear';

const PREVIEW_SCENARIOS: Record<
  PreviewScenario,
  {
    client: string;
    message: string;
    verdict: 'Out of Scope' | 'In Scope' | 'Unclear';
    matched: string;
    reason: string;
    hours: number;
    price: number;
    primaryBtn: string;
  }
> = {
  out: {
    client: 'Elena Vance · Meridian Logistics',
    message: 'Can we also add Stripe subscriptions and a dark mode?',
    verdict: 'Out of Scope',
    matched: 'Embeddable Light-Theme Chat Widget',
    reason:
      'Recurring Stripe billing webhooks and a dual-theme dark mode token system are excluded from the signed Statement of Work.',
    hours: 18,
    price: 2700,
    primaryBtn: 'Send Change Order ($2,700)',
  },
  in: {
    client: 'Marcus Chen · Lumina Health',
    message: 'Can we update the hero headline copy and swap the 3 feature icons before Friday?',
    verdict: 'In Scope',
    matched: 'Responsive Marketing Landing Page & Copy Integration',
    reason:
      'Copy updates and icon swaps on existing landing sections fall inside your contracted two-round revision allowance.',
    hours: 0,
    price: 0,
    primaryBtn: 'Add to Task List',
  },
  unclear: {
    client: 'Priya Nair · Northstar Capital',
    message: 'The onboarding screen feels dense — can we rethink the layout and make the flow snappier?',
    verdict: 'Unclear',
    matched: 'Client Onboarding Flow UI',
    reason:
      'Needs acceptance criteria: minor spacing polish is included, whereas restructuring page architecture requires a Change Order.',
    hours: 6,
    price: 900,
    primaryBtn: 'Review & Estimate (6 hrs)',
  },
};

const FAQ_ITEMS = [
  {
    q: 'Does my client see ScopeGuard branding in their portal?',
    a: 'No. Every client portal is 100% white-labeled with your agency name, uploaded logo, and brand color. Clients interact with your studio directly via their unique magic link without creating an account.',
  },
  {
    q: 'How does the AI Scope Guard avoid awkward client conversations?',
    a: 'Clients never see "out of scope" alarms when they submit a request. They see a polite confirmation ("Received, your agency will review it"), while your team gets an objective contract comparison and a ready-to-send Change Order.',
  },
  {
    q: 'What contract formats can I upload during onboarding?',
    a: 'You can drag and drop a PDF Statement of Work or paste raw contract text directly. Within seconds, ScopeGuard extracts milestones, deliverables, and required client assets into an editable checklist.',
  },
  {
    q: 'Are the pricing plans final?',
    a: 'No — the Starter and Agency tiers shown below are placeholder plans for this frontend preview. You can configure your own hourly rate and Stripe/PayPal payment links inside Agency Settings.',
  },
];

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeScenario, setActiveScenario] = useState<PreviewScenario>('out');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const scenario = PREVIEW_SCENARIOS[activeScenario];

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Top Navigation Bar — 3-Zone Contract */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xs border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          <Link to="/" aria-label={APP_CONFIG.APP_NAME}>
            <ScopeGuardLogo size="md" />
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a
              href="#problem"
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
            >
              Problem
            </a>
            <a
              href="#how-it-works"
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
            >
              How It Works
            </a>
            <a
              href="#pricing"
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
            >
              Pricing
            </a>
            <a
              href="#faq"
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
            >
              FAQ
            </a>
          </nav>

          <div className="hidden md:flex items-center shrink-0">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors whitespace-nowrap shrink-0"
            >
              <span>Open Dashboard</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="md:hidden inline-flex items-center justify-center rounded-lg p-2 text-slate-600 hover:bg-slate-100 min-h-[44px] min-w-[44px]"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-2">
            <a
              href="#problem"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Problem
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              How It Works
            </a>
            <a
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Pricing
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              FAQ
            </a>
            <div className="pt-2 flex flex-col gap-2">
              <Link
                to="/dashboard"
                className="w-full text-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
              >
                Open Dashboard
              </Link>
              <Link
                to="/login"
                className="w-full text-center rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Sign In
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="lg:col-span-6 space-y-6"
            >
              <p className="text-sm font-semibold text-indigo-600">
                Built for Web Agencies, AI Studios &amp; Independent Consultants
              </p>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-[54px] font-bold tracking-tight text-slate-900 leading-[1.1] text-balance">
                Stop giving free work. Let AI guard your project scope.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                Turn signed contracts into structured deliverables, collect missing client assets in
                a white-label portal, and catch out-of-scope requests before they eat your margin.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors shadow-xs whitespace-nowrap"
                >
                  <span>Start Protecting Projects</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap"
                >
                  <span>Try Live Agency Demo</span>
                </Link>
                <Link
                  to="/portal/veloce-ai-support"
                  className="inline-flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-700 px-3 py-2 whitespace-nowrap"
                >
                  Preview Client Portal
                </Link>
              </div>

              <div className="pt-4 border-t border-slate-200 grid grid-cols-3 gap-4 max-w-lg">
                <div>
                  <div className="font-mono text-lg sm:text-xl font-semibold text-slate-900 tabular-nums">
                    $4,200+
                  </div>
                  <div className="text-xs text-slate-500">Avg. scope recovered / quarter</div>
                </div>
                <div>
                  <div className="font-mono text-lg sm:text-xl font-semibold text-slate-900 tabular-nums">
                    90 sec
                  </div>
                  <div className="text-xs text-slate-500">Contract to client portal</div>
                </div>
                <div>
                  <div className="font-mono text-lg sm:text-xl font-semibold text-slate-900 tabular-nums">
                    100%
                  </div>
                  <div className="text-xs text-slate-500">White-label client view</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.08 }}
              className="lg:col-span-6"
            >
              <div className="relative rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                <img
                  src="/assets/aistudio/SaaS_dashboard_on_laptop_screen_2e983b40_716e7dbf.jpg"
                  alt="ScopeGuard projects dashboard showing live progress and scope alerts"
                  referrerPolicy="no-referrer"
                  className="w-full aspect-4/3 object-cover rounded-xl"
                />
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <img
                      src="/assets/aistudio/Shield_protecting_project_timeline_f45bf712_79a45cc8.jpg"
                      alt="Shield protecting project timeline"
                      referrerPolicy="no-referrer"
                      className="h-12 w-12 rounded-lg object-cover shrink-0 border border-slate-200"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-900 truncate">
                        Contract Boundary Active
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        3 requests checked today
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50/70 p-3">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-rose-900 truncate">
                        Stripe + Dark Mode Ask
                      </p>
                      <p className="text-xs text-rose-700 font-mono tabular-nums">
                        Est. 18 hrs · $2,700
                      </p>
                    </div>
                    <StatusBadge label="Out of Scope" size="sm" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section id="problem" className="py-16 sm:py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <p className="text-sm font-semibold text-indigo-600 mb-2">The Agency Margin Leak</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 text-balance">
              Scattered onboarding and quiet scope creep cost agencies 22% of project profit.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* Before */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden flex flex-col">
              <div className="aspect-16/10 w-full overflow-hidden bg-slate-900">
                <img
                  src="/assets/aistudio/Freelancer_overwhelmed_at_desk_0ea0b813_91459b71.jpg"
                  alt="Overwhelmed agency founder buried in urgent messages and overdue invoices"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <h3 className="font-display text-xl font-bold text-slate-900">
                      Without ScopeGuard
                    </h3>
                    <StatusBadge label="At Risk" tone="red" />
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    Kickoffs stall while you chase logos over email. Mid-sprint, a client asks for
                    &ldquo;one quick extra feature&rdquo; in Slack—and you build it for free to keep
                    the peace.
                  </p>
                </div>
                <ul className="space-y-2.5 text-sm text-slate-700 border-t border-slate-200 pt-4">
                  <li className="flex items-start gap-2.5">
                    <X className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>Brand kits, DNS logins, and API keys buried in 14 email threads</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <X className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>No shared checklist showing what was actually signed in the SOW</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <X className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>Awkward pricing conversations delayed until after work is done</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* After */}
            <div className="rounded-2xl border border-indigo-200 bg-white overflow-hidden flex flex-col shadow-xs">
              <div className="aspect-16/10 w-full overflow-hidden bg-slate-100">
                <img
                  src="/assets/aistudio/Freelancer_smiling_at_organized___219a60c1_402d09f5.jpg"
                  alt="Organized agency lead reviewing clear project checklist and 85% completion"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <h3 className="font-display text-xl font-bold text-slate-900">
                      With {APP_CONFIG.APP_NAME}
                    </h3>
                    <StatusBadge label="In Scope" tone="green" />
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    Clients get a branded portal on day one with every milestone, asset upload slot,
                    and request channel—while AI checks every ask against your signed contract.
                  </p>
                </div>
                <ul className="space-y-2.5 text-sm text-slate-700 border-t border-slate-200 pt-4">
                  <li className="flex items-start gap-2.5">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Clients upload logos, copy, and credentials directly into one checklist</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>AI flags out-of-scope asks with exact contract clauses &amp; hour estimates</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>One-click Change Orders with your Stripe or PayPal link built in</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works in 4 Steps */}
      <section id="how-it-works" className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <p className="text-sm font-semibold text-indigo-600 mb-2">How It Works</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 text-balance">
              From signed PDF to protected delivery in four steps.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01. Upload Contract',
                title: 'Drop in your PDF or SOW text',
                desc: 'Upload any client agreement or paste scope bullets when kicking off a new project.',
                img: '/assets/aistudio/Contract_uploaded_to_AI_analysis_d7702b67_1cb52585.jpg',
                alt: 'Service agreement dragged to AI contract analyzer',
              },
              {
                step: '02. AI Extracts Deliverables',
                title: 'Editable milestones & asset list',
                desc: 'AI structures deliverables, timeline milestones, and required client files you can fine-tune.',
                img: '/assets/aistudio/Document_turning_into_checklist_04bfee53_d9cd519b.jpg',
                alt: 'Contract document turning into milestone checklist',
              },
              {
                step: '03. White-Label Portal',
                title: 'Share one magic link with clients',
                desc: 'Your client sees your agency logo and brand color—to track progress, upload assets, and send requests.',
                img: '/assets/aistudio/Character_waving_beside_dashboar__8966d99e_c1640b98.jpg',
                alt: 'Client uploading assets in white-label portal',
              },
              {
                step: '04. Scope Guard & Pay',
                title: 'Turn scope creep into paid orders',
                desc: 'Out-of-scope requests trigger an AI estimate so you can issue a Change Order in one click.',
                img: '/assets/aistudio/Warning_shield_with_message_invoice_45e2dc33_ec1bdb3e.jpg',
                alt: 'Scope warning shield generating a paid invoice',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="rounded-2xl border border-slate-200 bg-white overflow-hidden flex flex-col"
              >
                <div className="aspect-square w-full overflow-hidden bg-slate-100 border-b border-slate-100">
                  <img
                    src={item.img}
                    alt={item.alt}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <p className="text-xs font-semibold text-indigo-600 mb-1.5">{item.step}</p>
                  <h3 className="font-display text-lg font-bold text-slate-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Scope Guard Alert Showcase + Features */}
      <section className="py-16 sm:py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            <div className="lg:col-span-5 space-y-6">
              <p className="text-sm font-semibold text-indigo-600">AI Scope Guard in Action</p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 text-balance">
                Every client message checked against your contract.
              </h2>
              <p className="text-base text-slate-600 leading-relaxed">
                Click a scenario below to preview how ScopeGuard classifies incoming requests and
                prepares your team&rsquo;s next move.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3.5 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <FileText className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      Clause-Matched Verdicts
                    </h3>
                    <p className="text-xs text-slate-600 mt-1">
                      Pinpoints the closest contracted deliverable so you never have to dig through
                      old PDFs.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3.5 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <FolderCheck className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      Centralized Asset Collection
                    </h3>
                    <p className="text-xs text-slate-600 mt-1">
                      Track logos, DNS access, and API keys per project with instant client uploads.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3.5 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <ShieldCheck className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      Goodwill Override Control
                    </h3>
                    <p className="text-xs text-slate-600 mt-1">
                      Want to include a small extra for a great client? Click &ldquo;Mark as Included
                      Anyway&rdquo; in one tap.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sample Screenshot-Style Scope Guard Alert Mockup */}
            <div className="lg:col-span-7">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200">
                  <div>
                    <p className="text-xs font-medium text-slate-500">Interactive Alert Preview</p>
                    <p className="text-sm font-semibold text-slate-900">
                      Scope Guard Analysis Panel
                    </p>
                  </div>
                  <div className="flex items-center gap-1 rounded-lg bg-slate-200/70 p-1">
                    {(
                      [
                        { id: 'out', label: 'Out of Scope' },
                        { id: 'in', label: 'In Scope' },
                        { id: 'unclear', label: 'Unclear' },
                      ] as const
                    ).map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveScenario(tab.id)}
                        className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                          activeScenario === tab.id
                            ? 'bg-white text-slate-900 shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mockup Inner Card */}
                <div className="mt-4 rounded-xl border border-slate-200 bg-white p-5 sm:p-6 space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs text-slate-500">{scenario.client}</p>
                      <p className="text-base font-medium text-slate-900 mt-1">
                        &ldquo;{scenario.message}&rdquo;
                      </p>
                    </div>
                    <StatusBadge label={scenario.verdict} size="md" />
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700">
                      <Sparkles className="h-4 w-4" />
                      <span>AI Scope Assessment</span>
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed">{scenario.reason}</p>
                    <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <span className="text-slate-500">
                        Closest Contract Deliverable:{' '}
                        <strong className="text-slate-800">{scenario.matched}</strong>
                      </span>
                    </div>
                  </div>

                  {scenario.verdict !== 'In Scope' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-lg border border-slate-200 p-3">
                        <p className="text-xs text-slate-500">Suggested Effort</p>
                        <p className="font-mono text-lg font-semibold text-slate-900 tabular-nums mt-0.5">
                          {scenario.hours} hrs
                        </p>
                      </div>
                      <div className="rounded-lg border border-slate-200 p-3">
                        <p className="text-xs text-slate-500">Change Order Price</p>
                        <p className="font-mono text-lg font-semibold text-slate-900 tabular-nums mt-0.5">
                          ${scenario.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <Link
                        to="/projects/veloce-ai-support/requests/req-v1"
                        className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-indigo-700 transition-colors whitespace-nowrap"
                      >
                        <ShieldAlert className="h-4 w-4" />
                        <span>{scenario.primaryBtn}</span>
                      </Link>
                      <Link
                        to="/projects/veloce-ai-support/requests/req-v1"
                        className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap"
                      >
                        Mark as Included Anyway
                      </Link>
                    </div>
                    <span className="text-xs text-slate-400">Live in Agency Demo</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-slate-200 bg-white p-3">
                <img
                  src="/assets/aistudio/Portraits_of_business_owners_aad9f8e4_80b0f7fd.jpg"
                  alt="Agency founders and studio leads using ScopeGuard"
                  referrerPolicy="no-referrer"
                  className="w-full aspect-4/3 object-cover rounded-xl"
                />
              </div>
            </div>
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
                <p className="text-xs font-semibold text-emerald-700 font-mono tabular-nums">
                  +$6,400 Change Orders Paid in 60 Days
                </p>
                <p className="text-sm text-slate-700 leading-relaxed">
                  &ldquo;Before ScopeGuard, our team absorbed at least 15 hours of unbilled requests
                  per AI build. Having a white-label portal made Change Orders feel completely
                  standard to clients.&rdquo;
                </p>
                <div className="pt-2 border-t border-slate-100">
                  <p className="text-sm font-semibold text-slate-900">Daniel Brooks</p>
                  <p className="text-xs text-slate-500">Founder, Northbridge Digital</p>
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
                <p className="text-xs font-semibold text-indigo-700 font-mono tabular-nums">
                  4.5 Hours Saved Per Client Kickoff
                </p>
                <p className="text-sm text-slate-700 leading-relaxed">
                  &ldquo;Uploading the SOW generates the asset checklist in seconds. Clients actually
                  upload their logos and DNS keys before week one ends.&rdquo;
                </p>
                <div className="pt-2 border-t border-slate-100">
                  <p className="text-sm font-semibold text-slate-900">Amara Okafor</p>
                  <p className="text-xs text-slate-500">Managing Partner, Studio Kinetix</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section (Two Placeholder Plans) */}
      <section id="pricing" className="py-16 sm:py-24 bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <p className="text-sm font-semibold text-indigo-600 mb-2">Simple Agency Pricing</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 text-balance">
              One recovered change order pays for the entire year.
            </h2>
            <div className="mt-4 inline-flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3.5 py-2 text-xs font-medium text-amber-800">
              <span>
                Placeholder pricing shown for preview — exact limits and rates are illustrative.
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* Starter Plan */}
            <div className="rounded-2xl border border-slate-200 bg-white p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-display text-xl font-bold text-slate-900">Starter</h3>
                  <span className="text-xs font-medium text-slate-500">Placeholder Plan</span>
                </div>
                <p className="text-sm text-slate-600 mt-1">
                  For solo freelancers and boutique consultants.
                </p>
                <div className="mt-6 flex items-baseline gap-1.5">
                  <span className="font-display text-4xl font-bold text-slate-900 tabular-nums">
                    $49
                  </span>
                  <span className="text-sm text-slate-500">/ month (placeholder)</span>
                </div>
                <ul className="mt-6 space-y-3 text-sm text-slate-700 border-t border-slate-100 pt-6">
                  <li className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Up to 5 active client projects</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>AI Contract Deliverable Extraction</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>AI Scope Guard Request Checks</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Custom Stripe / PayPal Payment Links</span>
                  </li>
                </ul>
              </div>
              <Link
                to="/signup"
                className="mt-8 w-full inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50 transition-colors"
              >
                Start with Starter
              </Link>
            </div>

            {/* Agency Plan */}
            <div className="rounded-2xl border-2 border-indigo-600 bg-slate-50 p-8 flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-display text-xl font-bold text-slate-900">Agency</h3>
                  <span className="text-xs font-semibold text-indigo-700">
                    Most Popular · Placeholder
                  </span>
                </div>
                <p className="text-sm text-slate-600 mt-1">
                  For growing web &amp; AI agencies managing multiple retainers.
                </p>
                <div className="mt-6 flex items-baseline gap-1.5">
                  <span className="font-display text-4xl font-bold text-slate-900 tabular-nums">
                    $129
                  </span>
                  <span className="text-sm text-slate-500">/ month (placeholder)</span>
                </div>
                <ul className="mt-6 space-y-3 text-sm text-slate-700 border-t border-slate-200 pt-6">
                  <li className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-indigo-600 shrink-0" />
                    <span>Unlimited active projects &amp; magic links</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-indigo-600 shrink-0" />
                    <span>100% White-Label Client Portal (logo + brand color)</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-indigo-600 shrink-0" />
                    <span>Automated Change Order Builder &amp; Revenue Tracking</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-indigo-600 shrink-0" />
                    <span>Team seats &amp; priority email notifications</span>
                  </li>
                </ul>
              </div>
              <Link
                to="/signup"
                className="mt-8 w-full inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
              >
                Start with Agency
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-sm font-semibold text-indigo-600 mb-2">FAQ</p>
            <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900">
              Common questions from agency owners
            </h2>
          </div>

          <div className="space-y-3">
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={item.q}
                  className="rounded-xl border border-slate-200 bg-white overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left cursor-pointer hover:bg-slate-50/70 transition-colors"
                  >
                    <span className="text-sm sm:text-base font-semibold text-slate-900">
                      {item.q}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 text-slate-500 shrink-0 transition-transform ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <ScopeGuardLogo size="sm" />
            <span className="text-xs text-slate-500">
              Client onboarding &amp; AI scope protection
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-6 text-xs font-medium text-slate-600">
            <Link to="/dashboard" className="hover:text-slate-900">
              Agency Dashboard
            </Link>
            <Link to="/portal/veloce-ai-support" className="hover:text-slate-900">
              Client Portal Demo
            </Link>
            <Link to="/login" className="hover:text-slate-900">
              Sign In
            </Link>
            <Link to="/signup" className="hover:text-slate-900">
              Create Account
            </Link>
          </div>
          <p className="text-xs text-slate-400">
            &copy; {new Date().getFullYear()} {APP_CONFIG.APP_NAME}. Frontend Demo.
          </p>
        </div>
      </footer>
    </div>
  );
}
