import React, { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { getExpenses, getDocuments, getOwners } from '../data/condoData';

import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend
);

export default function Charts() {
  const [expenses, setExpenses] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [owners, setOwners] = useState([]);

  useEffect(() => {
    getExpenses().then(r => setExpenses(r.data || []));
    getDocuments().then(r => setDocuments(r.data || []));
    getOwners().then(r => setOwners(r.data || []));
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
