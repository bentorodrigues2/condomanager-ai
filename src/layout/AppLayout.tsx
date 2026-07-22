
import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';

export function AppLayout({ theme, children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const saved = window.localStorage.getItem('sidebar-open');
    return saved === 'true';
  });

  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (isDesktop) setIsSidebarOpen(true);
  }, [isDesktop]);

  useEffect(() => {
    window.localStorage.setItem('sidebar-open', isSidebarOpen ? 'true' : 'false');
  }, [isSidebarOpen]);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: theme.colors.background,
        color: theme.colors.text,
        transition: 'background 0.4s ease, color 0.4s ease'
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.75rem 1rem',
          borderBottom: `1px solid ${theme.colors.border}`,
          background: theme.colors.card
        }}
      >
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          style={{
            padding: '0.4rem 0.6rem',
            borderRadius: '0.4rem',
            border: `1px solid ${theme.colors.border}`,
            background: theme.colors.card,
            color: theme.colors.text,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem'
          }}
        >
          <span>☰</span><span style={{ fontSize: '0.85rem' }}>Menu</span>
        </button>

        <span style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>
          {theme.brandName}
        </span>
      </div>

      <div style={{ display: 'flex', position: 'relative' }}>
        <Sidebar theme={theme} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        <main
          style={{
            flex: 1,
            padding: theme.spacing.section,
            maxWidth: '1200px',
            margin: '0 auto',
            marginTop: '1rem'
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
