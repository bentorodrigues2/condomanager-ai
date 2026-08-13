
import React from 'react';
import Sidebar from '../../components/Sidebar';
import Card from '../../components/Card';
import Table from '../../components/Table';
// import removido automaticamente

export default function Limpezas() {
  const { data } = null;

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />

      <div style={{ marginLeft: '260px', padding: '2rem', width: '100%' }}>
        <h1>Limpezas</h1>

        <Card title="Plano de Limpezas">
          <Table
            columns={['descricao', 'data', 'estado']}
            data={data}
          />
        </Card>
      </div>
    </div>
  );
}
