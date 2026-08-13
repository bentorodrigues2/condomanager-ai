
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
