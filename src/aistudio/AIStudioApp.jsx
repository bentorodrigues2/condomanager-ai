import React from 'react';
import RequireAIStudio from './RequireAIStudio';
import AIStudioLayout from './AIStudioLayout';
import { AIStudioRouter } from './router';
import '../index.css';

export default function AIStudioApp() {
  return (
    <RequireAIStudio>
      <AIStudioLayout>
        <AIStudioRouter />
      </AIStudioLayout>
    </RequireAIStudio>
  );
}
