import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileText,
  FolderOpen,
  Loader2,
  Plus,
  Send,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { AgencyLayout } from '../components/AgencyLayout';
import { CopyLinkButton } from '../components/CopyLinkButton';
import { StatusBadge } from '../components/StatusBadge';
import {
  calculateProjectProgress,
  getPendingOutOfScopeCount,
  useApp,
} from '../context/AppContext';
import { checkRequest } from '../lib/mockAI.js';
import { DeliverableStatus, MilestoneStatus } from '../types';

type TabKey = 'overview' | 'deliverables' | 'assets' | 'requests' | 'change-orders';

export default function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const {
    projects,
    settings,
    updateDeliverableStatus,
    addDeliverable,
    updateMilestoneStatus,
    addRequiredAsset,
    submitClientRequest,
    markChangeOrderPaid,
    sendDraftChangeOrder,
  } = useApp();

  const project = projects.find((p) => p.id === projectId);
  const initialTab = (searchParams.get('tab') as TabKey) || 'overview';
  const [activeTab, setActiveTab] = useState<TabKey>(initialTab);

  // Add Deliverable inline form
  const [newDelTitle, setNewDelTitle] = useState('');
  const [newDelCategory, setNewDelCategory] = useState('Frontend UI');

  // Add Asset inline form
  const [newAssetName, setNewAssetName] = useState('');
  const [newAssetDesc, setNewAssetDesc] = useState('');

  // Simulate Client Request modal/form
  const [simMessage, setSimMessage] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    const tabParam = searchParams.get('tab') as TabKey | null;
    if (tabParam && ['overview', 'deliverables', 'assets', 'requests', 'change-orders'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  if (!project) {
    return (
      <AgencyLayout breadcrumbs={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Not Found' }]}>
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center space-y-4">
          <h1 className="font-display text-xl font-bold text-slate-900">Project not found</h1>
          <p className="text-sm text-slate-500">
            This project may have been removed or the URL is incorrect.
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Back to Dashboard
          </Link>
        </div>
      </AgencyLayout>
    );
  }

  const progress = calculateProjectProgress(project);
  const pendingOutCount = getPendingOutOfScopeCount(project);
  const receivedAssetsCount = project.assets.filter((a) => a.status === 'Received').length;

  const handleAddDeliverable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDelTitle.trim()) return;
    addDeliverable(project.id, newDelTitle.trim(), newDelCategory);
    setNewDelTitle('');
  };

  const handleAddAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssetName.trim()) return;
    addRequiredAsset(
      project.id,
      newAssetName.trim(),
      newAssetDesc.trim() || 'Requested from client portal.'
    );
    setNewAssetName('');
    setNewAssetDesc('');
  };

  const handleSimulateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!simMessage.trim()) return;
    setIsSimulating(true);
    try {
      const analysis = await checkRequest(simMessage.trim(), project.deliverables, settings.hourlyRate);
      const created = submitClientRequest(project.id, {
        senderName: project.clientName,
        senderEmail: project.clientEmail,
        message: simMessage.trim(),
        verdict: analysis.verdict,
        reason: analysis.reason,
        matchedDeliverable: analysis.matchedDeliverable,
        estimatedHours: analysis.estimatedHours,
        estimatedPrice: analysis.estimatedPrice,
      });
      setSimMessage('');
      navigate(`/projects/${project.id}/requests/${created.id}`);
    } finally {
      setIsSimulating(false);
    }
  };

  const tabs: Array<{ id: TabKey; label: string; count?: number; alert?: boolean }> = [
    { id: 'overview', label: 'Overview' },
    { id: 'deliverables', label: 'Deliverables', count: project.deliverables.length },
    { id: 'assets', label: 'Client Assets', count: project.assets.length },
    {
      id: 'requests',
      label: 'Requests',
      count: project.requests.length,
      alert: pendingOutCount > 0,
    },
    { id: 'change-orders', label: 'Change Orders', count: project.changeOrders.length },
  ];

  return (
    <AgencyLayout
      breadcrumbs={[
        { label: 'Dashboard', to: '/dashboard' },
        { label: project.name },
      ]}
      action={
        <div className="flex items-center gap-2">
          <CopyLinkButton path={`/portal/${project.id}`} label="Copy Client Link" />
          <Link
            to={`/portal/${project.id}`}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs sm:text-sm font-medium text-white hover:bg-indigo-700 transition-colors whitespace-nowrap shrink-0"
          >
            <span>Open Portal</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Project Header Summary */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 space-y-5">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                  {project.name}
                </h1>
                <StatusBadge label={project.status} size="md" />
              </div>
              <p className="text-sm text-slate-500">
                Client: <strong className="text-slate-800">{project.clientName}</strong> ·{' '}
                {project.clientEmail} · Contract Value:{' '}
                <span className="font-mono font-semibold text-slate-800 tabular-nums">
                  ${project.contractValue.toLocaleString()}
                </span>
              </p>
            </div>

            {pendingOutCount > 0 && (
              <button
                type="button"
                onClick={() => handleTabChange('requests')}
                className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs sm:text-sm font-semibold text-rose-700 hover:bg-rose-100 transition-colors self-start cursor-pointer"
              >
                <ShieldAlert className="h-4 w-4 shrink-0" />
                <span>
                  {pendingOutCount} Out-of-Scope Request{pendingOutCount > 1 ? 's' : ''} Need Review
                </span>
              </button>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-medium text-slate-600">Overall Project Progress</span>
              <span className="font-mono font-semibold text-slate-900 tabular-nums">
                {progress}%
              </span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  progress === 100 ? 'bg-emerald-600' : 'bg-indigo-600'
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="border-t border-slate-100 pt-3 -mx-1 flex items-center gap-1.5 overflow-x-auto">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabChange(tab.id)}
                  className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <span>{tab.label}</span>
                  {typeof tab.count === 'number' && (
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[11px] font-mono tabular-nums ${
                        tab.alert
                          ? 'bg-rose-100 text-rose-700 font-semibold'
                          : isActive
                            ? 'bg-indigo-100 text-indigo-800'
                            : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-6">
              {/* Milestones Timeline */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="font-display text-lg font-bold text-slate-900">
                    Milestones Timeline
                  </h2>
                  <span className="text-xs text-slate-500">Click status to update</span>
                </div>

                <div className="space-y-3">
                  {project.milestones.map((ms, index) => (
                    <div
                      key={ms.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-slate-200 p-4"
                    >
                      <div className="flex items-start gap-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-mono font-semibold text-slate-700 mt-0.5">
                          {index + 1}
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{ms.title}</p>
                          <p className="text-xs text-slate-500 mt-0.5">Target: {ms.dueDate}</p>
                        </div>
                      </div>

                      <select
                        value={ms.status}
                        onChange={(e) =>
                          updateMilestoneStatus(
                            project.id,
                            ms.id,
                            e.target.value as MilestoneStatus
                          )
                        }
                        aria-label={`Milestone status for ${ms.title}`}
                        className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 focus:border-indigo-500 focus:outline-none cursor-pointer self-start sm:self-center"
                      >
                        <option value="Upcoming">Upcoming</option>
                        <option value="In progress">In progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contract Summary */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 space-y-2.5">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <FileText className="h-4 w-4 text-indigo-600" />
                  <span>Contract Baseline Summary</span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {project.contractSummary}
                </p>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-6">
              {/* Magic Link Card */}
              <div className="rounded-2xl border border-indigo-200 bg-indigo-50/60 p-5 sm:p-6 space-y-4">
                <div>
                  <h2 className="font-display text-base font-bold text-slate-900">
                    White-Label Client Portal Link
                  </h2>
                  <p className="text-xs text-slate-600 mt-1">
                    Branded for <strong>{settings.agencyName}</strong>. Share directly with{' '}
                    {project.clientName}.
                  </p>
                </div>

                <div className="rounded-lg border border-indigo-200 bg-white px-3 py-2.5 text-xs font-mono text-slate-700 truncate">
                  {`${typeof window !== 'undefined' ? window.location.origin : ''}/portal/${project.id}`}
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <CopyLinkButton
                    path={`/portal/${project.id}`}
                    label="Copy Magic Link"
                    variant="primary"
                  />
                  <Link
                    to={`/portal/${project.id}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    <span>Open Client View</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>

              {/* Snapshot Card */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 space-y-4">
                <h2 className="font-display text-base font-bold text-slate-900">
                  Onboarding &amp; Scope Health
                </h2>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-600">Client Assets Received</span>
                    <span className="font-mono font-semibold text-slate-900 tabular-nums">
                      {receivedAssetsCount} / {project.assets.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-600">Deliverables Completed</span>
                    <span className="font-mono font-semibold text-slate-900 tabular-nums">
                      {project.deliverables.filter((d) => d.status === 'Done').length} /{' '}
                      {project.deliverables.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-slate-600">Pending Out-of-Scope Alerts</span>
                    <span className="font-mono font-semibold text-rose-700 tabular-nums">
                      {pendingOutCount}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Deliverables */}
        {activeTab === 'deliverables' && (
          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-lg font-bold text-slate-900">
                  Deliverables Checklist
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Updating deliverable status automatically updates the client portal progress bar.
                </p>
              </div>
              <span className="font-mono text-xs font-semibold text-slate-700 tabular-nums">
                {progress}% Complete
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {project.deliverables.map((item) => (
                <div
                  key={item.id}
                  className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    {item.status === 'Done' ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <Clock className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
                    )}
                    <div className="min-w-0">
                      <p
                        className={`text-sm font-medium ${
                          item.status === 'Done'
                            ? 'text-slate-500 line-through'
                            : 'text-slate-900'
                        }`}
                      >
                        {item.title}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">{item.category}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                    <StatusBadge label={item.status} />
                    <select
                      value={item.status}
                      onChange={(e) =>
                        updateDeliverableStatus(
                          project.id,
                          item.id,
                          e.target.value as DeliverableStatus
                        )
                      }
                      aria-label={`Deliverable status for ${item.title}`}
                      className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 focus:border-indigo-500 focus:outline-none cursor-pointer"
                    >
                      <option value="Not started">Not started</option>
                      <option value="In progress">In progress</option>
                      <option value="Done">Done</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>

            <form
              onSubmit={handleAddDeliverable}
              className="p-4 sm:px-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row gap-2.5"
            >
              <input
                type="text"
                value={newDelTitle}
                onChange={(e) => setNewDelTitle(e.target.value)}
                placeholder="Add another contracted deliverable..."
                className="flex-1 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none"
              />
              <input
                type="text"
                value={newDelCategory}
                onChange={(e) => setNewDelCategory(e.target.value)}
                placeholder="Category"
                className="sm:w-40 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 cursor-pointer whitespace-nowrap"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Deliverable</span>
              </button>
            </form>
          </div>
        )}

        {/* Tab 3: Client Assets */}
        {activeTab === 'assets' && (
          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-lg font-bold text-slate-900">
                  Required Client Assets
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Files uploaded by the client in their portal automatically mark as Received here.
                </p>
              </div>
              <span className="font-mono text-xs font-semibold text-slate-700 tabular-nums">
                {receivedAssetsCount} of {project.assets.length} received
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {project.assets.map((asset) => (
                <div
                  key={asset.id}
                  className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <FolderOpen className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900">{asset.name}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{asset.description}</p>
                      {asset.fileName && (
                        <p className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-mono text-emerald-700">
                          <span>File: {asset.fileName}</span>
                          {asset.uploadedAt && <span>· {asset.uploadedAt}</span>}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="self-end sm:self-center shrink-0">
                    <StatusBadge label={asset.status} />
                  </div>
                </div>
              ))}
            </div>

            <form
              onSubmit={handleAddAsset}
              className="p-4 sm:px-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row gap-2.5"
            >
              <input
                type="text"
                value={newAssetName}
                onChange={(e) => setNewAssetName(e.target.value)}
                placeholder="Required asset name (e.g., GA4 Property Access)"
                className="sm:w-1/3 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none"
              />
              <input
                type="text"
                value={newAssetDesc}
                onChange={(e) => setNewAssetDesc(e.target.value)}
                placeholder="Short instructions for client..."
                className="flex-1 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 cursor-pointer whitespace-nowrap"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Request Asset</span>
              </button>
            </form>
          </div>
        )}

        {/* Tab 4: Requests */}
        {activeTab === 'requests' && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
              <div className="p-5 sm:p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="font-display text-lg font-bold text-slate-900">
                    Client Requests &amp; Scope Verdicts
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Select any request to inspect the AI Scope Guard reasoning and send a Change Order.
                  </p>
                </div>
              </div>

              {project.requests.length === 0 ? (
                <div className="p-8 text-center text-sm text-slate-500">
                  No client requests yet. Test the Scope Guard AI below or send a message from the
                  Client Portal.
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {project.requests.map((req) => (
                    <Link
                      key={req.id}
                      to={`/projects/${project.id}/requests/${req.id}`}
                      className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
                    >
                      <div className="min-w-0 space-y-1">
                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                          <span className="font-semibold text-slate-800">{req.senderName}</span>
                          <span>·</span>
                          <span>{req.createdAt}</span>
                          <span>·</span>
                          <span className="font-medium text-indigo-600">{req.actionStatus}</span>
                        </div>
                        <p className="text-sm font-medium text-slate-900">
                          &ldquo;{req.message}&rdquo;
                        </p>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                        {req.estimatedPrice > 0 && (
                          <span className="font-mono text-xs font-semibold text-slate-700 tabular-nums">
                            ${req.estimatedPrice.toLocaleString()}
                          </span>
                        )}
                        <StatusBadge label={req.verdict} />
                        <ArrowRight className="h-4 w-4 text-slate-400" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Simulator for Testing AI Scope Guard */}
            <form
              onSubmit={handleSimulateRequest}
              className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 space-y-3"
            >
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <Sparkles className="h-4 w-4 text-indigo-600" />
                <span>Test Incoming Client Request with AI Scope Guard</span>
              </div>
              <p className="text-xs text-slate-500">
                Try pasting &ldquo;Can we also add Stripe subscriptions and a dark mode?&rdquo; or
                &ldquo;Can we update the hero headline copy?&rdquo;
              </p>
              <div className="flex flex-col sm:flex-row gap-2.5">
                <input
                  type="text"
                  value={simMessage}
                  onChange={(e) => setSimMessage(e.target.value)}
                  placeholder="Enter a sample client message..."
                  className="flex-1 rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={isSimulating || !simMessage.trim()}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60 cursor-pointer whitespace-nowrap"
                >
                  {isSimulating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Checking Scope...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Analyze &amp; Open Request</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 5: Change Orders */}
        {activeTab === 'change-orders' && (
          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-slate-200">
              <h2 className="font-display text-lg font-bold text-slate-900">Change Orders</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Approved extras sent to the client portal with instant payment links.
              </p>
            </div>

            {project.changeOrders.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-500">
                No change orders issued for this project yet.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {project.changeOrders.map((co) => (
                  <div
                    key={co.id}
                    className="p-5 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1 max-w-2xl">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <h3 className="text-sm font-bold text-slate-900">{co.title}</h3>
                        <StatusBadge label={co.status} />
                      </div>
                      <p className="text-sm text-slate-600">{co.description}</p>
                      <p className="text-xs text-slate-400">
                        Created {co.createdAt}
                        {co.paidAt ? ` · Paid ${co.paidAt}` : ''}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 shrink-0">
                      <div className="text-right">
                        <div className="font-mono text-base font-bold text-slate-900 tabular-nums">
                          ${co.price.toLocaleString()}
                        </div>
                        <div className="font-mono text-xs text-slate-500 tabular-nums">
                          {co.hours} hrs
                        </div>
                      </div>

                      {co.status === 'Draft' && (
                        <button
                          type="button"
                          onClick={() => sendDraftChangeOrder(project.id, co.id)}
                          className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-700 cursor-pointer"
                        >
                          Send to Client
                        </button>
                      )}
                      {co.status === 'Sent' && (
                        <button
                          type="button"
                          onClick={() => markChangeOrderPaid(project.id, co.id)}
                          className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 cursor-pointer"
                        >
                          Mark as Paid
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </AgencyLayout>
  );
}
