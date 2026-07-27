
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
