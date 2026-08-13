import React, { useState } from 'react';
import RequireAIStudio from './RequireAIStudio';
import AIStudioLayout from './AIStudioLayout';
import Dashboard from './dashboard/Dashboard';
import { AIStudioRouter } from './router';
import '../index.css';

export default function AIStudioApp() {
  const [view, setView] = useState('dashboard');

  return (
    <RequireAIStudio>
      <AIStudioLayout>
        <div style={{ padding: '20px' }}>
          <button onClick={() => setView('dashboard')}>Dashboard</button>
          <button onClick={() => setView('router')}>Navegação</button>
        </div>

        {view === 'dashboard' && <Dashboard />}
        {view === 'router' && <AIStudioRouter />}
      </AIStudioLayout>
    </RequireAIStudio>
  );
}
