
import React from 'react';
import { NavLink } from 'react-router-dom';

export function Sidebar({ theme, isOpen, onClose }) {
  const colors = theme.colors;

  const linkStyle = {
    padding: '0.75rem 1rem',
    borderRadius: '0.5rem',
    marginBottom: '0.25rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: colors.sidebarText,
    textDecoration: 'none',
    fontSize: '0.95rem'
  };

  const activeStyle = {
    ...linkStyle,
    background: colors.sidebarActiveBg
  };

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            zIndex: 40
          }}
        />
      )}

      <aside
        style={{
          position: 'fixed',
          top: 0,
          left: isOpen ? 0 : '-260px',
          height: '100vh',
          width: '260px',
          background: colors.sidebarBg,
          color: colors.sidebarText,
          padding: '1.5rem 1rem',
          display: 'flex',
          flexDirection: 'column',
          borderRight: `1px solid ${colors.border}`,
          transition: 'left 0.3s ease',
          zIndex: 50
        }}
      >
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{theme.brandName}</div>
          <div style={{ fontSize: '0.8rem', color: colors.textLight }}>Painel de gestão de condomínio</div>
        </div>

        <NavLink to="/" style={({ isActive }) => (isActive ? activeStyle : linkStyle)} onClick={onClose}>
          <span>📊</span><span>Dashboard</span>
        </NavLink>

        <NavLink to="/predios" style={({ isActive }) => (isActive ? activeStyle : linkStyle)} onClick={onClose}>
          <span>🏢</span><span>Prédios & Frações</span>
        </NavLink>

        <NavLink to="/notificacoes" style={({ isActive }) => (isActive ? activeStyle : linkStyle)} onClick={onClose}>
          <span>🔔</span><span>Notificações</span>
        </NavLink>

        <NavLink to="/perfil" style={({ isActive }) => (isActive ? activeStyle : linkStyle)} onClick={onClose}>
          <span>👤</span><span>Perfil & Autenticação</span>
        </NavLink>
      </aside>
    </>
  );
}
