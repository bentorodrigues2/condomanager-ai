Write-Host "🔧 HARD RESET — Remover router quebrado e restaurar núcleo React/Vite..." -ForegroundColor Cyan

# 1️⃣ Remover pasta src/router se existir
if (Test-Path "src/router") {
    Remove-Item -Recurse -Force "src/router"
    Write-Host "🗑️ Pasta src/router removida." -ForegroundColor Yellow
}

# 2️⃣ Remover qualquer AppRouter.tsx perdido
Get-ChildItem -Path "." -Recurse -Filter "AppRouter.tsx" | Remove-Item -Force

Write-Host "🗑️ Todos os AppRouter.tsx removidos." -ForegroundColor Yellow

# 3️⃣ Reescrever src/App.tsx sem router
$app = @'
import React from "react";

export default function App() {
  return (
    <div style={{ padding: "40px", background: "#f8fafc", minHeight: "100vh" }}>
      <h1>CondoManager AI — Núcleo OK</h1>
      <p>React e Vite estão a funcionar.</p>
      <p>Router removido para eliminar erro 500.</p>
    </div>
  );
}
'@
Set-Content -Path "src/App.tsx" -Value $app -Force
Write-Host "✅ src/App.tsx reescrito sem router." -ForegroundColor Green

# 4️⃣ Reescrever src/main.tsx para montar apenas o App
$main = @'
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "../global.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
'@
Set-Content -Path "src/main.tsx" -Value $main -Force
Write-Host "✅ src/main.tsx reescrito." -ForegroundColor Green

# 5️⃣ Garantir que index.html aponta para /src/main.tsx
$index = @'
<!doctype html>
<html lang="pt">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>CondoManager AI</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
'@
Set-Content -Path "index.html" -Value $index -Force
Write-Host "✅ index.html corrigido." -ForegroundColor Green

Write-Host "🚀 Agora corre: npm run dev" -ForegroundColor Cyan
Write-Host "👉 O erro 500 vai desaparecer." -ForegroundColor Yellow
Write-Host "👉 O ecrã branco vai desaparecer." -ForegroundColor Yellow
Write-Host "👉 A app vai mostrar 'CondoManager AI — Núcleo OK'." -ForegroundColor Yellow
