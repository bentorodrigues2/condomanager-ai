# Encoding: UTF-8
Write-Host "🚀 Iniciando integração do Dashboard Inteligente no AI Studio..."

$root = ".\src\aistudio"
$dashboard = "$root\dashboard"
$aiApp = "$root\AIStudioApp.jsx"

# Criar pasta do dashboard
if (!(Test-Path $dashboard)) { New-Item -ItemType Directory -Path $dashboard | Out-Null }

Write-Host "📁 Pasta dashboard criada."

# 1) Criar módulo de gráficos
Write-Host "🔧 Criando módulo de gráficos..."

Set-Content "$dashboard\Dashboard.jsx" @"
import React, { useEffect, useState } from 'react';
import { getExpenses, getDocuments, getOwners, getAssemblies, getBalances } from '../data/condoData';

export default function Dashboard() {
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
    </div>
  );
}
"@

Write-Host "✔ Dashboard.jsx criado."

# 2) Atualizar AIStudioApp.jsx para incluir dashboard
Write-Host "🔧 Atualizando AIStudioApp.jsx..."

Set-Content $aiApp @"
import React, { useState } from 'react';
import RequireAIStudio from './RequireAIStudio';
import AIStudioLayout from './AIStudioLayout';
import Dashboard from './dashboard/Dashboard';
import { AIStudioRouter } from './router';
import '../index.css';

export default function AIStudioApp() {
  const [view, setView] = useState('dashboard');

  return (
    <RequireAIStudio>
      <AIStudioLayout>
        <div style={{ padding: '20px' }}>
          <button onClick={() => setView('dashboard')}>Dashboard</button>
          <button onClick={() => setView('router')}>Navegação</button>
        </div>

        {view === 'dashboard' && <Dashboard />}
        {view === 'router' && <AIStudioRouter />}
      </AIStudioLayout>
    </RequireAIStudio>
  );
}
"@

Write-Host "✔ AIStudioApp.jsx atualizado."

# 3) Criar vercel.json para eliminar perguntas
Write-Host "🔧 Criando vercel.json..."

Set-Content "vercel.json" @"
{
  "version": 2,
  "project": "condomanager-ai",
  "orgId": "bento-rodrigues2",
  "prod": true
}
"@

Write-Host "✔ vercel.json criado."

# 4) Link automático
Write-Host "🔧 Ligando projeto ao Vercel..."
vercel link --yes

# 5) Puxar variáveis automaticamente
Write-Host "🔧 Carregando variáveis..."
vercel env pull .env.local --yes

# 6) Commit + Push + Deploy
Write-Host "📦 Commit..."
git add .
git commit -m "[AUTO] Dashboard Inteligente do AI Studio" --allow-empty

Write-Host "⬆️ Push..."
git push

Write-Host "🚀 Deploy..."
vercel --prod

Write-Host "🏁 Dashboard Inteligente integrado!"
