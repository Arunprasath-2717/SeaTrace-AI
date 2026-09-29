import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Public Pages
import { LandingPage } from '../pages/Landing/LandingPage';
import { NotFoundPage } from '../pages/NotFound/NotFoundPage';

// Oceanic Command Dashboard — all subpages are internal sidebar tabs
import { OceanicDashboard } from '../components/Dashboard/OceanicDashboard';

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Auth redirects → dashboard */}
        <Route path="/login"   element={<Navigate to="/app" replace />} />
        <Route path="/sign-in" element={<Navigate to="/app" replace />} />
        <Route path="/signin"  element={<Navigate to="/app" replace />} />
        <Route path="/auth/*"  element={<Navigate to="/app" replace />} />

        {/* All /app/* sub-paths funnel into the single OceanicDashboard shell */}
        <Route path="/app/*" element={<OceanicDashboard />} />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
