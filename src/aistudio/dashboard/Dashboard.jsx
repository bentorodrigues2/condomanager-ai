import React, { useEffect, useState } from 'react';
import Charts from './Charts';
import { getExpenses, getDocuments, getOwners, getAssemblies, getBalances } from '../data/condoData';

export default function Dashboard() {
  const [view, setView] = useState('charts');

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

  return (
    <div style={{ padding: '20px' }}>
      <h2>Dashboard Inteligente</h2>

      <button onClick={() => setView('charts')}>Gráficos</button>
      <button onClick={() => setView('raw')}>Dados</button>

      {view === 'charts' && <Charts />}

      {view === 'raw' && (
        <>
          <h3>Despesas</h3>
          <pre>{JSON.stringify(expenses, null, 2)}</pre>

          <h3>Documentos</h3>
          <pre>{JSON.stringify(documents, null, 2)}</pre>

          <h3>Proprietários</h3>
          <pre>{JSON.stringify(owners, null, 2)}</pre>

          <h3>Assembleias</h3>
          <pre>{JSON.stringify(assemblies, null, 2)}</pre>

          <h3>Saldos</h3>
          <pre>{JSON.stringify(balances, null, 2)}</pre>
        </>
      )}
    </div>
  );
}
