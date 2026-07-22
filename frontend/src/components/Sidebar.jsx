
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
