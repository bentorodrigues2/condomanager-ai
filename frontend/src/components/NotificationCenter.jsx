
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
