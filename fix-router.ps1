# ================================
#  FIX ROUTER PATH — CONDOMANAGER AI
# ================================

Write-Host "🔧 A corrigir estrutura do Router..." -ForegroundColor Cyan

# 1️⃣ Criar pasta router
New-Item -ItemType Directory -Force -Path "src/router" | Out-Null

# 2️⃣ Mover AppRouter.tsx para a pasta correta
if (Test-Path "src/AppRouter.tsx") {
    Move-Item -Force "src/AppRouter.tsx" "src/router/AppRouter.tsx"
    Write-Host "📁 AppRouter.tsx movido para src/router/" -ForegroundColor Green
} else {
    Write-Host "⚠️ src/AppRouter.tsx não existe, será criado novo." -ForegroundColor Yellow
}

# 3️⃣ Reescrever AppRouter.tsx na pasta correta
$router = @'
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <div style={{ padding: "40px" }}>
              <h1>🏠 CondoManager AI</h1>
              <p>Router funcional. Estás na rota: {window.location.pathname}</p>
            </div>
          }
        />
        <Route
          path="/test"
          element={
            <div style={{ padding: "40px" }}>
              <h1>Rota Teste OK</h1>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
'@

Set-Content -Path "src/router/AppRouter.tsx" -Value $router -Force
Write-Host "✅ AppRouter.tsx reescrito!" -ForegroundColor Green

# 4️⃣ Corrigir import no App.tsx
$app = @'
import React from "react";
import AppRouter from "./router/AppRouter";
import { Navbar } from "./components/Navbar";

export default function App() {
  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      <Navbar />
      <AppRouter />
    </div>
  );
}
'@

Set-Content -Path "src/App.tsx" -Value $app -Force
Write-Host "✅ App.tsx corrigido com import correto!" -ForegroundColor Green

Write-Host "🚀 Corre agora: npm run dev" -ForegroundColor Cyan
Write-Host "👉 Abre http://localhost:5177/ e a app vai aparecer." -ForegroundColor Yellow
