
import React from 'react';

export default function DocumentList({ docs }) {
  return (
    <div style={{ marginTop: '1rem' }}>
      {docs.map((d) => (
        <div
          key={d.id}
          style={{
            padding: '1rem',
            backgroundColor: 'var(--bg2)',
            borderRadius: '8px',
            marginBottom: '1rem'
          }}
        >
          <strong>{d.nome}</strong>
          <br />
          <a href={d.url} target="_blank" rel="noreferrer">
            Abrir Documento
          </a>
        </div>
      ))}
    </div>
  );
}
