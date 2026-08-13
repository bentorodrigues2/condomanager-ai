# Encoding: UTF-8
Write-Host "🚀 Iniciando integração de layout do AI Studio..."

$root = ".\src\aistudio"
$appRoot = ".\src"
$layoutMain = "$appRoot\layout\MainLayout.jsx"
$layoutAI = "$root\AIStudioLayout.jsx"
$aiApp = "$root\AIStudioApp.jsx"
$routerFile = "$appRoot\router.tsx"

# Validar pastas
if (!(Test-Path $root)) {
    Write-Host "❌ ERRO: Pasta src/aistudio não encontrada!"
    exit 1
}

Write-Host "📁 Pasta AI Studio encontrada."

# 1) Criar AIStudioLayout.jsx
Write-Host "🔧 Criando AIStudioLayout.jsx..."

Set-Content $layoutAI @"
import React from 'react';
import MainLayout from '../layout/MainLayout';

export default function AIStudioLayout({ children }) {
  return (
    <MainLayout>
      {children}
    </MainLayout>
  );
}
"@

Write-Host "✔ AIStudioLayout.jsx criado."

# 2) Atualizar AIStudioApp.jsx
Write-Host "🔧 Atualizando AIStudioApp.jsx..."

Set-Content $aiApp @"
import React from 'react';
import RequireAIStudio from './RequireAIStudio';
import AIStudioLayout from './AIStudioLayout';
import { AIStudioRouter } from './router';
import '../index.css';

export default function AIStudioApp() {
  return (
    <RequireAIStudio>
      <AIStudioLayout>
        <AIStudioRouter />
      </AIStudioLayout>
    </RequireAIStudio>
  );
}
"@

Write-Host "✔ AIStudioApp.jsx atualizado."

# 3) Atualizar router principal
if (Test-Path $routerFile) {
    Write-Host "🔧 Atualizando router.tsx..."

    Add-Content $routerFile "`n// AI STUDIO LAYOUT AUTO-INTEGRATION"
    Add-Content $routerFile "import AIStudioApp from './aistudio/AIStudioApp';"
    Add-Content $routerFile "<Route path='/ai-studio/*' element={<AIStudioApp />} />"

    Write-Host "✔ Rota atualizada."
} else {
    Write-Host "⚠ router.tsx não encontrado."
}

# 4) Commit + Push + Deploy
Write-Host "📦 Commit..."
git add .
git commit -m "[AUTO] Integração de layout do AI Studio" --allow-empty

Write-Host "⬆️ Push..."
git push

Write-Host "🚀 Deploy..."
vercel --prod

Write-Host "🏁 Integração de layout concluída!"
