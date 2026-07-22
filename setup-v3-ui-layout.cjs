/**
 * CondoManager AI — setup-v3-ui-layout.cjs
 * Bloco 7: Componentes Premium (Sidebar, BottomNav, Card, Table, Button, Input)
 */

const fs = require("fs");
const path = require("path");

// Utilitário para criar ficheiros
function writeFile(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
  console.log("📄 Criado:", filePath);
}

/* ============================================================
   1. Sidebar
   ============================================================ */

writeFile(
  "frontend/src/components/Sidebar.jsx",
  `
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/theme.css';

export default function Sidebar() {
  return (
    <div style={{
      width: '260px',
      backgroundColor: 'var(--bg2)',
      height: '100vh',
      padding: '2rem',
      position: 'fixed',
      top: 0,
      left: 0,
      color: 'var(--text)'
    }}>
      <h2 style={{ marginBottom: '2rem' }}>CondoManager AI</h2>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Link to="/gestor/dashboard">Dashboard</Link>
        <Link to="/modulos/intervencoes">Intervenções</Link>
        <Link to="/modulos/obras">Obras</Link>
        <Link to="/modulos/limpezas">Limpezas</Link>
        <Link to="/modulos/financeiro">Financeiro</Link>
        <Link to="/perfil">Perfil</Link>
      </nav>
    </div>
  );
}
`
);

/* ============================================================
   2. Bottom Navigation
   ============================================================ */

writeFile(
  "frontend/src/components/BottomNav.jsx",
  `
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/theme.css';

export default function BottomNav() {
  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      width: '100%',
      backgroundColor: 'var(--bg2)',
      padding: '1rem',
      display: 'flex',
      justifyContent: 'space-around',
      borderTop: '1px solid var(--border)'
    }}>
      <Link to="/gestor/dashboard">Dashboard</Link>
      <Link to="/modulos/intervencoes">Intervenções</Link>
      <Link to="/modulos/financeiro">Financeiro</Link>
      <Link to="/perfil">Perfil</Link>
    </div>
  );
}
`
);

/* ============================================================
   3. Card
   ============================================================ */

writeFile(
  "frontend/src/components/Card.jsx",
  `
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
`
);

/* ============================================================
   4. Table
   ============================================================ */

writeFile(
  "frontend/src/components/Table.jsx",
  `
import React from 'react';

export default function Table({ columns, data }) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          {columns.map((c) => (
            <th key={c} style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>
              {c}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {data.map((row, idx) => (
          <tr key={idx}>
            {columns.map((c) => (
              <td key={c} style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>
                {row[c]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
`
);

/* ============================================================
   5. Button
   ============================================================ */

writeFile(
  "frontend/src/components/Button.jsx",
  `
export default function Button({ children, onClick, color = 'var(--primary)' }) {
  return (
    <button
      onClick={onClick}
      style={{
        backgroundColor: color,
        color: '#fff',
        padding: '1rem',
        borderRadius: '8px',
        border: 'none',
        width: '100%',
        marginTop: '1rem'
      }}
    >
      {children}
    </button>
  );
}
`
);

/* ============================================================
   6. Input
   ============================================================ */

writeFile(
  "frontend/src/components/Input.jsx",
  `
export default function Input({ value, onChange, placeholder }) {
  return (
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{
        padding: '1rem',
        width: '100%',
        marginBottom: '1rem',
        borderRadius: '8px',
        border: '1px solid var(--border)'
      }}
    />
  );
}
`
);

/* ============================================================
   FINAL
   ============================================================ */

console.log("\\n🎯 Bloco 7 concluído com sucesso!");
console.log("Componentes premium criados automaticamente.");
