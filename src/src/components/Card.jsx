
import React from 'react';

export default function Card({ title, children }) {
  return (
    <div style={{
      backgroundColor: 'var(--bg2)',
      padding: '1.5rem',
      borderRadius: '12px',
      marginBottom: '1rem',
      boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
    }}>
      {title && <h3 style={{ marginBottom: '1rem' }}>{title}</h3>}
      {children}
    </div>
  );
}
