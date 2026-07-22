
import React from 'react';
import Sidebar from '../../components/Sidebar';
import Card from '../../components/Card';
import { useSupabaseTable } from '../../services/useSupabase';
import '../../styles/theme.css';

export default function DashboardGestor() {
  const { data: condominios } = useSupabaseTable('condominios');
  const { data: obras } = useSupabaseTable('obras');
  const { data: limpezas } = useSupabaseTable('limpezas');

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />

      <div style={{ marginLeft: '260px', padding: '2rem', width: '100%' }}>
        <h1>Dashboard do Gestor</h1>

        <Card title="Condomínios">
          <p>Total: {condominios.length}</p>
        </Card>

        <Card title="Obras Ativas">
          <p>Total: {obras.filter(o => o.estado !== 'concluida').length}</p>
        </Card>

        <Card title="Limpezas Agendadas">
          <p>Total: {limpezas.filter(l => l.estado === 'agendada').length}</p>
        </Card>
      </div>
    </div>
  );
}
