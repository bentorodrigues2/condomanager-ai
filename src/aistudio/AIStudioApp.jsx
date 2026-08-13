import React from 'react';
import { AIStudioRouter } from './router';
import '../index.css';

export default function AIStudioApp() {
  return (
    <div style={{ width: '100%', height: '100vh', overflow: 'hidden' }}>
      <AIStudioRouter />
    </div>
  );
}
