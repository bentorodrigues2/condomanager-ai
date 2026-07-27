
import React from 'react';
import Sidebar from '../components/Sidebar';
import AIConsole from '../components/AIConsole';

export default function AssistenteIA() {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />

      <div style={{ marginLeft: '260px', padding: '2rem', width: '100%' }}>
        <h1>Assistente IA</h1>
        <AIConsole />
      </div>
    </div>
  );
}
