
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
