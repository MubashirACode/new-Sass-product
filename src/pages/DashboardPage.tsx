import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  DollarSign,
  ExternalLink,
  FileCheck2,
  FolderKanban,
  Plus,
  Search,
  ShieldAlert,
} from 'lucide-react';
import { AgencyLayout } from '../components/AgencyLayout';
import { CopyLinkButton } from '../components/CopyLinkButton';
import { StatusBadge } from '../components/StatusBadge';
import {
  calculateProjectProgress,
  getPendingOutOfScopeCount,
  useApp,
} from '../context/AppContext';
import { ProjectStatus } from '../types';

const STATUS_FILTERS: Array<'All' | ProjectStatus> = [
  'All',
  'At Risk',
  'In Progress',
  'Onboarding',
  'Completed',
];

export default function DashboardPage() {
  const { projects, settings } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | ProjectStatus>('All');

  const stats = useMemo(() => {
    const activeProjects = projects.filter((p) => p.status !== 'Completed').length;
    const pendingOutOfScope = projects.reduce(
      (acc, p) => acc + getPendingOutOfScopeCount(p),
      0
    );
    const allOrders = projects.flatMap((p) => p.changeOrders);
    const changeOrdersSent = allOrders.filter(
      (o) => o.status === 'Sent' || o.status === 'Paid'
    ).length;
    const extraRevenueRecovered = allOrders
      .filter((o) => o.status === 'Paid')
      .reduce((acc, o) => acc + o.price, 0);

    return {
      activeProjects,
      pendingOutOfScope,
      changeOrdersSent,
      extraRevenueRecovered,
    };
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
      const q = search.trim().toLowerCase();
      const matchesQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.clientName.toLowerCase().includes(q) ||
        p.clientEmail.toLowerCase().includes(q);
      return matchesStatus && matchesQuery;
    });
  }, [projects, search, statusFilter]);

  const pendingRequests = useMemo(() => {
    return projects
      .flatMap((p) =>
        p.requests
          .filter((r) => r.actionStatus === 'Pending Review')
          .map((r) => ({ ...r, projectName: p.name, clientName: p.clientName }))
      )
      .slice(0, 6);
  }, [projects]);

  return (
    <AgencyLayout
      breadcrumbs={[{ label: 'Agency Dashboard' }]}
      action={
        <Link
          to="/projects/new"
          className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs sm:text-sm font-medium text-white hover:bg-indigo-700 transition-colors whitespace-nowrap shrink-0 shadow-xs"
        >
          <Plus className="h-4 w-4" />
          <span>New Project</span>
        </Link>
      }
    >
      <div className="space-y-8">
        {/* Page Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              {settings.agencyName} Overview
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Monitor active client onboarding, deliverable progress, and incoming scope alerts.
            </p>
          </div>
          <Link
            to="/portal/veloce-ai-support"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-indigo-600 hover:text-indigo-700 whitespace-nowrap self-start sm:self-auto"
          >
            <span>Preview White-Label Client Portal</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* 4 KPI Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-slate-500">Active Projects</span>
              <FolderKanban className="h-4 w-4 text-indigo-600" />
            </div>
            <div className="mt-3 font-display text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums">
              {stats.activeProjects}
            </div>
            <p className="mt-1 text-xs text-slate-500 tabular-nums">
              {projects.length} total projects in workspace
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-slate-500">
                Pending Out-of-Scope
              </span>
              <ShieldAlert className="h-4 w-4 text-rose-600" />
            </div>
            <div className="mt-3 flex items-baseline gap-2.5">
              <span className="font-display text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums">
                {stats.pendingOutOfScope}
              </span>
              {stats.pendingOutOfScope > 0 && (
                <StatusBadge label="Needs Review" tone="red" size="sm" />
              )}
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Flagged requests awaiting change order
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-slate-500">Change Orders Sent</span>
              <FileCheck2 className="h-4 w-4 text-amber-600" />
            </div>
            <div className="mt-3 font-display text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums">
              {stats.changeOrdersSent}
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Issued across active client portals
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-slate-500">
                Extra Revenue Recovered
              </span>
              <DollarSign className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="mt-3 font-display text-2xl sm:text-3xl font-bold text-emerald-700 tabular-nums">
              ${stats.extraRevenueRecovered.toLocaleString()}
            </div>
            <p className="mt-1 text-xs text-slate-500">Paid via approved change orders</p>
          </div>
        </div>

        {/* Projects Section: Filters & Grid */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 rounded-lg bg-slate-200/60 p-1">
              {STATUS_FILTERS.map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setStatusFilter(status)}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    statusFilter === status
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-72">
              <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search project or client..."
                className="w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          {filteredProjects.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center space-y-3">
              <p className="text-base font-semibold text-slate-900">
                No projects match your current filter
              </p>
              <p className="text-sm text-slate-500">
                Adjust your search query or create a new client project from a contract.
              </p>
              <div className="pt-2 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSearch('');
                    setStatusFilter('All');
                  }}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Reset Filters
                </button>
                <Link
                  to="/projects/new"
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700"
                >
                  New Project
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredProjects.map((project) => {
                const progress = calculateProjectProgress(project);
                const pendingOut = getPendingOutOfScopeCount(project);
                const receivedAssets = project.assets.filter(
                  (a) => a.status === 'Received'
                ).length;

                return (
                  <div
                    key={project.id}
                    className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 flex flex-col justify-between gap-5 hover:border-slate-300 transition-colors"
                  >
                    <div className="space-y-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <Link
                            to={`/projects/${project.id}`}
                            className="font-display text-lg font-bold text-slate-900 hover:text-indigo-600 transition-colors block truncate"
                          >
                            {project.name}
                          </Link>
                          <p className="text-sm text-slate-500 mt-0.5 truncate">
                            {project.clientName} · {project.clientEmail}
                          </p>
                        </div>
                        <StatusBadge label={project.status} />
                      </div>

                      {/* Progress Bar */}
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className="font-medium text-slate-600">
                            Deliverable Completion
                          </span>
                          <span className="font-mono font-semibold text-slate-900 tabular-nums">
                            {progress}%
                          </span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              progress === 100 ? 'bg-emerald-600' : 'bg-indigo-600'
                            }`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Metadata & Pending Out-of-Scope Red Badge */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs text-slate-600">
                        <div className="flex items-center gap-2 tabular-nums">
                          <span>
                            {project.deliverables.length} deliverables
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>
                            {receivedAssets}/{project.assets.length} assets
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono">
                            ${project.contractValue.toLocaleString()}
                          </span>
                        </div>

                        {pendingOut > 0 && (
                          <Link
                            to={`/projects/${project.id}?tab=requests`}
                            className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition-colors whitespace-nowrap"
                          >
                            <ShieldAlert className="h-3.5 w-3.5" />
                            <span>
                              {pendingOut} Pending Out-of-Scope
                            </span>
                          </Link>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-4 border-t border-slate-100">
                      <CopyLinkButton
                        path={`/portal/${project.id}`}
                        label="Copy Client Link"
                      />
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/portal/${project.id}`}
                          className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 whitespace-nowrap"
                        >
                          Portal
                        </Link>
                        <Link
                          to={`/projects/${project.id}`}
                          className="inline-flex items-center gap-1 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-medium text-white hover:bg-slate-800 transition-colors whitespace-nowrap"
                        >
                          <span>Manage</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Pending Requests Queue */}
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
          <div className="px-5 py-4 sm:px-6 border-b border-slate-200 flex items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-base sm:text-lg font-bold text-slate-900">
                Requests Awaiting Review
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Click any client message to open the AI Scope Guard panel and respond.
              </p>
            </div>
            <span className="font-mono text-xs font-medium text-slate-500 tabular-nums">
              {pendingRequests.length} pending
            </span>
          </div>

          {pendingRequests.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-500">
              All incoming client requests have been triaged.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {pendingRequests.map((req) => (
                <Link
                  key={req.id}
                  to={`/projects/${req.projectId}/requests/${req.id}`}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 sm:px-6 hover:bg-slate-50 transition-colors"
                >
                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-semibold text-indigo-600">
                        {req.clientName}
                      </span>
                      <span className="text-xs text-slate-400">·</span>
                      <span className="text-xs text-slate-500 truncate">
                        {req.projectName}
                      </span>
                      <span className="text-xs text-slate-400">·</span>
                      <span className="text-xs text-slate-400">{req.createdAt}</span>
                    </div>
                    <p className="text-sm font-medium text-slate-900 line-clamp-1">
                      &ldquo;{req.message}&rdquo;
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {req.estimatedPrice > 0 && (
                      <span className="font-mono text-xs font-semibold text-slate-700 tabular-nums">
                        Est. ${req.estimatedPrice.toLocaleString()}
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
      </div>
    </AgencyLayout>
  );
}
