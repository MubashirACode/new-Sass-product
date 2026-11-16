import React, { useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  CheckCircle2,
  Clock,
  CreditCard,
  ExternalLink,
  FileCheck2,
  Loader2,
  Send,
  UploadCloud,
  X,
} from 'lucide-react';
import { AgencyLogoMark } from '../components/BrandMark';
import { StatusBadge } from '../components/StatusBadge';
import { calculateProjectProgress, useApp } from '../context/AppContext';
import { checkRequest } from '../lib/mockAI.js';
import { ChangeOrder, ClientRequest } from '../types';

function getClientFriendlyRequestStatus(req: ClientRequest): {
  label: string;
  tone: 'green' | 'amber' | 'indigo' | 'slate';
} {
  if (req.actionStatus === 'Added to Tasks') {
    return { label: 'Added to Project', tone: 'green' };
  }
  if (req.actionStatus === 'Included Anyway') {
    return { label: 'Included in Scope', tone: 'green' };
  }
  if (req.actionStatus === 'Change Order Sent') {
    return { label: 'Change Order Sent', tone: 'indigo' };
  }
  return { label: 'Under Agency Review', tone: 'amber' };
}

export default function ClientPortalPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const {
    projects,
    settings,
    uploadClientAsset,
    submitClientRequest,
    markChangeOrderPaid,
  } = useApp();

  const project = projects.find((p) => p.id === projectId);

  // Asset upload simulation state (assetId -> progress 0..100)
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [activeAssetId, setActiveAssetId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Send request box state
  const [requestText, setRequestText] = useState('');
  const [isSendingRequest, setIsSendingRequest] = useState(false);
  const [requestConfirmation, setRequestConfirmation] = useState(false);

  // Mock payment checkout modal state
  const [payingOrder, setPayingOrder] = useState<ChangeOrder | null>(null);
  const [paymentDone, setPaymentDone] = useState(false);

  if (!project) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full rounded-2xl border border-slate-200 bg-white p-8 text-center space-y-4">
          <AgencyLogoMark settings={settings} size={44} />
          <h1 className="font-display text-xl font-bold text-slate-900">
            Project Portal Not Found
          </h1>
          <p className="text-sm text-slate-600">
            Please double-check the portal link provided by {settings.agencyName}.
          </p>
        </div>
      </div>
    );
  }

  const brandColor = settings.brandColor || '#4F46E5';
  const progress = calculateProjectProgress(project);
  const visibleChangeOrders = project.changeOrders.filter(
    (co) => co.status === 'Sent' || co.status === 'Paid'
  );

  const triggerAssetUpload = (assetId: string) => {
    setActiveAssetId(assetId);
    fileInputRef.current?.click();
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeAssetId) return;
    const targetAssetId = activeAssetId;
    e.target.value = '';

    // Smooth mock upload progress animation
    setUploadProgress((prev) => ({ ...prev, [targetAssetId]: 15 }));
    let current = 15;
    const interval = setInterval(() => {
      current += 25;
      if (current >= 100) {
        clearInterval(interval);
        setUploadProgress((prev) => {
          const next = { ...prev };
          delete next[targetAssetId];
          return next;
        });
        uploadClientAsset(project.id, targetAssetId, file.name);
      } else {
        setUploadProgress((prev) => ({ ...prev, [targetAssetId]: current }));
      }
    }, 180);
  };

  const handleSendRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestText.trim()) return;
    setIsSendingRequest(true);
    setRequestConfirmation(false);

    try {
      const analysis = await checkRequest(
        requestText.trim(),
        project.deliverables,
        settings.hourlyRate
      );
      submitClientRequest(project.id, {
        senderName: project.clientName,
        senderEmail: project.clientEmail,
        message: requestText.trim(),
        verdict: analysis.verdict,
        reason: analysis.reason,
        matchedDeliverable: analysis.matchedDeliverable,
        estimatedHours: analysis.estimatedHours,
        estimatedPrice: analysis.estimatedPrice,
      });
      setRequestText('');
      setRequestConfirmation(true);
    } finally {
      setIsSendingRequest(false);
    }
  };

  const handleConfirmPayment = () => {
    if (!payingOrder) return;
    markChangeOrderPaid(project.id, payingOrder.id);
    setPaymentDone(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Hidden shared file input for client asset uploads */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileSelected}
      />

      {/* White-Label Header (Shows ONLY Agency Branding) */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-xs border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <AgencyLogoMark settings={settings} size={36} />
            <span className="font-display text-base sm:text-lg font-bold tracking-tight text-slate-900 truncate">
              {settings.agencyName}
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="hidden sm:inline text-xs text-slate-500">
              Client Workspace · {project.clientName}
            </span>
            <Link
              to={`/projects/${project.id}`}
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 whitespace-nowrap"
            >
              Agency View
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Welcome Banner with Agency Brand Color */}
        <section
          className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs relative overflow-hidden"
          style={{ borderTopWidth: '4px', borderTopColor: brandColor }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <p className="text-xs font-semibold" style={{ color: brandColor }}>
                Welcome, {project.clientName}
              </p>
              <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                {project.name}
              </h1>
              <p className="text-sm text-slate-600 max-w-2xl">
                Track project milestones, upload onboarding files, and send requests directly to
                your {settings.agencyName} team.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 min-w-[200px]">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-medium text-slate-600">Live Progress</span>
                <span className="font-mono font-bold text-slate-900 tabular-nums">
                  {progress}%
                </span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{ width: `${progress}%`, backgroundColor: brandColor }}
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-2 tabular-nums">
                {project.deliverables.filter((d) => d.status === 'Done').length} of{' '}
                {project.deliverables.length} deliverables completed
              </p>
            </div>
          </div>
        </section>

        {/* Change Orders Section (Prominent when agency has sent one) */}
        {visibleChangeOrders.length > 0 && (
          <section className="space-y-3">
            <h2 className="font-display text-lg font-bold text-slate-900">
              Additional Scope &amp; Change Orders
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {visibleChangeOrders.map((co) => (
                <div
                  key={co.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-xs"
                >
                  <div className="space-y-1.5 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <FileCheck2 className="h-5 w-5 shrink-0" style={{ color: brandColor }} />
                      <h3 className="font-display text-base sm:text-lg font-bold text-slate-900">
                        {co.title}
                      </h3>
                      <StatusBadge
                        label={co.status === 'Paid' ? 'Paid' : 'Awaiting Approval'}
                        tone={co.status === 'Paid' ? 'green' : 'amber'}
                      />
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">{co.description}</p>
                    <p className="text-xs text-slate-500 font-mono tabular-nums">
                      Estimated effort: {co.hours} hrs · Issued {co.createdAt}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row md:flex-col items-stretch sm:items-center md:items-end gap-3 shrink-0">
                    <div className="font-display text-2xl font-bold text-slate-900 tabular-nums">
                      ${co.price.toLocaleString()}
                    </div>
                    {co.status === 'Paid' ? (
                      <span className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-2 text-xs font-semibold text-emerald-700">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Approved &amp; Paid</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setPayingOrder(co);
                          setPaymentDone(false);
                        }}
                        style={{ backgroundColor: brandColor }}
                        className="inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white hover:opacity-95 transition-opacity cursor-pointer whitespace-nowrap shadow-xs"
                      >
                        <CreditCard className="h-4 w-4" />
                        <span>Approve and Pay</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Milestones Timeline + Required Assets Upload Checklist */}
          <div className="lg:col-span-7 space-y-8">
            {/* Milestone Timeline */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 space-y-4">
              <h2 className="font-display text-lg font-bold text-slate-900">
                Milestone Timeline
              </h2>
              <div className="space-y-3">
                {project.milestones.map((ms, idx) => (
                  <div
                    key={ms.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 p-3.5"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-mono font-semibold"
                        style={
                          ms.status === 'Completed'
                            ? { backgroundColor: '#DCFCE7', color: '#15803D' }
                            : ms.status === 'In progress'
                              ? { backgroundColor: `${brandColor}18`, color: brandColor }
                              : { backgroundColor: '#F1F5F9', color: '#475569' }
                        }
                      >
                        {idx + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">{ms.title}</p>
                        <p className="text-xs text-slate-500">Target: {ms.dueDate}</p>
                      </div>
                    </div>
                    <StatusBadge label={ms.status} />
                  </div>
                ))}
              </div>
            </section>

            {/* Assets Checklist (Interactive Mock Upload with Progress Bar) */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h2 className="font-display text-lg font-bold text-slate-900">
                    Onboarding Assets Checklist
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Upload requested files so {settings.agencyName} can keep delivery on schedule.
                  </p>
                </div>
                <span className="font-mono text-xs font-semibold text-slate-700 tabular-nums">
                  {project.assets.filter((a) => a.status === 'Received').length}/
                  {project.assets.length} uploaded
                </span>
              </div>

              <div className="space-y-3">
                {project.assets.map((asset) => {
                  const pct = uploadProgress[asset.id];
                  const isUploading = typeof pct === 'number';

                  return (
                    <div
                      key={asset.id}
                      className="rounded-xl border border-slate-200 p-4 space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-slate-900">{asset.name}</p>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">{asset.description}</p>
                          {asset.fileName && (
                            <p className="text-xs font-mono text-emerald-700 mt-1.5">
                              Uploaded: {asset.fileName}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-center">
                          <StatusBadge label={asset.status} />
                          <button
                            type="button"
                            onClick={() => triggerAssetUpload(asset.id)}
                            disabled={isUploading}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer disabled:opacity-50 whitespace-nowrap"
                          >
                            <UploadCloud className="h-3.5 w-3.5" />
                            <span>{asset.status === 'Received' ? 'Replace' : 'Upload File'}</span>
                          </button>
                        </div>
                      </div>

                      {isUploading && (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[11px] text-slate-500">
                            <span>Uploading asset...</span>
                            <span className="font-mono tabular-nums">{pct}%</span>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-150"
                              style={{ width: `${pct}%`, backgroundColor: brandColor }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          {/* Right Column: Send a Request Box + Requests History */}
          <div className="lg:col-span-5 space-y-6">
            {/* Send a Request or Message */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 space-y-4">
              <div>
                <h2 className="font-display text-lg font-bold text-slate-900">
                  Send a Request or Message
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Need an adjustment or new feature? Send it directly to {settings.agencyName}.
                </p>
              </div>

              <form onSubmit={handleSendRequest} className="space-y-3">
                <textarea
                  rows={4}
                  value={requestText}
                  onChange={(e) => {
                    setRequestText(e.target.value);
                    if (requestConfirmation) setRequestConfirmation(false);
                  }}
                  placeholder="Describe what you'd like updated or added..."
                  className="w-full rounded-xl border border-slate-300 p-3.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />

                {requestConfirmation && (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 flex items-center gap-2.5 text-xs font-medium text-emerald-800">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Received, your agency will review it.</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSendingRequest || !requestText.trim()}
                  style={{ backgroundColor: brandColor }}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white hover:opacity-95 transition-opacity disabled:opacity-60 cursor-pointer"
                >
                  {isSendingRequest ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Sending Message...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Send Request</span>
                    </>
                  )}
                </button>
              </form>
            </section>

            {/* Requests History */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 space-y-4">
              <h2 className="font-display text-base font-bold text-slate-900">
                Requests History
              </h2>

              {project.requests.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-500">
                  No requests submitted yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {project.requests.map((req) => {
                    const statusInfo = getClientFriendlyRequestStatus(req);
                    return (
                      <div
                        key={req.id}
                        className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
                            <Clock className="h-3 w-3" />
                            <span>{req.createdAt}</span>
                          </span>
                          <StatusBadge label={statusInfo.label} tone={statusInfo.tone} />
                        </div>
                        <p className="text-sm text-slate-800 leading-relaxed">
                          &ldquo;{req.message}&rdquo;
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>

      {/* Mock Payment Modal for Change Order */}
      {payingOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <AgencyLogoMark settings={settings} size={28} />
                <span className="font-display font-bold text-slate-900">
                  {settings.agencyName} Checkout
                </span>
              </div>
              <button
                type="button"
                onClick={() => setPayingOrder(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 cursor-pointer"
                aria-label="Close payment modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {paymentDone ? (
              <div className="p-6 sm:p-8 text-center space-y-4">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="font-display text-xl font-bold text-slate-900">
                  Payment Confirmed
                </h3>
                <p className="text-sm text-slate-600">
                  Thank you! &ldquo;{payingOrder.title}&rdquo; has been approved and added to your
                  project deliverables.
                </p>
                <button
                  type="button"
                  onClick={() => setPayingOrder(null)}
                  style={{ backgroundColor: brandColor }}
                  className="w-full rounded-lg px-4 py-2.5 text-sm font-semibold text-white cursor-pointer"
                >
                  Return to Portal
                </button>
              </div>
            ) : (
              <div className="p-6 space-y-5">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-1.5">
                  <p className="text-xs text-slate-500">Approved Change Order</p>
                  <p className="font-display text-base font-bold text-slate-900">
                    {payingOrder.title}
                  </p>
                  <p className="text-xs text-slate-600">{payingOrder.description}</p>
                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                    <span className="text-xs text-slate-500">Total Due</span>
                    <span className="font-mono text-lg font-bold text-slate-900 tabular-nums">
                      ${payingOrder.price.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-500 flex items-center justify-between gap-2">
                  <span className="truncate font-mono">{payingOrder.paymentLink}</span>
                  <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setPayingOrder(null)}
                    className="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmPayment}
                    style={{ backgroundColor: brandColor }}
                    className="flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold text-white hover:opacity-95 cursor-pointer"
                  >
                    Pay ${payingOrder.price.toLocaleString()}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
