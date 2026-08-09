Write-Host "🤖 A preparar integração automática AI Studio + Supabase..."

# Criar pasta aistudio
New-Item -ItemType Directory -Force -Path "src/aistudio" | Out-Null

# Criar AIStudioApp.tsx (wrapper fixo)
@"
import React from 'react';
import { AIStudioRouter } from './router';
import './index.css';

export default function AIStudioApp() {
  return (
    <div style={{ width: '100%', height: '100vh', overflow: 'hidden' }}>
      <AIStudioRouter />
    </div>
  );
}
"@ | Set-Content -Path "src/aistudio/AIStudioApp.tsx"
# Criar router.tsx
@"
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import StudioDashboard from './pages/StudioDashboard';
import StudioBrowser from './pages/StudioBrowser';
import StudioSettings from './pages/StudioSettings';

export function AIStudioRouter() {
  return (
    <Routes>
      <Route path='login' element={<Login />} />
      <Route path='dashboard' element={<StudioDashboard />} />
      <Route path='browser' element={<StudioBrowser />} />
      <Route path='settings' element={<StudioSettings />} />
      <Route path='*' element={<Login />} />
    </Routes>
  );
}
"@ | Set-Content -Path "src/aistudio/router.tsx"
# Criar index.css
@"
body {
  background: #f5f5f5;
  margin: 0;
  font-family: sans-serif;
}
"@ | Set-Content -Path "src/aistudio/index.css"
# Criar pasta pages
New-Item -ItemType Directory -Force -Path "src/aistudio/pages" | Out-Null

# Login.jsx
@"
import React, { useState } from 'react';
import { supabase } from '../../supabase/authClient';

export default function Login() {
  const [email, setEmail] = useState('');

  async function login() {
    await supabase.auth.signInWithOtp({ email });
    alert('Verifique o seu email para entrar.');
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Login AI Studio</h1>
      <input
        type='email'
        placeholder='Email'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ padding: 10, width: 300 }}
      />
      <button onClick={login} style={{ marginLeft: 10, padding: 10 }}>
        Entrar
      </button>
    </div>
  );
}
"@ | Set-Content -Path "src/aistudio/pages/Login.jsx"
# StudioDashboard.jsx
@"
import React from 'react';

export default function StudioDashboard() {
  return (
    <div style={{ padding: 40 }}>
      <h1>AI Studio — Dashboard</h1>
      <p>Área pessoal ligada ao Supabase.</p>
    </div>
  );
}
"@ | Set-Content -Path "src/aistudio/pages/StudioDashboard.jsx"

# StudioBrowser.jsx
@"
import React from 'react';

export default function StudioBrowser() {
  return (
    <div style={{ padding: 40 }}>
      <h1>AI Studio — Browser</h1>
      <p>Ferramentas de navegação pessoal.</p>
    </div>
  );
}
"@ | Set-Content -Path "src/aistudio/pages/StudioBrowser.jsx"

# StudioSettings.jsx
@"
import React from 'react';

export default function StudioSettings() {
  return (
    <div style={{ padding: 40 }}>
      <h1>AI Studio — Settings</h1>
      <p>Configurações pessoais.</p>
    </div>
  );
}
"@ | Set-Content -Path "src/aistudio/pages/StudioSettings.jsx"
# Validar rota no App.tsx
$AppFile = "src/App.tsx"
if (Test-Path $AppFile) {
    $content = Get-Content $AppFile -Raw

    if ($content -notmatch "AIStudioApp") {
        Write-Host "✔ A adicionar import do AIStudioApp ao App.tsx..."
        $importLine = 'import AIStudioApp from "./aistudio/AIStudioApp";'
        $newContent = $importLine + "`n" + $content
        $newContent | Set-Content $AppFile
    }

    if ($content -notmatch "/app/*") {
        Write-Host "✔ A adicionar rota /app/* ao App.tsx..."
        $routeLine = '        <Route path="/app/*" element={<AIStudioApp />} />'
        (Get-Content $AppFile) -replace "<Routes>", "<Routes>`n$routeLine" | Set-Content $AppFile
    }
}

Write-Host "🎉 AI Studio + Supabase integrado automaticamente!"
Write-Host "🚀 Amanhã só tens de substituir a pasta src/aistudio/ com o ZIP do AI Studio."
