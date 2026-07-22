Write-Host "🔧 HARD RESET — CondoManager AI" -ForegroundColor Cyan

# 1️⃣ Garantir que a pasta src existe
New-Item -ItemType Directory -Force -Path "src" | Out-Null

# 2️⃣ Remover router quebrado
if (Test-Path "src/router") {
    Remove-Item -Recurse -Force "src/router"
    Write-Host "🗑️ Pasta src/router removida." -ForegroundColor Yellow
}

# 3️⃣ Remover qualquer AppRouter.tsx perdido
Get-ChildItem -Path "." -Recurse -Filter "AppRouter.tsx" | Remove-Item -Force
Write-Host "🗑️ Todos os AppRouter.tsx removidos." -ForegroundColor Yellow

# 4️⃣ Reescrever index.html
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
Write-Host "✅ index.html OK" -ForegroundColor Green

# 5️⃣ Reescrever src/main.tsx
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
Write-Host "✅ src/main.tsx OK" -ForegroundColor Green

# 6️⃣ Reescrever src/App.tsx
$app = @'
import React from "react";

export default function App() {
  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", padding: "40px" }}>
      <h1 style={{ fontSize: "32px", marginBottom: "16px" }}>
        CondoManager AI — Núcleo OK
      </h1>
      <p style={{ fontSize: "18px" }}>
        React e Vite estão a funcionar corretamente.
      </p>
      <p style={{ marginTop: "12px" }}>
        Router removido para eliminar erros 500.
      </p>
    </div>
  );
}
'@
Set-Content -Path "src/App.tsx" -Value $app -Force
Write-Host "✅ src/App.tsx OK" -ForegroundColor Green

# 7️⃣ Reescrever global.css
$css = @'
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Arial, sans-serif;
  background-color: #f8fafc;
  color: #0f172a;
}

#root {
  min-height: 100vh;
}
'@
Set-Content -Path "global.css" -Value $css -Force
Write-Host "✅ global.css OK" -ForegroundColor Green

Write-Host "🚀 Agora corre: npm run dev" -ForegroundColor Cyan
Write-Host "👉 Abre a porta que o Vite indicar (ex.: http://localhost:5177)" -ForegroundColor Yellow
Write-Host "👉 Vais ver 'CondoManager AI — Núcleo OK' sem erros." -ForegroundColor Yellow
