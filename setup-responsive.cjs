const fs = require('fs');
const path = require('path');

console.log('🔧 A configurar responsividade + sidebar colapsável...');

function writeFile(relPath, content) {
  const fullPath = path.join(__dirname, relPath);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`✅ Escrevido: ${relPath}`);
}

// Sidebar responsiva com hambúrguer
writeFile('src/layout/Sidebar.tsx', `
import React from 'react';
import { NavLink } from 'react-router-dom';

export function Sidebar({ theme, isOpen, onClose }) {
  const colors = theme.colors;

  const linkStyle = {
    padding: '0.75rem 1rem',
    borderRadius: '0.5rem',
    marginBottom: '0.25rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: colors.sidebarText,
    textDecoration: 'none',
    fontSize: '0.95rem'
  };

  const activeStyle = {
    ...linkStyle,
    background: colors.sidebarActiveBg
  };

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            zIndex: 40
          }}
        />
      )}

      <aside
        style={{
          position: 'fixed',
          top: 0,
          left: isOpen ? 0 : '-260px',
          height: '100vh',
          width: '260px',
          background: colors.sidebarBg,
          color: colors.sidebarText,
          padding: '1.5rem 1rem',
          display: 'flex',
          flexDirection: 'column',
          borderRight: \`1px solid \${colors.border}\`,
          transition: 'left 0.3s ease',
          zIndex: 50
        }}
      >
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{theme.brandName}</div>
          <div style={{ fontSize: '0.8rem', color: colors.textLight }}>Painel de gestão de condomínio</div>
        </div>

        <NavLink to="/" style={({ isActive }) => (isActive ? activeStyle : linkStyle)} onClick={onClose}>
          <span>📊</span><span>Dashboard</span>
        </NavLink>

        <NavLink to="/predios" style={({ isActive }) => (isActive ? activeStyle : linkStyle)} onClick={onClose}>
          <span>🏢</span><span>Prédios & Frações</span>
        </NavLink>

        <NavLink to="/notificacoes" style={({ isActive }) => (isActive ? activeStyle : linkStyle)} onClick={onClose}>
          <span>🔔</span><span>Notificações</span>
        </NavLink>

        <NavLink to="/perfil" style={({ isActive }) => (isActive ? activeStyle : linkStyle)} onClick={onClose}>
          <span>👤</span><span>Perfil & Autenticação</span>
        </NavLink>
      </aside>
    </>
  );
}
`);

// AppLayout responsivo
writeFile('src/layout/AppLayout.tsx', `
import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';

export function AppLayout({ theme, children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
          borderBottom: \`1px solid \${theme.colors.border}\`,
          background: theme.colors.card
        }}
      >
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          style={{
            padding: '0.4rem 0.6rem',
            borderRadius: '0.4rem',
            border: \`1px solid \${theme.colors.border}\`,
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
`);

// App.tsx atualizado
writeFile('src/App.tsx', `
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Predios from './pages/Predios';
import Notificacoes from './pages/Notificacoes';
import Perfil from './pages/Perfil';
import { AppLayout } from './layout/AppLayout';
import { AuthGate } from './auth/AuthGate';
import { useThemePreference } from './hooks/useThemePreference';

export default function App() {
  const { darkMode, setDarkMode, theme } = useThemePreference();

  return (
    <BrowserRouter>
      <AuthGate>
        <AppLayout theme={theme}>
          <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={() => setDarkMode(!darkMode)}
              style={{
                padding: '0.5rem 0.9rem',
                borderRadius: '0.5rem',
                border: \`1px solid \${theme.colors.border}\`,
                background: theme.colors.card,
                color: theme.colors.text,
                cursor: 'pointer',
                boxShadow: theme.shadow.card,
                fontSize: '0.9rem'
              }}
            >
              {darkMode ? '☀️ Modo Claro' : '🌙 Modo Escuro'}
            </button>
          </div>

          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/predios" element={<Predios />} />
            <Route path="/notificacoes" element={<Notificacoes />} />
            <Route path="/perfil" element={<Perfil />} />
          </Routes>
        </AppLayout>
      </AuthGate>
    </BrowserRouter>
  );
}
`);

console.log('✅ Responsividade + sidebar colapsável configuradas.');
console.log('📱 Mobile/tablet/desktop prontos.');
