/**
 * CondoManager AI — setup-v3-charts.cjs
 * Bloco 13: Dashboard Premium com Gráficos (Chart.js + Supabase)
 */

const fs = require("fs");
const path = require("path");

function writeFile(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
  console.log("📄 Criado/Atualizado:", filePath);
}

/* ============================================================
   1. Instalar Chart.js (instrução automática)
   ============================================================ */

writeFile(
  "frontend/install-chartjs.txt",
  `
Execute no terminal:

npm install chart.js
`
);

/* ============================================================
   2. Serviço de gráficos
   ============================================================ */

writeFile(
  "frontend/src/services/chartsService.js",
  `
import { supabase } from './supabaseClient';

export async function getIntervencoesPorEstado() {
  const { data } = await supabase.from('intervencoes').select('estado');
  const counts = {};

  data.forEach(i => {
    counts[i.estado] = (counts[i.estado] || 0) + 1;
  });

  return counts;
}

export async function getObrasPorEstado() {
  const { data } = await supabase.from('obras').select('estado');
  const counts = {};

  data.forEach(o => {
    counts[o.estado] = (counts[o.estado] || 0) + 1;
  });

  return counts;
}

export async function getLimpezasPorMes() {
  const { data } = await supabase.from('limpezas').select('data');
  const counts = {};

  data.forEach(l => {
    const mes = new Date(l.data).getMonth() + 1;
    counts[mes] = (counts[mes] || 0) + 1;
  });

  return counts;
}

export async function getFinanceiroResumo() {
  const { data } = await supabase.from('financeiro_movimentos').select('tipo, valor');
  let receitas = 0;
  let despesas = 0;

  data.forEach(m => {
    if (m.tipo === 'receita') receitas += Number(m.valor);
    if (m.tipo === 'despesa') despesas += Number(m.valor);
  });

  return { receitas, despesas };
}
`
);

/* ============================================================
   3. Componente ChartCard
   ============================================================ */

writeFile(
  "frontend/src/components/ChartCard.jsx",
  `
import React, { useEffect, useRef } from 'react';
import Card from './Card';
import Chart from 'chart.js/auto';

export default function ChartCard({ title, labels, data }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: title,
          data,
          backgroundColor: 'rgba(0, 123, 255, 0.6)',
          borderColor: 'rgba(0, 123, 255, 1)',
          borderWidth: 1
        }]
      }
    });
  }, [labels, data]);

  return (
    <Card title={title}>
      <canvas ref={canvasRef} height="120"></canvas>
    </Card>
  );
}
`
);

/* ============================================================
   4. Dashboard Premium com Gráficos
   ============================================================ */

writeFile(
  "frontend/src/pages/gestor/DashboardPremium.jsx",
  `
import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import ChartCard from '../../components/ChartCard';

import {
  getIntervencoesPorEstado,
  getObrasPorEstado,
  getLimpezasPorMes,
  getFinanceiroResumo
} from '../../services/chartsService';

export default function DashboardPremium() {
  const [intervencoes, setIntervencoes] = useState({});
  const [obras, setObras] = useState({});
  const [limpezas, setLimpezas] = useState({});
  const [financeiro, setFinanceiro] = useState({ receitas: 0, despesas: 0 });

  useEffect(() => {
    async function carregar() {
      setIntervencoes(await getIntervencoesPorEstado());
      setObras(await getObrasPorEstado());
      setLimpezas(await getLimpezasPorMes());
      setFinanceiro(await getFinanceiroResumo());
    }
    carregar();
  }, []);

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />

      <div style={{ marginLeft: '260px', padding: '2rem', width: '100%' }}>
        <h1>Dashboard Premium</h1>

        <ChartCard
          title="Intervenções por Estado"
          labels={Object.keys(intervencoes)}
          data={Object.values(intervencoes)}
        />

        <ChartCard
          title="Obras por Estado"
          labels={Object.keys(obras)}
          data={Object.values(obras)}
        />

        <ChartCard
          title="Limpezas por Mês"
          labels={Object.keys(limpezas)}
          data={Object.values(limpezas)}
        />

        <ChartCard
          title="Financeiro (Receitas vs Despesas)"
          labels={['Receitas', 'Despesas']}
          data={[financeiro.receitas, financeiro.despesas]}
        />
      </div>
    </div>
  );
}
`
);

/* ============================================================
   5. Atualizar Router
   ============================================================ */

writeFile(
  "frontend/src/router/AppRouter.jsx",
  `
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import DashboardGestor from '../pages/gestor/Dashboard';
import DashboardPremium from '../pages/gestor/DashboardPremium';
import Intervencoes from '../pages/modulos/intervencoes';
import Obras from '../pages/modulos/obras';
import Limpezas from '../pages/modulos/limpezas';
import Financeiro from '../pages/modulos/financeiro';
import Documentos from '../pages/modulos/documentos';
import Perfil from '../pages/Perfil';
import AcessoNegado from '../pages/AcessoNegado';
import AssistenteIA from '../pages/AssistenteIA';

import ProtectedRoute from '../components/ProtectedRoute';
import { UserProvider } from '../context/UserContext';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <UserProvider>
        <Routes>

          <Route
            path="/gestor/dashboard"
            element={
              <ProtectedRoute allow={['gestor']}>
                <DashboardGestor />
              </ProtectedRoute>
            }
          />

          <Route
            path="/gestor/dashboard-premium"
            element={
              <ProtectedRoute allow={['gestor']}>
                <DashboardPremium />
              </ProtectedRoute>
            }
          />

          <Route
            path="/modulos/intervencoes"
            element={
              <ProtectedRoute allow={['gestor', 'fornecedor']}>
                <Intervencoes />
              </ProtectedRoute>
            }
          />

          <Route
            path="/modulos/obras"
            element={
              <ProtectedRoute allow={['gestor']}>
                <Obras />
              </ProtectedRoute>
            }
          />

          <Route
            path="/modulos/limpezas"
            element={
              <ProtectedRoute allow={['gestor']}>
                <Limpezas />
              </ProtectedRoute>
            }
          />

          <Route
            path="/modulos/financeiro"
            element={
              <ProtectedRoute allow={['gestor', 'proprietario']}>
                <Financeiro />
              </ProtectedRoute>
            }
          />

          <Route
            path="/modulos/documentos"
            element={
              <ProtectedRoute allow={['gestor', 'proprietario']}>
                <Documentos />
              </ProtectedRoute>
            }
          />

          <Route path="/assistente-ia" element={<AssistenteIA />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/acesso-negado" element={<AcessoNegado />} />

        </Routes>
      </UserProvider>
    </BrowserRouter>
  );
}
`
);

/* ============================================================
   FINAL
   ============================================================ */

console.log("\\n🎯 Bloco 13 concluído com sucesso!");
console.log("Dashboard Premium com gráficos criado automaticamente.");
