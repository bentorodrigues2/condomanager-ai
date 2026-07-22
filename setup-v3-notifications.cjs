/**
 * CondoManager AI — setup-v3-notifications.cjs
 * Bloco 10: Sistema de Notificações (Email + Push + Realtime)
 */

const fs = require("fs");
const path = require("path");

function writeFile(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
  console.log("📄 Criado/Atualizado:", filePath);
}

/* ============================================================
   1. Contexto Global de Notificações
   ============================================================ */

writeFile(
  "frontend/src/context/NotificationContext.jsx",
  `
import React, { createContext, useContext, useState } from 'react';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  function push(message) {
    setNotifications((prev) => [...prev, { id: Date.now(), message }]);
  }

  function remove(id) {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }

  return (
    <NotificationContext.Provider value={{ notifications, push, remove }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationContext);
}
`
);

/* ============================================================
   2. Componente NotificationCenter
   ============================================================ */

writeFile(
  "frontend/src/components/NotificationCenter.jsx",
  `
import React from 'react';
import { useNotifications } from '../context/NotificationContext';

export default function NotificationCenter() {
  const { notifications, remove } = useNotifications();

  return (
    <div style={{
      position: 'fixed',
      top: '1rem',
      right: '1rem',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem'
    }}>
      {notifications.map((n) => (
        <div
          key={n.id}
          style={{
            backgroundColor: 'var(--primary)',
            color: '#fff',
            padding: '1rem',
            borderRadius: '8px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
            cursor: 'pointer'
          }}
          onClick={() => remove(n.id)}
        >
          {n.message}
        </div>
      ))}
    </div>
  );
}
`
);

/* ============================================================
   3. Hook de Notificações Realtime via Supabase
   ============================================================ */

writeFile(
  "frontend/src/hooks/useRealtimeNotifications.js",
  `
import { useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { useNotifications } from '../context/NotificationContext';

export default function useRealtimeNotifications() {
  const { push } = useNotifications();

  useEffect(() => {
    const channel = supabase
      .channel('realtime-notifications')
      .on('postgres_changes', { event: 'INSERT', schema: 'public' }, (payload) => {
        const table = payload.table;
        const row = payload.new;

        if (table === 'intervencoes') {
          push('Nova intervenção adicionada: ' + row.descricao);
        }

        if (table === 'obras') {
          push('Nova obra registada: ' + row.descricao);
        }

        if (table === 'limpezas') {
          push('Nova limpeza agendada: ' + row.descricao);
        }
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);
}
`
);

/* ============================================================
   4. Atualizar App.jsx para incluir NotificationProvider + NotificationCenter
   ============================================================ */

writeFile(
  "frontend/src/App.jsx",
  `
import React from 'react';
import AppRouter from './router/AppRouter';
import { NotificationProvider } from './context/NotificationContext';
import NotificationCenter from './components/NotificationCenter';
import useRealtimeNotifications from './hooks/useRealtimeNotifications';

export default function App() {
  useRealtimeNotifications();

  return (
    <NotificationProvider>
      <NotificationCenter />
      <AppRouter />
    </NotificationProvider>
  );
}
`
);

/* ============================================================
   FINAL
   ============================================================ */

console.log("\\n🎯 Bloco 10 concluído com sucesso!");
console.log("Sistema de notificações (UI + realtime) criado automaticamente.");
