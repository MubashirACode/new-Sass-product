import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ExternalLink,
  FileUp,
  Loader2,
  Plus,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { AgencyLayout } from '../components/AgencyLayout';
import { CopyLinkButton } from '../components/CopyLinkButton';
import { useApp } from '../context/AppContext';
import { SAMPLE_CONTRACT_TEXT } from '../data/mockData';
import { analyzeContract } from '../lib/mockAI.js';
import { ClientAsset, Deliverable, Milestone, Project } from '../types';

export default function NewProjectPage() {
  const { createProject } = useApp();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1 state
  const [projectName, setProjectName] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [contractValue, setContractValue] = useState('12000');
  const [step1Error, setStep1Error] = useState('');

  // Step 2 state
  const [contractText, setContractText] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [step2Error, setStep2Error] = useState('');

  // Step 3 state (editable AI results)
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [deliverables, setDeliverables] = useState<Deliverable[]>([]);
  const [assets, setAssets] = useState<ClientAsset[]>([]);

  // Step 4 state (created project magic link)
  const [createdProject, setCreatedProject] = useState<Project | null>(null);

  const handleStep1Next = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim() || !clientName.trim() || !clientEmail.includes('@')) {
      setStep1Error('Please complete project name, client name, and a valid client email.');
      return;
    }
    setStep1Error('');
    setStep(2);
  };

  const handleFilePicked = async (file: File) => {
    setUploadedFileName(file.name);
    setStep2Error('');
    if (file.type === 'text/plain' || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
      const content = await file.text();
      setContractText(content);
    } else {
      // Simulate extracting text from PDF/DOCX cleanly for demo
      setContractText(
        `Uploaded Contract File: ${file.name}\nClient: ${clientName}\nProject: ${projectName}\n\n${SAMPLE_CONTRACT_TEXT}`
      );
    }
  };

  const handleAnalyze = async () => {
    if (!contractText.trim() && !uploadedFileName) {
      setStep2Error('Please upload a contract PDF or paste your Statement of Work text.');
      return;
    }
    setStep2Error('');
    setIsAnalyzing(true);
    try {
      const result = await analyzeContract(contractText || uploadedFileName);
      setMilestones(result.milestones);
      setDeliverables(result.deliverables);
      setAssets(result.requiredAssets);
      setStep(3);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCreateProject = () => {
    const slugBase = projectName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const id = `${slugBase || 'project'}-${Date.now().toString().slice(-4)}`;
    const today = new Date().toISOString().slice(0, 10);

    const newProj: Project = {
      id,
      name: projectName.trim(),
      clientName: clientName.trim(),
      clientEmail: clientEmail.trim(),
      status: 'Onboarding',
      contractValue: Number(contractValue) || 10000,
      createdAt: today,
      contractSummary:
        contractText.trim().slice(0, 260) ||
        `Signed Statement of Work for ${projectName.trim()}.`,
      milestones,
      deliverables,
      assets,
      requests: [],
      changeOrders: [],
    };

    createProject(newProj);
    setCreatedProject(newProj);
    setStep(4);
  };

  return (
    <AgencyLayout
      breadcrumbs={[
        { label: 'Dashboard', to: '/dashboard' },
        { label: 'New Project' },
      ]}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Stepper Header */}
        {step < 4 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
                  Onboard New Client Project
                </h1>
                <p className="text-sm text-slate-500 mt-0.5">
                  Extract deliverables from your contract and generate a white-label client link.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium">
                {[
                  { num: 1, label: 'Details' },
                  { num: 2, label: 'Contract AI' },
                  { num: 3, label: 'Review Scope' },
                ].map((item, idx) => (
                  <React.Fragment key={item.num}>
                    {idx > 0 && <span className="text-slate-300">/</span>}
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 whitespace-nowrap ${
                        step === item.num
                          ? 'bg-indigo-600 text-white'
                          : step > item.num
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {step > item.num ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        <span className="tabular-nums">{item.num}.</span>
                      )}
                      <span>{item.label}</span>
                    </span>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Project & Client Details */}
        {step === 1 && (
          <form
            onSubmit={handleStep1Next}
            className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-5"
          >
            <h2 className="font-display text-lg font-bold text-slate-900">
              Step 1: Project &amp; Client Information
            </h2>

            {step1Error && (
              <div className="rounded-lg border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs text-rose-700">
                {step1Error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2">
                <label htmlFor="proj-name" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Project Name
                </label>
                <input
                  id="proj-name"
                  type="text"
                  required
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="e.g., Horizon AI Onboarding Portal & Web Build"
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label htmlFor="client-name" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Client Company / Name
                </label>
                <input
                  id="client-name"
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g., Horizon BioLabs"
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label htmlFor="client-email" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Client Contact Email
                </label>
                <input
                  id="client-email"
                  type="email"
                  required
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="e.g., jordan@horizonbiolabs.com"
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label htmlFor="contract-value" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Signed Contract Value (USD)
                </label>
                <input
                  id="contract-value"
                  type="number"
                  min={0}
                  value={contractValue}
                  onChange={(e) => setContractValue(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm font-mono tabular-nums text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Cancel</span>
              </Link>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors cursor-pointer"
              >
                <span>Continue to Contract Upload</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </form>
        )}

        {/* Step 2: Upload Contract PDF or Paste Text */}
        {step === 2 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-lg font-bold text-slate-900">
                  Step 2: Upload Contract or Paste Scope Text
                </h2>
                <p className="text-sm text-slate-500 mt-0.5">
                  AI will extract milestones, deliverables, and required client assets.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setContractText(SAMPLE_CONTRACT_TEXT);
                  setUploadedFileName('');
                  setStep2Error('');
                }}
                className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 transition-colors cursor-pointer"
              >
                Load Sample Contract
              </button>
            </div>

            {step2Error && (
              <div className="rounded-lg border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs text-rose-700">
                {step2Error}
              </div>
            )}

            {/* Drag & Drop PDF Zone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                const file = e.dataTransfer.files?.[0];
                if (file) void handleFilePicked(file);
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`rounded-xl border-2 border-dashed p-6 sm:p-8 text-center transition-colors cursor-pointer ${
                isDragging
                  ? 'border-indigo-500 bg-indigo-50/70'
                  : 'border-slate-300 bg-slate-50 hover:border-indigo-400 hover:bg-slate-50/80'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.txt,.md,.doc,.docx"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void handleFilePicked(file);
                }}
              />
              <FileUp className="h-8 w-8 text-indigo-600 mx-auto mb-3" />
              {uploadedFileName ? (
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-emerald-700">
                    Selected: {uploadedFileName}
                  </p>
                  <p className="text-xs text-slate-500">Click or drop another file to replace</p>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-slate-800">
                    Drag &amp; drop a signed contract PDF here, or click to browse
                  </p>
                  <p className="text-xs text-slate-500">
                    Supports PDF, TXT, or pasted Statement of Work below
                  </p>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="contract-text" className="block text-sm font-medium text-slate-700 mb-1.5">
                Or Paste Contract / SOW Clauses
              </label>
              <textarea
                id="contract-text"
                rows={7}
                value={contractText}
                onChange={(e) => setContractText(e.target.value)}
                placeholder="Paste deliverables, exclusions, and timeline clauses from your signed proposal..."
                className="w-full rounded-xl border border-slate-300 p-3.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            {isAnalyzing && (
              <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4 flex items-center gap-3">
                <Loader2 className="h-5 w-5 text-indigo-600 animate-spin shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-indigo-900">
                    Analyzing contract scope with AI...
                  </p>
                  <p className="text-xs text-indigo-700">
                    Extracting deliverables, milestone dates, and required client assets.
                  </p>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                disabled={isAnalyzing}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 cursor-pointer disabled:opacity-50"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors cursor-pointer disabled:opacity-60"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Analyzing Contract...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Analyze with AI</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Editable AI Extraction Result */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-indigo-200 bg-indigo-50/70 p-4 sm:p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-indigo-600 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    AI extracted {milestones.length} milestones, {deliverables.length}{' '}
                    deliverables, and {assets.length} required client assets.
                  </p>
                  <p className="text-xs text-slate-600">
                    Edit, add, or remove any line item before generating your client portal link.
                  </p>
                </div>
              </div>
            </div>

            {/* Editable Milestones */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-display text-base font-bold text-slate-900">
                  1. Project Milestones
                </h3>
                <button
                  type="button"
                  onClick={() =>
                    setMilestones((prev) => [
                      ...prev,
                      {
                        id: `ms-custom-${Date.now()}`,
                        title: 'New Milestone',
                        dueDate: 'Week 4',
                        status: 'Upcoming',
                      },
                    ])
                  }
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Milestone</span>
                </button>
              </div>
              <div className="space-y-2.5">
                {milestones.map((ms) => (
                  <div key={ms.id} className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
                    <input
                      type="text"
                      value={ms.title}
                      onChange={(e) =>
                        setMilestones((prev) =>
                          prev.map((m) => (m.id === ms.id ? { ...m, title: e.target.value } : m))
                        )
                      }
                      className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none"
                    />
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={ms.dueDate}
                        onChange={(e) =>
                          setMilestones((prev) =>
                            prev.map((m) =>
                              m.id === ms.id ? { ...m, dueDate: e.target.value } : m
                            )
                          )
                        }
                        className="w-28 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none"
                        placeholder="Target date"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setMilestones((prev) => prev.filter((m) => m.id !== ms.id))
                        }
                        className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                        aria-label="Delete milestone"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Editable Deliverables */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-display text-base font-bold text-slate-900">
                  2. Contracted Deliverables (Protected Scope Baseline)
                </h3>
                <button
                  type="button"
                  onClick={() =>
                    setDeliverables((prev) => [
                      ...prev,
                      {
                        id: `del-custom-${Date.now()}`,
                        title: 'New Contracted Deliverable',
                        category: 'General',
                        status: 'Not started',
                      },
                    ])
                  }
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Deliverable</span>
                </button>
              </div>
              <div className="space-y-2.5">
                {deliverables.map((del) => (
                  <div key={del.id} className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
                    <input
                      type="text"
                      value={del.title}
                      onChange={(e) =>
                        setDeliverables((prev) =>
                          prev.map((d) => (d.id === del.id ? { ...d, title: e.target.value } : d))
                        )
                      }
                      className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none"
                    />
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={del.category}
                        onChange={(e) =>
                          setDeliverables((prev) =>
                            prev.map((d) =>
                              d.id === del.id ? { ...d, category: e.target.value } : d
                            )
                          )
                        }
                        className="w-36 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none"
                        placeholder="Category"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setDeliverables((prev) => prev.filter((d) => d.id !== del.id))
                        }
                        className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                        aria-label="Delete deliverable"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Editable Required Client Assets */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-display text-base font-bold text-slate-900">
                  3. Required Client Assets
                </h3>
                <button
                  type="button"
                  onClick={() =>
                    setAssets((prev) => [
                      ...prev,
                      {
                        id: `ast-custom-${Date.now()}`,
                        name: 'New Required Asset',
                        description: 'Details for the client upload checklist.',
                        status: 'Pending',
                      },
                    ])
                  }
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Asset</span>
                </button>
              </div>
              <div className="space-y-3">
                {assets.map((ast) => (
                  <div
                    key={ast.id}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-3 flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center"
                  >
                    <input
                      type="text"
                      value={ast.name}
                      onChange={(e) =>
                        setAssets((prev) =>
                          prev.map((a) => (a.id === ast.id ? { ...a, name: e.target.value } : a))
                        )
                      }
                      className="sm:w-1/3 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900 focus:border-indigo-500 focus:outline-none"
                    />
                    <input
                      type="text"
                      value={ast.description}
                      onChange={(e) =>
                        setAssets((prev) =>
                          prev.map((a) =>
                            a.id === ast.id ? { ...a, description: e.target.value } : a
                          )
                        )
                      }
                      className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setAssets((prev) => prev.filter((a) => a.id !== ast.id))}
                      className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 self-end sm:self-center cursor-pointer"
                      aria-label="Delete required asset"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Contract</span>
              </button>
              <button
                type="button"
                onClick={handleCreateProject}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors shadow-xs cursor-pointer"
              >
                <span>Create Project and Generate Client Link</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Generated Magic Link Success Screen */}
        {step === 4 && createdProject && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 text-center space-y-6">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <div className="space-y-2 max-w-lg mx-auto">
              <h2 className="font-display text-2xl font-bold text-slate-900">
                {createdProject.name} is Ready
              </h2>
              <p className="text-sm text-slate-600">
                Share this white-label magic link with <strong>{createdProject.clientName}</strong>.
                No client login required.
              </p>
            </div>

            <div className="max-w-xl mx-auto rounded-xl border border-slate-200 bg-slate-50 p-3 sm:p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <code className="text-xs sm:text-sm font-mono text-slate-800 truncate text-left px-2">
                {`${typeof window !== 'undefined' ? window.location.origin : ''}/portal/${createdProject.id}`}
              </code>
              <CopyLinkButton
                path={`/portal/${createdProject.id}`}
                label="Copy Magic Link"
                variant="primary"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                to={`/portal/${createdProject.id}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Preview Client Portal</span>
              </Link>
              <button
                type="button"
                onClick={() => navigate(`/projects/${createdProject.id}`)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 cursor-pointer"
              >
                <span>Open Project Workspace</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </AgencyLayout>
  );
}
