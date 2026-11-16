import React, { useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  ChevronRight,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  Settings,
  X,
} from 'lucide-react';
import { getPendingOutOfScopeCount, useApp } from '../context/AppContext';
import { ScopeGuardLogo } from './BrandMark';

interface BreadcrumbItem {
  label: string;
  to?: string;
}

interface AgencyLayoutProps {
  children: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  title?: string;
  action?: React.ReactNode;
}

export function AgencyLayout({
  children,
  breadcrumbs = [],
  title,
  action,
}: AgencyLayoutProps) {
  const { projects, settings, session, logout } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/projects/new', label: 'New Project', icon: Plus },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  const SidebarContent = () => (
    <div className="flex h-full flex-col justify-between bg-white border-r border-slate-200">
      <div>
        <div className="flex h-16 items-center justify-between px-5 border-b border-slate-100">
          <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
            <ScopeGuardLogo size="sm" />
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden rounded-lg p-2 text-slate-500 hover:bg-slate-100"
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="px-3 pt-4 pb-2">
          <div className="px-3 pb-2 text-xs font-semibold text-slate-400">
            Active Projects
          </div>
          <div className="space-y-1 max-h-64 overflow-y-auto">
            {projects.map((project) => {
              const pendingOut = getPendingOutOfScopeCount(project);
              const isSelected = location.pathname.startsWith(`/projects/${project.id}`);
              return (
                <Link
                  key={project.id}
                  to={`/projects/${project.id}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                    isSelected
                      ? 'bg-slate-100 font-medium text-slate-900'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <span className="flex items-center gap-2 min-w-0">
                    <FolderKanban className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                    <span className="truncate">{project.clientName}</span>
                  </span>
                  {pendingOut > 0 && (
                    <span
                      title={`${pendingOut} pending out-of-scope request`}
                      className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-100 px-1.5 text-[11px] font-semibold text-rose-700 tabular-nums shrink-0"
                    >
                      {pendingOut}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100 p-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700">
            {session.name
              .split(' ')
              .map((w) => w[0])
              .join('')
              .slice(0, 2)
              .toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-slate-900">{settings.agencyName}</p>
            <p className="truncate text-xs text-slate-500">{session.email}</p>
          </div>
        </div>
        <div className="flex items-center justify-between gap-2 pt-1">
          <Link
            to="/"
            className="text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors"
          >
            Landing Page
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign out</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block lg:w-64 lg:shrink-0 lg:sticky lg:top-0 lg:h-screen">
        <SidebarContent />
      </aside>

      {/* Mobile / Tablet Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative z-10 w-72 max-w-[85vw] h-full">
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-xs border-b border-slate-200 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden inline-flex items-center justify-center rounded-lg p-2 text-slate-600 hover:bg-slate-100 min-h-[40px] min-w-[40px]"
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm min-w-0">
              {breadcrumbs.length > 0 ? (
                breadcrumbs.map((crumb, idx) => (
                  <React.Fragment key={`${crumb.label}-${idx}`}>
                    {idx > 0 && (
                      <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
                    )}
                    {crumb.to ? (
                      <Link
                        to={crumb.to}
                        className="text-slate-500 hover:text-slate-900 truncate max-w-[140px] sm:max-w-[220px] whitespace-nowrap"
                      >
                        {crumb.label}
                      </Link>
                    ) : (
                      <span className="font-semibold text-slate-900 truncate max-w-[180px] sm:max-w-[320px] whitespace-nowrap">
                        {crumb.label}
                      </span>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <span className="font-semibold text-slate-900 truncate">{title || 'Workspace'}</span>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {action || (
              <Link
                to="/projects/new"
                className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs sm:text-sm font-medium text-white hover:bg-indigo-700 transition-colors whitespace-nowrap shrink-0 shadow-xs"
              >
                <Plus className="h-4 w-4" />
                <span>New Project</span>
              </Link>
            )}
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
