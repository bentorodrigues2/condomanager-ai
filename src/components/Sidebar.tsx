import React from "react";
import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div style={{
      width: '220px',
      background: '#0f172a',
      color: 'white',
      height: '100vh',
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      <h2 style={{ marginBottom: '30px' }}>Menu</h2>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</Link>
        <Link to="/predios" style={{ color: 'white', textDecoration: 'none' }}>Prédios</Link>
        <Link to="/fracoes" style={{ color: 'white', textDecoration: 'none' }}>Frações</Link>
        <Link to="/condominos" style={{ color: 'white', textDecoration: 'none' }}>Condóminos</Link>
        <Link to="/pagamentos" style={{ color: 'white', textDecoration: 'none' }}>Pagamentos</Link>
      </nav>
    </div>
  );
}
