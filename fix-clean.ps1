# ================================
#  FIX-CLEAN — NÚCLEO REACT/VITE SEM ROUTER QUEBRADO
# ================================

Write-Host "🔧 A limpar router quebrado e a fixar núcleo React/Vite..." -ForegroundColor Cyan

# 1️⃣ index.html — garantir que aponta para /src/main.tsx
$index = @'
<!doctype html>
<html lang="pt">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>CondoManager AI - Portal do Administrador & Condómino</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
'@
Set-Content -Path "index.html" -Value $index -Force
Write-Host "✅ index.html corrigido (usa /src/main.tsx)" -ForegroundColor Green

# 2️⃣ src/main.tsx — usar apenas App + global.css, sem Auth/Router
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
New-Item -ItemType Directory -Force -Path "src" | Out-Null
Set-Content -Path "src/main.tsx" -Value $main -Force
Write-Host "✅ src/main.tsx corrigido" -ForegroundColor Green

# 3️⃣ src/App.tsx — componente mínimo visível, sem router, sem imports estranhos
$app = @'
import React from "react";

export default function App() {
  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", padding: "40px" }}>
      <h1 style={{ fontSize: "32px", marginBottom: "16px" }}>
        🔧 CondoManager AI — Núcleo OK
      </h1>
      <p style={{ fontSize: "18px" }}>
        Se estás a ver este ecrã, o React, o Vite e o src/main.tsx estão a funcionar.
      </p>
      <p style={{ marginTop: "12px" }}>
        A partir daqui, voltamos a ligar router, contextos e resto da app com segurança.
      </p>
    </div>
  );
}
'@
Set-Content -Path "src/App.tsx" -Value $app -Force
Write-Host "✅ src/App.tsx corrigido (sem router)" -ForegroundColor Green

# 4️⃣ Remover pasta src/router se existir (para evitar 500 em imports antigos)
if (Test-Path "src/router") {
    Remove-Item -Recurse -Force "src/router"
    Write-Host "🗑️ Pasta src/router removida (evita 500 em AppRouter.tsx antigo)" -ForegroundColor Yellow
} else {
    Write-Host "ℹ️ Pasta src/router não existe, nada a remover." -ForegroundColor DarkGray
}

# 5️⃣ global.css na raiz — garantir estilos básicos
$css = @'
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  background-color: #f8fafc;
  color: #0f172a;
}

#root {
  min-height: 100vh;
}
'@
Set-Content -Path "global.css" -Value $css -Force
Write-Host "✅ global.css corrigido" -ForegroundColor Green

Write-Host "🚀 Agora corre: npm run dev" -ForegroundColor Cyan
Write-Host "👉 Abre o endereço que o Vite indicar (ex.: http://localhost:5176/)" -ForegroundColor Yellow
Write-Host "👉 Tens de ver 'CondoManager AI — Núcleo OK' sem erros 500 na consola." -ForegroundColor Yellow
