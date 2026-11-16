export type DeliverableStatus = 'Not started' | 'In progress' | 'Done';
export type AssetStatus = 'Pending' | 'Received';
export type MilestoneStatus = 'Completed' | 'In progress' | 'Upcoming';
export type ProjectStatus = 'Onboarding' | 'In Progress' | 'At Risk' | 'Completed';

export type ScopeVerdict = 'In Scope' | 'Out of Scope' | 'Unclear';
export type RequestActionStatus =
  | 'Pending Review'
  | 'Added to Tasks'
  | 'Change Order Sent'
  | 'Included Anyway';

export type ChangeOrderStatus = 'Draft' | 'Sent' | 'Paid';

export interface Milestone {
  id: string;
  title: string;
  dueDate: string;
  status: MilestoneStatus;
}

export interface Deliverable {
  id: string;
  title: string;
  category: string;
  status: DeliverableStatus;
}

export interface ClientAsset {
  id: string;
  name: string;
  description: string;
  status: AssetStatus;
  fileName?: string;
  uploadedAt?: string;
}

export interface ClientRequest {
  id: string;
  projectId: string;
  senderName: string;
  senderEmail: string;
  message: string;
  createdAt: string;
  verdict: ScopeVerdict;
  reason: string;
  matchedDeliverable: string | null;
  estimatedHours: number;
  estimatedPrice: number;
  actionStatus: RequestActionStatus;
  changeOrderId?: string;
}

export interface ChangeOrder {
  id: string;
  projectId: string;
  requestId?: string;
  title: string;
  description: string;
  hours: number;
  price: number;
  paymentLink: string;
  status: ChangeOrderStatus;
  createdAt: string;
  paidAt?: string;
}

export interface Project {
  id: string;
  name: string;
  clientName: string;
  clientEmail: string;
  status: ProjectStatus;
  contractValue: number;
  createdAt: string;
  contractSummary: string;
  milestones: Milestone[];
  deliverables: Deliverable[];
  assets: ClientAsset[];
  requests: ClientRequest[];
  changeOrders: ChangeOrder[];
}

export interface AgencySettings {
  agencyName: string;
  logoUrl: string;
  logoPresetId: 'indigo-knot' | 'teal-knot' | 'amber-knot' | 'emerald-knot';
  brandColor: string;
  hourlyRate: number;
  paymentLink: string;
  notificationEmail: string;
}

export interface UserSession {
  isAuthenticated: boolean;
  name: string;
  email: string;
  role: string;
}
