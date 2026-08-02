
import React from 'react';
import '../styles/theme.css';

export default function LandingPage() {
  return (
    <div style={{ backgroundColor: 'var(--bg)', color: 'var(--text)', padding: '2rem' }}>
      <h1>CondoManager AI</h1>
      <p>PWA & Automação Ativa</p>

      <div style={{ marginTop: '2rem' }}>
        <button style={{
          backgroundColor: 'var(--primary)',
          color: '#fff',
          padding: '1rem',
          borderRadius: '8px',
          border: 'none'
        }}>
          Entrar
        </button>
      </div>
    </div>
  );
}
