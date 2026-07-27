
import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { gerarRelatorio } from '../../services/relatoriosService';

export default function Relatorios() {
  const [tipo, setTipo] = useState('');
  const [resultado, setResultado] = useState('');

  async function gerar() {
    const r = await gerarRelatorio(tipo);
    setResultado(r);
  }

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ marginLeft: '260px', padding: '2rem', width: '100%' }}>
        <h1>Relatórios</h1>

        <Card title="Gerar Relatório">
          <input
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            placeholder="Tipo de relatório..."
            style={{ padding: '1rem', width: '100%', marginBottom: '1rem' }}
          />
          <Button onClick={gerar}>Gerar</Button>
        </Card>

        {resultado && (
          <Card title="Resultado">
            <p>{resultado}</p>
          </Card>
        )}
      </div>
    </div>
  );
}
