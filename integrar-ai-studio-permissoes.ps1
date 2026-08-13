# Encoding: UTF-8
Write-Host "🚀 Iniciando integração avançada do AI Studio com permissões..."

$root = ".\src\aistudio"
$appRoot = ".\src"
$routerFile = "$appRoot\router.tsx"
$menuFile = "$appRoot\components\SidebarMenu.tsx"
$supabaseAI = "$root\supabase.ts"
$aiApp = "$root\AIStudioApp.jsx"
$aiRouter = "$root\router.tsx"
$permWrapper = "$root\RequireAIStudio.jsx"

# Validar pasta AI Studio
if (!(Test-Path $root)) {
    Write-Host "❌ ERRO: Pasta src/aistudio não encontrada!"
    exit 1
}

Write-Host "📁 Pasta AI Studio encontrada."

# 1) Criar wrapper de permissões
Write-Host "🔧 Criando RequireAIStudio.jsx..."

Set-Content $permWrapper @"
import { useEffect, useState } from 'react';
import supabase from './supabase';

export default function RequireAIStudio({ children }) {
  const [allowed, setAllowed] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      const user = data.user;
      if (!user) {
        setAllowed(false);
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('ai_studio_enabled')
        .eq('id', user.id)
        .single();

      setAllowed(profile?.ai_studio_enabled === true);
    });
  }, []);

  if (allowed === null) return <div>Loading...</div>;
  if (!allowed) return <div>Acesso negado.</div>;

  return children;
}
"@

Write-Host "✔ Wrapper de permissões criado."

# 2) Atualizar AIStudioApp.jsx
Write-Host "🔧 Atualizando AIStudioApp.jsx..."

Set-Content $aiApp @"
import React from 'react';
import RequireAIStudio from './RequireAIStudio';
import { AIStudioRouter } from './router';
import '../index.css';

export default function AIStudioApp() {
  return (
    <RequireAIStudio>
      <div style={{ width: '100%', height: '100vh', overflow: 'hidden' }}>
        <AIStudioRouter />
      </div>
    </RequireAIStudio>
  );
}
"@

Write-Host "✔ AIStudioApp.jsx atualizado."

# 3) Atualizar router interno
Write-Host "🔧 Atualizando router interno..."

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

Write-Host "✔ Router interno atualizado."

# 4) Atualizar supabase.ts
Write-Host "🔧 Ajustando supabase.ts..."

Set-Content $supabaseAI "import { supabase } from '../lib/supabaseClient';`nexport default supabase;"

Write-Host "✔ Supabase ajustado."

# 5) Atualizar router principal
if (Test-Path $routerFile) {
    Write-Host "🔧 Atualizando router.tsx..."

    Add-Content $routerFile "`n// AI STUDIO PERMISSIONS AUTO-INTEGRATION"
    Add-Content $routerFile "import AIStudioApp from './aistudio/AIStudioApp';"
    Add-Content $routerFile "<Route path='/ai-studio/*' element={<AIStudioApp />} />"

    Write-Host "✔ Rota adicionada."
} else {
    Write-Host "⚠ router.tsx não encontrado."
}

# 6) Atualizar menu
if (Test-Path $menuFile) {
    Write-Host "🔧 Atualizando SidebarMenu.tsx..."

    Add-Content $menuFile "`n// AI STUDIO PERMISSIONS AUTO-INTEGRATION"
    Add-Content $menuFile "{ label: 'AI Studio', icon: 'ai-assistant', path: '/ai-studio' },"

    Write-Host "✔ Menu atualizado."
} else {
    Write-Host "⚠ SidebarMenu.tsx não encontrado."
}

# 7) Commit + Push + Deploy
Write-Host "📦 Commit..."
git add .
git commit -m "[AUTO] Integração avançada do AI Studio com permissões" --allow-empty

Write-Host "⬆️ Push..."
git push

Write-Host "🚀 Deploy..."
vercel --prod

Write-Host "🏁 Integração avançada concluída!"
