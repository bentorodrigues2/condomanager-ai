import React from 'react';
import RequireAIStudio from './RequireAIStudio';
import { AIStudioRouter } from './router';
import '../index.css';

export default function AIStudioApp() {
  return (
    <RequireAIStudio>
      <div style={{ width: '100%', height: '100vh', overflow: 'hidden' }}>
        <AIStudioRouter />
      </div>
    </RequireAIStudio>
  );
}
