import { Routes, Route } from 'react-router-dom';
import StudioDashboard from './pages/StudioDashboard';
import StudioBrowser from './pages/StudioBrowser';
import StudioSettings from './pages/StudioSettings';

export function AIStudioRouter() {
  return (
    <Routes>
      <Route path='/' element={<StudioDashboard />} />
      <Route path='/browser' element={<StudioBrowser />} />
      <Route path='/settings' element={<StudioSettings />} />
    </Routes>
  );
}
