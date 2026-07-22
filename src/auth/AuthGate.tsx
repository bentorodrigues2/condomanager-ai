
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
