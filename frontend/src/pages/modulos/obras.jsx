
import React from 'react';
import Sidebar from '../../components/Sidebar';
import Card from '../../components/Card';
import Table from '../../components/Table';
import { useSupabaseTable } from '../../services/useSupabase';

export default function Obras() {
  const { data } = useSupabaseTable('obras');

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />

      <div style={{ marginLeft: '260px', padding: '2rem', width: '100%' }}>
        <h1>Obras</h1>

        <Card title="Lista de Obras">
          <Table
            columns={['descricao', 'estado']}
            data={data}
          />
        </Card>
      </div>
    </div>
  );
}
