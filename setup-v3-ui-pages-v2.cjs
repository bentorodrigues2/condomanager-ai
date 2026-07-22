/**
 * CondoManager AI — setup-v3-ui-pages-v2.cjs
 * Bloco 8 (versão automática): Integração Premium nas Páginas
 */

const fs = require("fs");
const path = require("path");

function writeFile(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
  console.log("📄 Atualizado:", filePath);
}

/* ============================================================
   Dashboard do Gestor
   ============================================================ */

writeFile(
  "frontend/src/pages/gestor/Dashboard.jsx",
  `
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
`
);

/* ============================================================
   Intervenções
   ============================================================ */

writeFile(
  "frontend/src/pages/modulos/intervencoes.jsx",
  `
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
`
);

/* ============================================================
   Obras
   ============================================================ */

writeFile(
  "frontend/src/pages/modulos/obras.jsx",
  `
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
`
);

/* ============================================================
   Limpezas
   ============================================================ */

writeFile(
  "frontend/src/pages/modulos/limpezas.jsx",
  `
import React from 'react';
import Sidebar from '../../components/Sidebar';
import Card from '../../components/Card';
import Table from '../../components/Table';
import { useSupabaseTable } from '../../services/useSupabase';

export default function Limpezas() {
  const { data } = useSupabaseTable('limpezas');

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
`
);

/* ============================================================
   Financeiro
   ============================================================ */

writeFile(
  "frontend/src/pages/modulos/financeiro.jsx",
  `
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
`
);

/* ============================================================
   Perfil
   ============================================================ */

writeFile(
  "frontend/src/pages/Perfil.jsx",
  `
import React from 'react';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import '../styles/theme.css';

export default function Perfil() {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />

      <div style={{ marginLeft: '260px', padding: '2rem', width: '100%' }}>
        <h1>Perfil</h1>

        <Card title="Preferências">
          <p>Gestão de tema, biometria e sessão já configurados.</p>
        </Card>
      </div>
    </div>
  );
}
`
);

/* ============================================================
   FINAL
   ============================================================ */

console.log("\\n🎯 Bloco 8 (v2) concluído com sucesso!");
console.log("Todas as páginas premium foram atualizadas automaticamente.");
