import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import LandingPage from './pages/LandingPage';
import { LoginPage, SignupPage } from './pages/AuthPages';
import DashboardPage from './pages/DashboardPage';
import NewProjectPage from './pages/NewProjectPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import RequestDetailPage from './pages/RequestDetailPage';
import SettingsPage from './pages/SettingsPage';
import ClientPortalPage from './pages/ClientPortalPage';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Marketing & Auth */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Agency Side */}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/projects/new" element={<NewProjectPage />} />
          <Route path="/projects/:projectId" element={<ProjectDetailPage />} />
          <Route
            path="/projects/:projectId/requests/:requestId"
            element={<RequestDetailPage />}
          />
          <Route path="/settings" element={<SettingsPage />} />

          {/* White-Label Client Portal (No Login, Magic Link) */}
          <Route path="/portal/:projectId" element={<ClientPortalPage />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
