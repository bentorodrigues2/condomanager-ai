$root = "src\aistudio"

Write-Host "=== VERIFICAÇÃO DO AI STUDIO ==="

# 1. Verificar pasta src/aistudio
if (!(Test-Path $root)) {
    Write-Host "[ERRO] Pasta src/aistudio NÃO existe — criando..."
    New-Item -ItemType Directory -Path $root | Out-Null
} else {
    Write-Host "[OK] Pasta src/aistudio existe."
}

# 2. Verificar AIStudioApp.jsx
$aiStudioApp = "$root\AIStudioApp.jsx"
if (!(Test-Path $aiStudioApp)) {
    Write-Host "[ERRO] AIStudioApp.jsx NÃO existe — criando..."
    @"
import { Routes, Route } from "react-router-dom";
import AIStudioLayout from "./AIStudioLayout";
import Dashboard from "./dashboard/Dashboard";
import Login from "./pages/Login";

export default function AIStudioApp() {
  return (
    <AIStudioLayout>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </AIStudioLayout>
  );
}
"@ | Set-Content $aiStudioApp
} else {
    Write-Host "[OK] AIStudioApp.jsx existe."
}

# 3. Verificar AIStudioLayout.jsx
$layout = "$root\AIStudioLayout.jsx"
if (!(Test-Path $layout)) {
    Write-Host "[ERRO] AIStudioLayout.jsx NÃO existe — criando..."
    @"
export default function AIStudioLayout({ children }) {
  return (
    <div style={{ padding: '20px' }}>
      <h1>AI Studio</h1>
      {children}
    </div>
  );
}
"@ | Set-Content $layout
} else {
    Write-Host "[OK] AIStudioLayout.jsx existe."
}

# 4. Verificar RequireAIStudio.jsx
$require = "$root\RequireAIStudio.jsx"
if (!(Test-Path $require)) {
    Write-Host "[ERRO] RequireAIStudio.jsx NÃO existe — criando..."
    @"
import { supabase } from '../supabaseClient';

export default async function RequireAIStudio() {
  const { data } = await supabase.auth.getUser();
  return !!data.user;
}
"@ | Set-Content $require
} else {
    Write-Host "[OK] RequireAIStudio.jsx existe."
}

# 5. Verificar dashboard inteligente
$dashboard = "$root\dashboard\Dashboard.jsx"
if (!(Test-Path $dashboard)) {
    Write-Host "[ERRO] Dashboard.jsx NÃO existe — criando..."
    @"
import Charts from './Charts';

export default function Dashboard() {
  return (
    <div>
      <h2>Dashboard Inteligente</h2>
      <Charts />
    </div>
  );
}
"@ | Set-Content $dashboard
} else {
    Write-Host "[OK] Dashboard.jsx existe."
}

# 6. Verificar Charts.jsx
$charts = "$root\dashboard\Charts.jsx"
if (!(Test-Path $charts)) {
    Write-Host "[ERRO] Charts.jsx NÃO existe — criando..."
    @"
import React from 'react';

export default function Charts() {
  return <div>Gráficos aqui</div>;
}
"@ | Set-Content $charts
} else {
    Write-Host "[OK] Charts.jsx existe."
}

# 7. Verificar rota /app/*
$routerFile = "src\router.tsx"
$routerContent = Get-Content $routerFile -Raw

if ($routerContent -notmatch "/app/\*") {
    Write-Host "[ERRO] Rota /app/* NÃO existe — adicionando..."
    Add-Content $routerFile "`n<Route path='/app/*' element={<AIStudioApp />} />"
} else {
    Write-Host "[OK] Rota /app/* existe."
}

# 8. Verificar botão Área Pessoal
$sidebarFile = "src\pages\Perfil.jsx"
if (Test-Path $sidebarFile) {
    $sidebarContent = Get-Content $sidebarFile -Raw
    if ($sidebarContent -notmatch "/app/login") {
        Write-Host "[ERRO] Botão Área Pessoal NÃO aponta para o AI Studio — corrigindo..."
        Add-Content $sidebarFile "`n<Link to='/app/login'>Área Pessoal</Link>"
    } else {
        Write-Host "[OK] Botão Área Pessoal está correto."
    }
} else {
    Write-Host "[AVISO] Não encontrei Perfil.jsx — verifica manualmente."
}

Write-Host "=== VERIFICAÇÃO CONCLUÍDA ==="
