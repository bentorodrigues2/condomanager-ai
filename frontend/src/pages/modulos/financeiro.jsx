
import React from 'react';
import Sidebar from '../../components/Sidebar';
import Card from '../../components/Card';
import Table from '../../components/Table';
import { useSupabaseTable } from '../../services/useSupabase';

export default function Financeiro() {
  const { data } = useSupabaseTable('financeiro_movimentos');

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />

      <div style={{ marginLeft: '260px', padding: '2rem', width: '100%' }}>
        <h1>Financeiro</h1>

        <Card title="Movimentos Financeiros">
          <Table
            columns={['tipo', 'valor', 'descricao', 'data']}
            data={data}
          />
        </Card>
      </div>
    </div>
  );
}
