
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
                border: `1px solid ${theme.colors.border}`,
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
            <Route path="/" element={<AuthGate requiredRole="admin"><Dashboard /></AuthGate>} />
            <Route path="/predios" element={<AuthGate requiredRole="gestor"><Predios /></AuthGate>} />
            <Route path="/notificacoes" element={<AuthGate requiredRole="gestor"><Notificacoes /></AuthGate>} />
            <Route path="/perfil" element={<Perfil />} />
          </Routes>
        </AppLayout>
      </AuthGate>
    </BrowserRouter>
  );
}
