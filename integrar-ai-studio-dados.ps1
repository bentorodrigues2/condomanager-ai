# Encoding: UTF-8
Write-Host "🚀 Iniciando integração de dados reais do condomínio no AI Studio..."

$root = ".\src\aistudio"
$aiData = "$root\data"
$aiQueries = "$root\queries"
$aiApp = "$root\AIStudioApp.jsx"

# Criar pastas se não existirem
if (!(Test-Path $aiData)) { New-Item -ItemType Directory -Path $aiData | Out-Null }
if (!(Test-Path $aiQueries)) { New-Item -ItemType Directory -Path $aiQueries | Out-Null }

Write-Host "📁 Pastas de dados criadas."

# 1) Criar módulo de acesso ao Supabase
Write-Host "🔧 Criando módulo de dados..."

Set-Content "$aiData\condoData.js" @"
import supabase from '../supabase';

export async function getExpenses() {
  return await supabase.from('expenses').select('*').order('date', { ascending: false });
}

export async function getDocuments() {
  return await supabase.from('documents').select('*').order('uploaded_at', { ascending: false });
}

export async function getOwners() {
  return await supabase.from('owners').select('*');
}

export async function getAssemblies() {
  return await supabase.from('assemblies').select('*').order('date', { ascending: false });
}

export async function getBalances() {
  return await supabase.from('balances').select('*');
}
"@

Write-Host "✔ Módulo de dados criado."

# 2) Criar módulo de perguntas inteligentes
Write-Host "🔧 Criando módulo de IA..."

Set-Content "$aiQueries\smartQueries.js" @"
import { getExpenses, getDocuments, getOwners, getAssemblies, getBalances } from '../data/condoData';

export async function askAIStudio(question) {
  question = question.toLowerCase();

  if (question.includes('despesa') || question.includes('gasto')) {
    return await getExpenses();
  }

  if (question.includes('documento')) {
    return await getDocuments();
  }

  if (question.includes('proprietário') || question.includes('dono')) {
    return await getOwners();
  }

  if (question.includes('assembleia')) {
    return await getAssemblies();
  }

  if (question.includes('saldo') || question.includes('conta')) {
    return await getBalances();
  }

  return { error: 'Não encontrei nada relacionado com a pergunta.' };
}
"@

Write-Host "✔ Módulo de IA criado."

# 3) Atualizar AIStudioApp.jsx para usar perguntas reais
Write-Host "🔧 Atualizando AIStudioApp.jsx..."

Set-Content $aiApp @"
import React, { useState } from 'react';
import RequireAIStudio from './RequireAIStudio';
import AIStudioLayout from './AIStudioLayout';
import { askAIStudio } from './queries/smartQueries';
import '../index.css';

export default function AIStudioApp() {
  const [result, setResult] = useState(null);
  const [question, setQuestion] = useState('');

  async function handleAsk() {
    const response = await askAIStudio(question);
    setResult(response);
  }

  return (
    <RequireAIStudio>
      <AIStudioLayout>
        <div style={{ padding: '20px' }}>
          <h2>AI Studio — Dados do Condomínio</h2>
          <input
            type='text'
            placeholder='Pergunta ao AI Studio...'
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
          />
          <button onClick={handleAsk}>Perguntar</button>

          <pre style={{ marginTop: '20px' }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      </AIStudioLayout>
    </RequireAIStudio>
  );
}
"@

Write-Host "✔ AIStudioApp.jsx atualizado."

# 4) Commit + Push + Deploy
Write-Host "📦 Commit..."
git add .
git commit -m "[AUTO] Integração de dados reais no AI Studio" --allow-empty

Write-Host "⬆️ Push..."
git push

Write-Host "🚀 Deploy..."
vercel --prod

Write-Host "🏁 Integração de dados concluída!"
