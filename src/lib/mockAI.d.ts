import type { Deliverable, Milestone, ClientAsset, ScopeVerdict } from '../types';

export interface AnalyzedContractResult {
  milestones: Milestone[];
  deliverables: Deliverable[];
  requiredAssets: ClientAsset[];
}

export interface ScopeCheckResult {
  verdict: ScopeVerdict;
  reason: string;
  matchedDeliverable: string | null;
  estimatedHours: number;
  estimatedPrice: number;
  suggestedTitle: string;
}

export function analyzeContract(text?: string): Promise<AnalyzedContractResult>;

export function checkRequest(
  requestText: string,
  deliverables?: Array<Deliverable | { id?: string; title: string; category?: string }>,
  hourlyRate?: number
): Promise<ScopeCheckResult>;
