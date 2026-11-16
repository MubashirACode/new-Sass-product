import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  ExternalLink,
  FileCheck2,
  Loader2,
  Mail,
  RefreshCw,
  Send,
  ShieldAlert,
  Sparkles,
  X,
} from 'lucide-react';
import { AgencyLayout } from '../components/AgencyLayout';
import { StatusBadge } from '../components/StatusBadge';
import { useApp } from '../context/AppContext';
import { checkRequest } from '../lib/mockAI.js';

export default function RequestDetailPage() {
  const { projectId, requestId } = useParams<{ projectId: string; requestId: string }>();
  const {
    projects,
    settings,
    updateRequestAnalysis,
    addRequestToTasks,
    sendChangeOrder,
  } = useApp();

  const project = projects.find((p) => p.id === projectId);
  const request = project?.requests.find((r) => r.id === requestId);

  const [hours, setHours] = useState<number>(request?.estimatedHours ?? 0);
  const [price, setPrice] = useState<number>(request?.estimatedPrice ?? 0);
  const [isRechecking, setIsRechecking] = useState(false);

  // Change Order Preview Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [coTitle, setCoTitle] = useState('');
  const [coDesc, setCoDesc] = useState('');
  const [coHours, setCoHours] = useState(18);
  const [coPrice, setCoPrice] = useState(2700);
  const [coPaymentLink, setCoPaymentLink] = useState(settings.paymentLink);
  const [coSentSuccess, setCoSentSuccess] = useState(false);

  useEffect(() => {
    if (request) {
      setHours(request.estimatedHours);
      setPrice(request.estimatedPrice);
    }
  }, [request]);

  if (!project || !request) {
    return (
      <AgencyLayout
        breadcrumbs={[
          { label: 'Dashboard', to: '/dashboard' },
          { label: 'Request Not Found' },
        ]}
      >
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center space-y-4">
          <h1 className="font-display text-xl font-bold text-slate-900">Request not found</h1>
          <Link
            to="/dashboard"
            className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Return to Dashboard
          </Link>
        </div>
      </AgencyLayout>
    );
  }

  const handleHoursChange = (val: string) => {
    const num = Math.max(0, Number(val) || 0);
    setHours(num);
    const computedPrice = num * settings.hourlyRate;
    setPrice(computedPrice);
    updateRequestAnalysis(project.id, request.id, {
      estimatedHours: num,
      estimatedPrice: computedPrice,
    });
  };

  const handlePriceChange = (val: string) => {
    const num = Math.max(0, Number(val) || 0);
    setPrice(num);
    updateRequestAnalysis(project.id, request.id, {
      estimatedPrice: num,
    });
  };

  const handleRerunCheck = async () => {
    setIsRechecking(true);
    try {
      const result = await checkRequest(
        request.message,
        project.deliverables,
        settings.hourlyRate
      );
      setHours(result.estimatedHours);
      setPrice(result.estimatedPrice);
      updateRequestAnalysis(project.id, request.id, {
        verdict: result.verdict,
        reason: result.reason,
        matchedDeliverable: result.matchedDeliverable,
        estimatedHours: result.estimatedHours,
        estimatedPrice: result.estimatedPrice,
      });
    } finally {
      setIsRechecking(false);
    }
  };

  const openChangeOrderModal = () => {
    const fallbackHours = hours > 0 ? hours : 8;
    const fallbackPrice = price > 0 ? price : fallbackHours * settings.hourlyRate;
    setCoTitle(
      request.message.toLowerCase().includes('stripe')
        ? 'Stripe Recurring Subscriptions & Dark Mode'
        : `Scope Extension: ${
            request.message.length > 48
              ? `${request.message.slice(0, 45)}...`
              : request.message
          }`
    );
    setCoDesc(
      `Additional engineering & design work requested by ${request.senderName}: "${request.message}". ${request.reason}`
    );
    setCoHours(fallbackHours);
    setCoPrice(fallbackPrice);
    setCoPaymentLink(settings.paymentLink);
    setCoSentSuccess(false);
    setModalOpen(true);
  };

  const handleSendChangeOrder = (e: React.FormEvent) => {
    e.preventDefault();
    sendChangeOrder(project.id, {
      requestId: request.id,
      title: coTitle.trim(),
      description: coDesc.trim(),
      hours: coHours,
      price: coPrice,
      paymentLink: coPaymentLink.trim(),
    });
    setCoSentSuccess(true);
  };

  const isHandled = request.actionStatus !== 'Pending Review';

  return (
    <AgencyLayout
      breadcrumbs={[
        { label: 'Dashboard', to: '/dashboard' },
        { label: project.name, to: `/projects/${project.id}?tab=requests` },
        { label: 'Scope Guard Review' },
      ]}
    >
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            to={`/projects/${project.id}?tab=requests`}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to {project.name} Requests</span>
          </Link>

          <Link
            to={`/portal/${project.id}`}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-700"
          >
            <span>View Client Portal</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Client Message & Contract Context */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-medium text-slate-500">Incoming Client Request</p>
                  <h1 className="font-display text-xl font-bold text-slate-900 mt-1">
                    {request.senderName}
                  </h1>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                    <Mail className="h-3.5 w-3.5" />
                    <span>{request.senderEmail}</span>
                    <span>·</span>
                    <span>{request.createdAt}</span>
                  </div>
                </div>
                <StatusBadge label={request.actionStatus} />
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-base font-medium text-slate-900 leading-relaxed">
                  &ldquo;{request.message}&rdquo;
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-2">
                <p className="text-xs font-semibold text-slate-500">
                  Signed Contract Summary ({project.clientName})
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {project.contractSummary}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: AI Scope Guard Panel (Main Feature) */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-6 shadow-xs">
              {/* Panel Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="font-display text-lg font-bold text-slate-900">
                      AI Scope Guard Assessment
                    </h2>
                    <p className="text-xs text-slate-500">
                      Evaluated against {project.deliverables.length} contracted deliverables
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <StatusBadge label={request.verdict} size="md" />
                  <button
                    type="button"
                    onClick={handleRerunCheck}
                    disabled={isRechecking}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 cursor-pointer disabled:opacity-50"
                  >
                    {isRechecking ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <RefreshCw className="h-3.5 w-3.5" />
                    )}
                    <span>{isRechecking ? 'Analyzing...' : 'Re-check'}</span>
                  </button>
                </div>
              </div>

              {/* Reason & Matched Deliverable */}
              {isRechecking ? (
                <div className="rounded-xl border border-indigo-200 bg-indigo-50/70 p-6 flex items-center gap-3">
                  <Loader2 className="h-5 w-5 text-indigo-600 animate-spin shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-indigo-950">
                      Comparing client ask against signed contract deliverables...
                    </p>
                    <p className="text-xs text-indigo-700 mt-0.5">
                      Calculating hours using your ${settings.hourlyRate}/hr agency rate.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xs font-semibold text-slate-500 mb-1.5">
                      Scope Guard Reasoning
                    </h3>
                    <p className="text-sm sm:text-base text-slate-800 leading-relaxed">
                      {request.reason}
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-semibold text-slate-500">
                      Matched / Closest Contract Deliverable
                    </p>
                    <p className="text-sm font-semibold text-slate-900 mt-1">
                      {request.matchedDeliverable || 'No matching deliverable found in SOW'}
                    </p>
                  </div>
                </div>
              )}

              {/* Editable Estimate for Out of Scope or Unclear */}
              {request.verdict !== 'In Scope' && (
                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-5 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        Suggested Change Order Estimate
                      </h3>
                      <p className="text-xs text-slate-500">
                        Calculated at ${settings.hourlyRate}/hr — edit hours or final price freely.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="est-hours"
                        className="block text-xs font-medium text-slate-700 mb-1"
                      >
                        Estimated Hours
                      </label>
                      <div className="relative">
                        <input
                          id="est-hours"
                          type="number"
                          min={0}
                          value={hours}
                          onChange={(e) => handleHoursChange(e.target.value)}
                          className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 pr-12 text-sm font-mono font-semibold tabular-nums text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                          hrs
                        </span>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="est-price"
                        className="block text-xs font-medium text-slate-700 mb-1"
                      >
                        Suggested Price (USD)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-mono text-slate-400">
                          $
                        </span>
                        <input
                          id="est-price"
                          type="number"
                          min={0}
                          value={price}
                          onChange={(e) => handlePriceChange(e.target.value)}
                          className="w-full rounded-lg border border-slate-300 bg-white pl-7 pr-3.5 py-2.5 text-sm font-mono font-semibold tabular-nums text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Status Banner OR Decision Buttons */}
              {isHandled ? (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-emerald-950">
                        Resolved: {request.actionStatus}
                      </p>
                      <p className="text-xs text-emerald-700">
                        {request.actionStatus === 'Change Order Sent'
                          ? 'This Change Order is now live on the client portal for approval & payment.'
                          : 'This request has been added to your project deliverables checklist.'}
                      </p>
                    </div>
                  </div>
                  <Link
                    to={`/projects/${project.id}?tab=${
                      request.actionStatus === 'Change Order Sent'
                        ? 'change-orders'
                        : 'deliverables'
                    }`}
                    className="inline-flex items-center gap-1 rounded-lg bg-white border border-emerald-200 px-3 py-1.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-100/50 whitespace-nowrap self-start sm:self-center"
                  >
                    <span>View in Project</span>
                  </Link>
                </div>
              ) : (
                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-3">
                  {request.verdict === 'In Scope' ? (
                    <>
                      <button
                        type="button"
                        onClick={() => addRequestToTasks(project.id, request.id, false)}
                        className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors cursor-pointer"
                      >
                        <Check className="h-4 w-4" />
                        <span>Add to Task List</span>
                      </button>
                      <button
                        type="button"
                        onClick={openChangeOrderModal}
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        <span>Send Change Order Instead</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={openChangeOrderModal}
                        className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors shadow-xs cursor-pointer"
                      >
                        <ShieldAlert className="h-4 w-4" />
                        <span>
                          Send Change Order (${(price || 0).toLocaleString()})
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => addRequestToTasks(project.id, request.id, true)}
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        <span>Mark as Included Anyway</span>
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Change Order Preview Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="co-modal-title"
        >
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <FileCheck2 className="h-5 w-5 text-indigo-600" />
                <h2 id="co-modal-title" className="font-display text-lg font-bold text-slate-900">
                  {coSentSuccess ? 'Change Order Sent' : 'Change Order Preview'}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 cursor-pointer"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {coSentSuccess ? (
              <div className="p-6 sm:p-8 text-center space-y-5">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-display text-xl font-bold text-slate-900">
                    Change Order Published to Client Portal
                  </h3>
                  <p className="text-sm text-slate-600">
                    <strong>{project.clientName}</strong> can now review &ldquo;{coTitle}&rdquo; and
                    approve &amp; pay{' '}
                    <span className="font-mono font-semibold text-slate-900">
                      ${coPrice.toLocaleString()}
                    </span>{' '}
                    directly in their white-label portal.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <Link
                    to={`/portal/${project.id}`}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>Open Client Portal</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="w-full sm:w-auto rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSendChangeOrder} className="p-6 space-y-4">
                <div>
                  <label htmlFor="co-title" className="block text-xs font-medium text-slate-700 mb-1">
                    Change Order Title
                  </label>
                  <input
                    id="co-title"
                    type="text"
                    required
                    value={coTitle}
                    onChange={(e) => setCoTitle(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="co-desc" className="block text-xs font-medium text-slate-700 mb-1">
                    Scope Description &amp; Acceptance Criteria
                  </label>
                  <textarea
                    id="co-desc"
                    rows={3}
                    required
                    value={coDesc}
                    onChange={(e) => setCoDesc(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="co-hours" className="block text-xs font-medium text-slate-700 mb-1">
                      Hours
                    </label>
                    <input
                      id="co-hours"
                      type="number"
                      min={1}
                      required
                      value={coHours}
                      onChange={(e) => {
                        const h = Math.max(1, Number(e.target.value) || 1);
                        setCoHours(h);
                        setCoPrice(h * settings.hourlyRate);
                      }}
                      className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm font-mono tabular-nums text-slate-900 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="co-price" className="block text-xs font-medium text-slate-700 mb-1">
                      Price (USD)
                    </label>
                    <input
                      id="co-price"
                      type="number"
                      min={1}
                      required
                      value={coPrice}
                      onChange={(e) => setCoPrice(Math.max(1, Number(e.target.value) || 1))}
                      className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm font-mono tabular-nums text-slate-900 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="co-link" className="block text-xs font-medium text-slate-700 mb-1">
                    Payment Link (Stripe, PayPal, or Invoice URL)
                  </label>
                  <input
                    id="co-link"
                    type="url"
                    required
                    value={coPaymentLink}
                    onChange={(e) => setCoPaymentLink(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm font-mono text-slate-700 focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700 cursor-pointer"
                  >
                    <Send className="h-4 w-4" />
                    <span>Send to Client</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </AgencyLayout>
  );
}
