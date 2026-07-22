const fs = require('fs');
const path = require('path');

console.log('🔧 A instalar sistema de permissões CondoManager AI...');

function writeFile(relPath, content) {
  const fullPath = path.join(__dirname, relPath);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`✅ Escrevido: ${relPath}`);
}

/* 1) Criar helper de permissões */
writeFile('src/auth/getUserRole.ts', `
import { supabase } from '../supabaseClient';

export async function getUserRole() {
  const { data: sessionData } = await supabase.auth.getSession();
  const user = sessionData?.session?.user;
  if (!user) return null;

  const { data } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single();

  return data?.role ?? null;
}
`);

/* 2) Reescrever AuthGate com bloqueio por papel */
writeFile('src/auth/AuthGate.tsx', `
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { getUserRole } from './getUserRole';

export function AuthGate({ children, requiredRole }) {
  const [session, setSession] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      setSession(data.session ?? null);

      if (data.session) {
        const r = await getUserRole();
        setRole(r);
      }

      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session) {
        const r = await getUserRole();
        setRole(r);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  if (loading) return <div style={{ padding: '2rem' }}>A verificar sessão...</div>;

  if (!session) {
    return (
      <div style={{ padding: '2rem', maxWidth: '400px', margin: '0 auto' }}>
        <h2>Entrar no CondoManager</h2>
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

  if (requiredRole && role !== requiredRole) {
    return (
      <div style={{ padding: '2rem' }}>
        <h2>Acesso negado</h2>
        <p>Não tens permissões para aceder a esta área.</p>
      </div>
    );
  }

  return <>{children}</>;
}
`);

/* 3) Atualizar App.tsx para proteger rotas */
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
`);

console.log('🎉 Sistema de permissões instalado com sucesso.');
console.log('🔐 Rotas protegidas por papel (admin / gestor / owner / viewer).');
