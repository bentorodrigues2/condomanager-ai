import React, { useEffect, useState } from 'react';
import { getDashboardStats } from './dashboardService';

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getDashboardStats().then(setStats);
  }, []);

  if (!stats) return <div style={{ padding: 40 }}>A carregar dashboard...</div>;

  return (
    <div style={{ padding: 40 }}>
      <h1>Dashboard</h1>
      <div style={{ display: 'flex', gap: 20 }}>
        <div className='card'>
          <h3>Prédios</h3>
          <p>{stats.predios}</p>
        </div>
        <div className='card'>
          <h3>Frações</h3>
          <p>{stats.fracoes}</p>
        </div>
        <div className='card'>
          <h3>Condominos</h3>
          <p>{stats.condominos}</p>
        </div>
        <div className='card'>
          <h3>Pagamentos Pendentes</h3>
          <p>{stats.pagamentosPendentes}</p>
        </div>
      </div>
    </div>
  );
}
