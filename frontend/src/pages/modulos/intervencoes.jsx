
import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Card from '../../components/Card';
import Table from '../../components/Table';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useSupabaseTable } from '../../services/useSupabase';

export default function Intervencoes() {
  const { data, insert } = useSupabaseTable('intervencoes');
  const [descricao, setDescricao] = useState('');

  async function adicionar() {
    if (!descricao) return;
    await insert({ descricao, estado: 'pendente' });
    setDescricao('');
  }

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />

      <div style={{ marginLeft: '260px', padding: '2rem', width: '100%' }}>
        <h1>Intervenções</h1>

        <Card title="Adicionar Intervenção">
          <Input
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Descrição"
          />
          <Button onClick={adicionar}>Adicionar</Button>
        </Card>

        <Card title="Lista de Intervenções">
          <Table
            columns={['descricao', 'estado']}
            data={data}
          />
        </Card>
      </div>
    </div>
  );
}
