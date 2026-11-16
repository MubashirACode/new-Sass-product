import React, { createContext, useContext, useEffect, useState } from 'react';
import { APP_CONFIG } from '../config/appConfig';
import { DEFAULT_AGENCY_SETTINGS, INITIAL_PROJECTS } from '../data/mockData';
import {
  AgencySettings,
  ChangeOrder,
  ClientAsset,
  ClientRequest,
  Deliverable,
  DeliverableStatus,
  MilestoneStatus,
  Project,
  ScopeVerdict,
  UserSession,
} from '../types';

interface AppState {
  projects: Project[];
  settings: AgencySettings;
}

interface AppContextValue {
  projects: Project[];
  settings: AgencySettings;
  session: UserSession;
  login: (email: string, name?: string) => void;
  logout: () => void;
  updateSettings: (next: AgencySettings) => void;
  resetDemoData: () => void;
  createProject: (project: Project) => void;
  updateDeliverableStatus: (projectId: string, deliverableId: string, status: DeliverableStatus) => void;
  addDeliverable: (projectId: string, title: string, category?: string) => void;
  updateMilestoneStatus: (projectId: string, milestoneId: string, status: MilestoneStatus) => void;
  uploadClientAsset: (projectId: string, assetId: string, fileName: string) => void;
  addRequiredAsset: (projectId: string, name: string, description: string) => void;
  submitClientRequest: (
    projectId: string,
    payload: {
      senderName: string;
      senderEmail: string;
      message: string;
      verdict: ScopeVerdict;
      reason: string;
      matchedDeliverable: string | null;
      estimatedHours: number;
      estimatedPrice: number;
    }
  ) => ClientRequest;
  updateRequestAnalysis: (
    projectId: string,
    requestId: string,
    updates: Partial<ClientRequest>
  ) => void;
  addRequestToTasks: (projectId: string, requestId: string, includedAnyway?: boolean) => void;
  sendChangeOrder: (
    projectId: string,
    payload: {
      requestId?: string;
      title: string;
      description: string;
      hours: number;
      price: number;
      paymentLink: string;
    }
  ) => ChangeOrder;
  markChangeOrderPaid: (projectId: string, changeOrderId: string) => void;
  sendDraftChangeOrder: (projectId: string, changeOrderId: string) => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

const DEFAULT_SESSION: UserSession = {
  isAuthenticated: true,
  name: 'Alex Morgan',
  email: 'alex@northbridgedigital.co',
  role: 'Agency Owner',
};

export function calculateProjectProgress(project: Project): number {
  if (!project.deliverables || project.deliverables.length === 0) return 0;
  const total = project.deliverables.length;
  const score = project.deliverables.reduce((acc, item) => {
    if (item.status === 'Done') return acc + 1;
    if (item.status === 'In progress') return acc + 0.5;
    return acc;
  }, 0);
  return Math.round((score / total) * 100);
}

export function getPendingOutOfScopeCount(project: Project): number {
  return project.requests.filter(
    (r) => r.verdict === 'Out of Scope' && r.actionStatus === 'Pending Review'
  ).length;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(() => {
    try {
      const raw = localStorage.getItem(APP_CONFIG.STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as AppState;
        if (parsed.projects && parsed.settings) {
          return parsed;
        }
      }
    } catch {
      // ignore parse errors
    }
    return {
      projects: INITIAL_PROJECTS,
      settings: DEFAULT_AGENCY_SETTINGS,
    };
  });

  const [session, setSession] = useState<UserSession>(() => {
    try {
      const raw = localStorage.getItem(APP_CONFIG.AUTH_STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw) as UserSession;
      }
    } catch {
      // ignore
    }
    return DEFAULT_SESSION;
  });

  useEffect(() => {
    try {
      localStorage.setItem(APP_CONFIG.STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore storage quota errors
    }
  }, [state]);

  useEffect(() => {
    try {
      localStorage.setItem(APP_CONFIG.AUTH_STORAGE_KEY, JSON.stringify(session));
    } catch {
      // ignore
    }
  }, [session]);

  const login = (email: string, name?: string) => {
    const cleanName =
      name?.trim() ||
      email
        .split('@')[0]
        .replace(/[._-]/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());
    setSession({
      isAuthenticated: true,
      name: cleanName || 'Agency Owner',
      email,
      role: 'Agency Owner',
    });
  };

  const logout = () => {
    setSession((prev) => ({ ...prev, isAuthenticated: false }));
  };

  const updateSettings = (next: AgencySettings) => {
    setState((prev) => ({ ...prev, settings: next }));
  };

  const resetDemoData = () => {
    setState({
      projects: INITIAL_PROJECTS,
      settings: DEFAULT_AGENCY_SETTINGS,
    });
  };

  const createProject = (project: Project) => {
    setState((prev) => ({
      ...prev,
      projects: [project, ...prev.projects],
    }));
  };

  const updateDeliverableStatus = (
    projectId: string,
    deliverableId: string,
    status: DeliverableStatus
  ) => {
    setState((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => {
        if (p.id !== projectId) return p;
        const nextDeliverables = p.deliverables.map((d) =>
          d.id === deliverableId ? { ...d, status } : d
        );
        const allDone =
          nextDeliverables.length > 0 && nextDeliverables.every((d) => d.status === 'Done');
        const hasPendingOut = getPendingOutOfScopeCount(p) > 0;
        const nextStatus = allDone
          ? 'Completed'
          : hasPendingOut
            ? 'At Risk'
            : p.status === 'Completed'
              ? 'In Progress'
              : p.status;
        return {
          ...p,
          deliverables: nextDeliverables,
          status: nextStatus,
        };
      }),
    }));
  };

  const addDeliverable = (projectId: string, title: string, category = 'General') => {
    const newItem: Deliverable = {
      id: `del-${Date.now()}`,
      title,
      category,
      status: 'Not started',
    };
    setState((prev) => ({
      ...prev,
      projects: prev.projects.map((p) =>
        p.id === projectId ? { ...p, deliverables: [...p.deliverables, newItem] } : p
      ),
    }));
  };

  const updateMilestoneStatus = (
    projectId: string,
    milestoneId: string,
    status: MilestoneStatus
  ) => {
    setState((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => {
        if (p.id !== projectId) return p;
        return {
          ...p,
          milestones: p.milestones.map((m) => (m.id === milestoneId ? { ...m, status } : m)),
        };
      }),
    }));
  };

  const uploadClientAsset = (projectId: string, assetId: string, fileName: string) => {
    const today = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });
    setState((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => {
        if (p.id !== projectId) return p;
        return {
          ...p,
          assets: p.assets.map((a) =>
            a.id === assetId
              ? { ...a, status: 'Received', fileName, uploadedAt: today }
              : a
          ),
        };
      }),
    }));
  };

  const addRequiredAsset = (projectId: string, name: string, description: string) => {
    const newAsset: ClientAsset = {
      id: `ast-${Date.now()}`,
      name,
      description,
      status: 'Pending',
    };
    setState((prev) => ({
      ...prev,
      projects: prev.projects.map((p) =>
        p.id === projectId ? { ...p, assets: [...p.assets, newAsset] } : p
      ),
    }));
  };

  const submitClientRequest: AppContextValue['submitClientRequest'] = (projectId, payload) => {
    const newRequest: ClientRequest = {
      id: `req-${Date.now()}`,
      projectId,
      senderName: payload.senderName,
      senderEmail: payload.senderEmail,
      message: payload.message,
      createdAt: 'Just now',
      verdict: payload.verdict,
      reason: payload.reason,
      matchedDeliverable: payload.matchedDeliverable,
      estimatedHours: payload.estimatedHours,
      estimatedPrice: payload.estimatedPrice,
      actionStatus: 'Pending Review',
    };

    setState((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => {
        if (p.id !== projectId) return p;
        const nextStatus = payload.verdict === 'Out of Scope' ? 'At Risk' : p.status;
        return {
          ...p,
          status: nextStatus,
          requests: [newRequest, ...p.requests],
        };
      }),
    }));

    return newRequest;
  };

  const updateRequestAnalysis = (
    projectId: string,
    requestId: string,
    updates: Partial<ClientRequest>
  ) => {
    setState((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => {
        if (p.id !== projectId) return p;
        return {
          ...p,
          requests: p.requests.map((r) => (r.id === requestId ? { ...r, ...updates } : r)),
        };
      }),
    }));
  };

  const addRequestToTasks = (projectId: string, requestId: string, includedAnyway = false) => {
    setState((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => {
        if (p.id !== projectId) return p;
        const req = p.requests.find((r) => r.id === requestId);
        if (!req) return p;

        const nextRequests = p.requests.map((r) =>
          r.id === requestId
            ? {
                ...r,
                actionStatus: includedAnyway
                  ? ('Included Anyway' as const)
                  : ('Added to Tasks' as const),
              }
            : r
        );

        const taskTitle =
          req.message.length > 72 ? `${req.message.slice(0, 69)}...` : req.message;

        const alreadyAdded = p.deliverables.some(
          (d) => d.title.toLowerCase() === taskTitle.toLowerCase()
        );

        const nextDeliverables = alreadyAdded
          ? p.deliverables
          : [
              ...p.deliverables,
              {
                id: `del-req-${Date.now()}`,
                title: taskTitle,
                category: includedAnyway ? 'Courtesy Scope' : 'Client Request',
                status: 'Not started' as const,
              },
            ];

        const pendingOutCount = nextRequests.filter(
          (r) => r.verdict === 'Out of Scope' && r.actionStatus === 'Pending Review'
        ).length;

        return {
          ...p,
          status: pendingOutCount > 0 ? 'At Risk' : p.status === 'At Risk' ? 'In Progress' : p.status,
          requests: nextRequests,
          deliverables: nextDeliverables,
        };
      }),
    }));
  };

  const sendChangeOrder: AppContextValue['sendChangeOrder'] = (projectId, payload) => {
    const today = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });

    const newOrder: ChangeOrder = {
      id: `co-${Date.now()}`,
      projectId,
      requestId: payload.requestId,
      title: payload.title,
      description: payload.description,
      hours: payload.hours,
      price: payload.price,
      paymentLink: payload.paymentLink,
      status: 'Sent',
      createdAt: today,
    };

    setState((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => {
        if (p.id !== projectId) return p;
        const nextRequests = p.requests.map((r) =>
          r.id === payload.requestId
            ? {
                ...r,
                actionStatus: 'Change Order Sent' as const,
                changeOrderId: newOrder.id,
                estimatedHours: payload.hours,
                estimatedPrice: payload.price,
              }
            : r
        );

        const pendingOutCount = nextRequests.filter(
          (r) => r.verdict === 'Out of Scope' && r.actionStatus === 'Pending Review'
        ).length;

        return {
          ...p,
          status: pendingOutCount > 0 ? 'At Risk' : p.status === 'At Risk' ? 'In Progress' : p.status,
          requests: nextRequests,
          changeOrders: [newOrder, ...p.changeOrders],
        };
      }),
    }));

    return newOrder;
  };

  const markChangeOrderPaid = (projectId: string, changeOrderId: string) => {
    const today = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });

    setState((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => {
        if (p.id !== projectId) return p;
        const target = p.changeOrders.find((c) => c.id === changeOrderId);
        const nextOrders = p.changeOrders.map((c) =>
          c.id === changeOrderId ? { ...c, status: 'Paid' as const, paidAt: today } : c
        );

        // Also add approved change order to deliverables if not already present
        const alreadyInDeliverables =
          target && p.deliverables.some((d) => d.title === target.title);

        const nextDeliverables =
          target && !alreadyInDeliverables
            ? [
                ...p.deliverables,
                {
                  id: `del-co-${Date.now()}`,
                  title: target.title,
                  category: 'Approved Change Order',
                  status: 'Not started' as const,
                },
              ]
            : p.deliverables;

        return {
          ...p,
          changeOrders: nextOrders,
          deliverables: nextDeliverables,
        };
      }),
    }));
  };

  const sendDraftChangeOrder = (projectId: string, changeOrderId: string) => {
    setState((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => {
        if (p.id !== projectId) return p;
        return {
          ...p,
          changeOrders: p.changeOrders.map((c) =>
            c.id === changeOrderId ? { ...c, status: 'Sent' as const } : c
          ),
        };
      }),
    }));
  };

  return (
    <AppContext.Provider
      value={{
        projects: state.projects,
        settings: state.settings,
        session,
        login,
        logout,
        updateSettings,
        resetDemoData,
        createProject,
        updateDeliverableStatus,
        addDeliverable,
        updateMilestoneStatus,
        uploadClientAsset,
        addRequiredAsset,
        submitClientRequest,
        updateRequestAnalysis,
        addRequestToTasks,
        sendChangeOrder,
        markChangeOrderPaid,
        sendDraftChangeOrder,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used inside AppProvider');
  }
  return ctx;
}
