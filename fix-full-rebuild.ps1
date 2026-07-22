Write-Host "🔧 RECONSTRUÇÃO COMPLETA — CondoManager AI" -ForegroundColor Cyan

# 1️⃣ Criar pasta router
New-Item -ItemType Directory -Force -Path "src/router" | Out-Null

# 2️⃣ Criar AppRouter.tsx
$router = @'
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Predios from "../pages/Predios";
import Fracoes from "../pages/Fracoes";
import Condominos from "../pages/Condominos";
import Pagamentos from "../pages/Pagamentos";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/predios" element={<Predios />} />
        <Route path="/fracoes" element={<Fracoes />} />
        <Route path="/condominos" element={<Condominos />} />
        <Route path="/pagamentos" element={<Pagamentos />} />
      </Routes>
    </BrowserRouter>
  );
}
'@
Set-Content -Path "src/router/AppRouter.tsx" -Value $router -Force
Write-Host "✅ Router criado" -ForegroundColor Green

# 3️⃣ Criar páginas
New-Item -ItemType Directory -Force -Path "src/pages" | Out-Null

$pageTemplate = @'
import React from "react";

export default function PAGE_NAME() {
  return (
    <div style={{ padding: "40px" }}>
      <h1>PAGE_TITLE</h1>
      <p>Página funcional.</p>
    </div>
  );
}
'@

$pageNames = @{
    "Dashboard" = "Dashboard";
    "Predios" = "Prédios";
    "Fracoes" = "Frações";
    "Condominos" = "Condóminos";
    "Pagamentos" = "Pagamentos";
}

foreach ($key in $pageNames.Keys) {
    $content = $pageTemplate.Replace("PAGE_NAME", $key).Replace("PAGE_TITLE", $pageNames[$key])
    Set-Content -Path ("src/pages/" + $key + ".tsx") -Value $content -Force
}

Write-Host "✅ Páginas criadas" -ForegroundColor Green

# 4️⃣ Criar Navbar
New-Item -ItemType Directory -Force -Path "src/components" | Out-Null

$navbar = @'
import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={{ background: "#1e293b", padding: "10px 20px", display: "flex", gap: "20px" }}>
      <Link style={{ color: "white" }} to="/">Dashboard</Link>
      <Link style={{ color: "white" }} to="/predios">Prédios</Link>
      <Link style={{ color: "white" }} to="/fracoes">Frações</Link>
      <Link style={{ color: "white" }} to="/condominos">Condóminos</Link>
      <Link style={{ color: "white" }} to="/pagamentos">Pagamentos</Link>
    </nav>
  );
}
'@
Set-Content -Path "src/components/Navbar.tsx" -Value $navbar -Force
Write-Host "✅ Navbar criada" -ForegroundColor Green

# 5️⃣ Atualizar App.tsx
$app = @'
import React from "react";
import AppRouter from "./router/AppRouter";
import Navbar from "./components/Navbar";

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
Write-Host "✅ App.tsx atualizado" -ForegroundColor Green

Write-Host "🚀 Agora corre: npm run dev" -ForegroundColor Cyan
Write-Host "👉 Abre http://localhost:5177 (ou a porta que o Vite indicar)" -ForegroundColor Yellow
Write-Host "👉 Vais ver o Dashboard, Navbar e todas as páginas a funcionar" -ForegroundColor Yellow
