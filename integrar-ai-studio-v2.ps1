# Encoding: UTF-8
Write-Host "🚀 Iniciando integração automática do AI Studio..."

$root = ".\src\aistudio"
$appRoot = ".\src"
$routerFile = "$appRoot\router.tsx"
$menuFile = "$appRoot\components\SidebarMenu.tsx"
$supabaseAI = "$root\supabase.ts"
$aiApp = "$root\AIStudioApp.jsx"
$aiRouter = "$root\router.tsx"

# Validar pasta AI Studio
if (!(Test-Path $root)) {
    Write-Host "❌ ERRO: Pasta src/aistudio não encontrada!"
    exit 1
}

Write-Host "📁 Pasta AI Studio encontrada."

# 1) ROTA
if (Test-Path $routerFile) {
    Write-Host "🔧 Atualizando router.tsx..."

    Add-Content $routerFile "`n// AI STUDIO AUTO-INTEGRATION"
    Add-Content $routerFile "import AIStudioApp from './aistudio/AIStudioApp';"
    Add-Content $routerFile "<Route path='/ai-studio/*' element={<AIStudioApp />} />"

    Write-Host "✔ Rota adicionada."
} else {
    Write-Host "⚠ router.tsx não encontrado."
}

# 2) MENU
if (Test-Path $menuFile) {
    Write-Host "🔧 Atualizando SidebarMenu.tsx..."

    Add-Content $menuFile "`n// AI STUDIO AUTO-INTEGRATION"
    Add-Content $menuFile "{ label: 'AI Studio', icon: 'ai-assistant', path: '/ai-studio' },"

    Write-Host "✔ Menu atualizado."
} else {
    Write-Host "⚠ SidebarMenu.tsx não encontrado."
}

# 3) SUPABASE
Write-Host "🔧 Ajustando supabase.ts..."

Set-Content $supabaseAI "import { supabase } from '../lib/supabaseClient';`nexport default supabase;"

Write-Host "✔ Supabase ajustado."

# 4) AIStudioApp.jsx
Write-Host "🔧 Atualizando AIStudioApp.jsx..."

Set-Content $aiApp @"
import React from 'react';
import { AIStudioRouter } from './router';
import '../index.css';

export default function AIStudioApp() {
  return (
    <div style={{ width: '100%', height: '100vh', overflow: 'hidden' }}>
      <AIStudioRouter />
    </div>
  );
}
"@

Write-Host "✔ AIStudioApp.jsx atualizado."

# 5) Router interno
Write-Host "🔧 Criando router interno..."

Set-Content $aiRouter @"
import { Routes, Route } from 'react-router-dom';
import StudioDashboard from './pages/StudioDashboard';
import StudioBrowser from './pages/StudioBrowser';
import StudioSettings from './pages/StudioSettings';

export function AIStudioRouter() {
  return (
    <Routes>
      <Route path='/' element={<StudioDashboard />} />
      <Route path='/browser' element={<StudioBrowser />} />
      <Route path='/settings' element={<StudioSettings />} />
    </Routes>
  );
}
"@

Write-Host "✔ Router interno criado."

# 6) Commit + Push + Deploy
Write-Host "📦 Commit..."
git add .
git commit -m "[AUTO] Integração completa do AI Studio" --allow-empty

Write-Host "⬆️ Push..."
git push

Write-Host "🚀 Deploy..."
vercel --prod

Write-Host "🏁 Integração automática concluída!"
