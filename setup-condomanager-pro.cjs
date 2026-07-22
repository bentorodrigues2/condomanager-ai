const fs = require('fs');
const path = require('path');

console.log('🔧 A configurar CondoManager PRO (sidebar, responsivo, tema, auth, prédios, notificações)...');

function writeFile(relPath, content) {
  const fullPath = path.join(__dirname, relPath);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`✅ Escrevido: ${relPath}`);
}

// 1) Tema premium + preferência de tema
writeFile('src/theme.ts', `
export const lightTheme = {
  mode: 'light',
  brandName: 'CondoManager AI',
  colors: {
    background: '#f3f4f6',
    card: '#ffffff',
    border: '#e5e7eb',
    text: '#111827',
    textLight: '#6b7280',
    primary: '#2563eb',
    primarySoft: '#dbeafe',
    success: '#16a34a',
    warning: '#f59e0b',
    danger: '#dc2626',
    info: '#0ea5e9',
    sidebarBg: '#0f172a',
    sidebarText: '#e5e7eb',
    sidebarActiveBg: '#1f2937'
  },
  radius: {
    card: '12px'
  },
  shadow: {
    card: '0 4px 12px rgba(0,0,0,0.08)'
  },
  spacing: {
    section: '2rem',
    cardPadding: '1.5rem'
  }
};

export const darkTheme = {
  mode: 'dark',
  brandName: 'CondoManager AI',
  colors: {
    background: '#020617',
    card: '#0f172a',
    border: '#1f2937',
    text: '#e5e7eb',
    textLight: '#9ca3af',
    primary: '#3b82f6',
    primarySoft: '#1d4ed8',
    success: '#22c55e',
    warning: '#fbbf24',
    danger: '#ef4444',
    info: '#38bdf8',
    sidebarBg: '#020617',
    sidebarText: '#e5e7eb',
    sidebarActiveBg: '#1f2937'
  },
  radius: {
    card: '12px'
  },
  shadow: {
    card: '0 4px 12px rgba(0,0,0,0.4)'
  },
  spacing: {
    section: '2rem',
    cardPadding: '1.5rem'
  }
};
`);

writeFile('src/hooks/useThemePreference.ts', `
import { useEffect, useState } from 'react';
import { lightTheme, darkTheme } from '../theme';

export function useThemePreference() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem('condomanager-theme');
    if (stored === 'dark') setDarkMode(true);
    if (stored === 'light') setDarkMode(false);
  }, []);

  useEffect(() => {
    window.localStorage.setItem('condomanager-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const theme = darkMode ? darkTheme : lightTheme;

  return { darkMode, setDarkMode, theme };
}
`);

// 2) Sidebar PRO
writeFile('src/layout/Sidebar.tsx', `
import React from 'react';
import { NavLink } from 'react-router-dom';
import { lightTheme } from '../theme';

export function Sidebar({ theme }) {
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
    <aside
      style={{
        width: '260px',
        background: colors.sidebarBg,
        color: colors.sidebarText,
        padding: '1.5rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        borderRight: \`1px solid \${colors.border}\`
      }}
    >
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{theme.brandName}</div>
        <div style={{ fontSize: '0.8rem', color: colors.textLight }}>Painel de gestão de condomínio</div>
      </div>

      <NavLink
        to="/"
        style={({ isActive }) => (isActive ? activeStyle : linkStyle)}
      >
        <span>📊</span>
        <span>Dashboard</span>
      </NavLink>

      <NavLink
        to="/predios"
        style={({ isActive }) => (isActive ? activeStyle : linkStyle)}
      >
        <span>🏢</span>
        <span>Prédios & Frações</span>
      </NavLink>

      <NavLink
        to="/notificacoes"
        style={({ isActive }) => (isActive ? activeStyle : linkStyle)}
      >
        <span>🔔</span>
        <span>Notificações</span>
      </NavLink>

      <NavLink
        to="/perfil"
        style={({ isActive }) => (isActive ? activeStyle : linkStyle)}
      >
        <span>👤</span>
        <span>Perfil & Autenticação</span>
      </NavLink>
    </aside>
  );
}
`);

// 3) Layout com sidebar + responsividade
writeFile('src/layout/AppLayout.tsx', `
import React from 'react';
import { Sidebar } from './Sidebar';

export function AppLayout({ theme, children }) {
  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: theme.colors.background,
        color: theme.colors.text,
        transition: 'background 0.4s ease, color 0.4s ease'
      }}
    >
      <div
        style={{
          display: 'none',
          '@media (min-width: 768px)': {}
        }}
      />
      <Sidebar theme={theme} />
      <main
        style={{
          flex: 1,
          padding: theme.spacing.section,
          maxWidth: '1200px',
          margin: '0 auto'
        }}
      >
        {children}
      </main>
    </div>
  );
}
`);

// 4) Autenticação Supabase básica
writeFile('src/auth/AuthGate.tsx', `
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export function AuthGate({ children }) {
  const [session, setSession] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return <div style={{ padding: '2rem' }}>A verificar sessão...</div>;
  }

  if (!session) {
    return (
      <div style={{ padding: '2rem', maxWidth: '400px', margin: '0 auto' }}>
        <h2>Entrar no CondoManager</h2>
        <p style={{ marginBottom: '1rem' }}>
          Autentica-te para aceder ao painel de gestão do condomínio.
        </p>
        <button
          onClick={() => supabase.auth.signInWithOAuth({ provider: 'google' })}
          style={{
            padding: '0.75rem 1rem',
            borderRadius: '0.5rem',
            border: '1px solid #e5e7eb',
            cursor: 'pointer',
            width: '100%'
          }}
        >
          Entrar com Google
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
`);

// 5) Página de Prédios & Frações
writeFile('src/pages/Predios.tsx', `
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function Predios() {
  const [predios, setPredios] = useState<any[]>([]);
  const [fracoes, setFracoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [p, f] = await Promise.all([
        supabase.from('predios').select('*'),
        supabase.from('fracoes').select('*')
      ]);
      setPredios(p.data || []);
      setFracoes(f.data || []);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <p>A carregar prédios e frações...</p>;

  return (
    <div>
      <h1>Prédios & Frações</h1>
      <p style={{ marginBottom: '1rem' }}>
        Estrutura física do condomínio: blocos, entradas e frações.
      </p>

      <h2>Prédios</h2>
      {predios.length === 0 && <p>Nenhum prédio registado.</p>}
      {predios.map(p => (
        <div key={p.id} style={{ padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>
          <strong>{p.nome}</strong> — {p.morada}
        </div>
      ))}

      <h2 style={{ marginTop: '2rem' }}>Frações</h2>
      {fracoes.length === 0 && <p>Nenhuma fração registada.</p>}
      {fracoes.map(f => (
        <div key={f.id} style={{ padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>
          <strong>{f.codigo}</strong> — {f.tipologia} — proprietário #{f.owner_id}
        </div>
      ))}
    </div>
  );
}
`);

// 6) Página de Notificações internas
writeFile('src/pages/Notificacoes.tsx', `
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function Notificacoes() {
  const [notificacoes, setNotificacoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data } = await supabase
        .from('notificacoes')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      setNotificacoes(data || []);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <p>A carregar notificações...</p>;

  return (
    <div>
      <h1>Notificações internas</h1>
      <p style={{ marginBottom: '1rem' }}>
        Avisos automáticos sobre incidentes, pagamentos, obras e inventário.
      </p>

      {notificacoes.length === 0 && <p>Sem notificações.</p>}

      {notificacoes.map(n => (
        <div key={n.id} style={{ padding: '0.75rem 0', borderBottom: '1px solid #eee' }}>
          <strong>{n.titulo}</strong>
          <p style={{ margin: 0 }}>{n.mensagem}</p>
          <p style={{ margin: 0, fontSize: '0.8rem', color: '#6b7280' }}>
            {n.created_at?.slice(0, 16).replace('T', ' ')}
          </p>
        </div>
      ))}
    </div>
  );
}
`);

// 7) Página de Perfil & Autenticação
writeFile('src/pages/Perfil.tsx', `
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function Perfil() {
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
    });
  }, []);

  if (!user) return <p>Sem utilizador autenticado.</p>;

  return (
    <div>
      <h1>Perfil</h1>
      <p>Email: {user.email}</p>
      <p>ID: {user.id}</p>

      <button
        onClick={() => supabase.auth.signOut()}
        style={{
          marginTop: '1rem',
          padding: '0.6rem 1rem',
          borderRadius: '0.5rem',
          border: '1px solid #e5e7eb',
          cursor: 'pointer'
        }}
      >
        Terminar sessão
      </button>
    </div>
  );
}
`);

// 8) Reescrever App.tsx com Router + Layout + Auth + Tema
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

console.log('✅ CondoManager PRO configurado.');
console.log('👉 Sidebar, responsividade básica, tema premium, preferência de tema, notificações, prédios/frações e auth criados.');
