Write-Host "📊 Iniciando integração de gráficos reais no AI Studio..."

$root = ".\src\aistudio"
$dashboard = "$root\dashboard"
$chartFile = "$dashboard\Charts.jsx"

# Criar Charts.jsx
Write-Host "🔧 Criando Charts.jsx..."

Set-Content $chartFile @"
import React, { useEffect, useState } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { getExpenses, getDocuments, getOwners, getAssemblies, getBalances } from '../data/condoData';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend
);

export default function Charts() {
  const [expenses, setExpenses] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [owners, setOwners] = useState([]);
  const [assemblies, setAssemblies] = useState([]);
  const [balances, setBalances] = useState([]);

  useEffect(() => {
    getExpenses().then(r => setExpenses(r.data || []));
    getDocuments().then(r => setDocuments(r.data || []));
    getOwners().then(r => setOwners(r.data || []));
    getAssemblies().then(r => setAssemblies(r.data || []));
    getBalances().then(r => setBalances(r.data || []));
  }, []);

  const expensesChart = {
    labels: expenses.map(e => e.date),
    datasets: [{
      label: 'Despesas (€)',
      data: expenses.map(e => e.amount),
      backgroundColor: 'rgba(255, 99, 132, 0.5)'
    }]
  };

  const documentsChart = {
    labels: documents.map(d => d.category),
    datasets: [{
      label: 'Documentos por categoria',
      data: documents.map(d => 1),
      backgroundColor: 'rgba(54, 162, 235, 0.5)'
    }]
  };

  const ownersChart = {
    labels: owners.map(o => o.name),
    datasets: [{
      label: 'Proprietários',
      data: owners.map(o => o.fractions || 1),
      backgroundColor: 'rgba(255, 206, 86, 0.5)'
    }]
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Gráficos Inteligentes</h2>

      <h3>Despesas</h3>
      <Bar data={expensesChart} />

      <h3>Documentos</h3>
      <Pie data={documentsChart} />

      <h3>Proprietários</h3>
      <Bar data={ownersChart} />
    </div>
  );
}
"@

Write-Host "✔ Charts.jsx criado."

# Atualizar Dashboard.jsx para incluir gráficos
Write-Host "🔧 Atualizando Dashboard.jsx..."

Set-Content "$dashboard\Dashboard.jsx" @"
import React, { useState } from 'react';
import Charts from './Charts';

export default function Dashboard() {
  const [view, setView] = useState('charts');

  return (
    <div style={{ padding: '20px' }}>
      <h2>Dashboard Inteligente</h2>

      <button onClick={() => setView('charts')}>Gráficos</button>
      <button onClick={() => setView('raw')}>Dados</button>

      {view === 'charts' && <Charts />}
      {view === 'raw' && <div>Dados brutos disponíveis no módulo anterior.</div>}
    </div>
  );
}
"@

Write-Host "✔ Dashboard.jsx atualizado."

# Commit + Push + Deploy
Write-Host "📦 Commit..."
git add .
git commit -m "[AUTO] Integração de gráficos reais no AI Studio" --allow-empty

Write-Host "⬆️ Push..."
git push

Write-Host "🚀 Deploy..."
vercel --prod

Write-Host "🏁 Gráficos integrados!"
