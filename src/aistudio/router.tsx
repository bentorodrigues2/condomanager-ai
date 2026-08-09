import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import StudioDashboard from './pages/StudioDashboard';
import StudioBrowser from './pages/StudioBrowser';
import StudioSettings from './pages/StudioSettings';

export function AIStudioRouter() {
  return (
    <Routes>
      <Route path='login' element={<Login />} />
      <Route path='dashboard' element={<StudioDashboard />} />
      <Route path='browser' element={<StudioBrowser />} />
      <Route path='settings' element={<StudioSettings />} />
      <Route path='*' element={<Login />} />
    </Routes>
  );
}
