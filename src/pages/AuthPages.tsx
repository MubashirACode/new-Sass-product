import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import { APP_CONFIG } from '../config/appConfig';
import { useApp } from '../context/AppContext';
import { ScopeGuardLogo } from '../components/BrandMark';

export function LoginPage() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('alex@northbridgedigital.co');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) {
      setError('Please enter a valid work email address.');
      return;
    }
    login(email);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <Link to="/" className="inline-flex justify-center">
          <ScopeGuardLogo size="lg" />
        </Link>
        <h1 className="font-display text-2xl font-bold text-slate-900 pt-3">
          Sign in to your agency workspace
        </h1>
        <p className="text-sm text-slate-600">
          Review client requests, manage assets, and issue change orders.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
                {error}
              </div>
            )}
            <div>
              <label htmlFor="login-email" className="block text-sm font-medium text-slate-700 mb-1.5">
                Work Email
              </label>
              <input
                id="login-email"
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                placeholder="you@agency.com"
              />
            </div>

            <div>
              <label htmlFor="login-password" className="block text-sm font-medium text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 pr-10 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors cursor-pointer"
            >
              <span>Sign In to Dashboard</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 text-center space-y-2">
            <p className="text-xs text-slate-500">
              UI-only preview: any email signs directly into the demo workspace.
            </p>
            <p className="text-sm text-slate-600">
              New to {APP_CONFIG.APP_NAME}?{' '}
              <Link to="/signup" className="font-semibold text-indigo-600 hover:text-indigo-700">
                Create agency account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SignupPage() {
  const { login, settings, updateSettings } = useApp();
  const navigate = useNavigate();
  const [name, setName] = useState('Alex Morgan');
  const [agencyName, setAgencyName] = useState(settings.agencyName);
  const [email, setEmail] = useState('alex@northbridgedigital.co');
  const [password, setPassword] = useState('CreateDemoPass123');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) {
      setError('Please enter a valid work email.');
      return;
    }
    if (agencyName.trim()) {
      updateSettings({
        ...settings,
        agencyName: agencyName.trim(),
        notificationEmail: email.trim(),
      });
    }
    login(email, name);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <Link to="/" className="inline-flex justify-center">
          <ScopeGuardLogo size="lg" />
        </Link>
        <h1 className="font-display text-2xl font-bold text-slate-900 pt-3">
          Create your {APP_CONFIG.APP_NAME} account
        </h1>
        <p className="text-sm text-slate-600">
          Set up your white-label client portal and protect your first project.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
                {error}
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="signup-name" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Your Name
                </label>
                <input
                  id="signup-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
              <div>
                <label htmlFor="signup-agency" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Agency Name
                </label>
                <input
                  id="signup-agency"
                  type="text"
                  required
                  value={agencyName}
                  onChange={(e) => setAgencyName(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            <div>
              <label htmlFor="signup-email" className="block text-sm font-medium text-slate-700 mb-1.5">
                Work Email
              </label>
              <input
                id="signup-email"
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label htmlFor="signup-password" className="block text-sm font-medium text-slate-700 mb-1.5">
                Password
              </label>
              <input
                id="signup-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors cursor-pointer"
            >
              <span>Create Account &amp; Open Dashboard</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-600">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-700">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
