# ================================
#  FIX FRONTEND TOTAL — CONDOMANAGER AI
# ================================

Write-Host "🔧 A corrigir estrutura completa do frontend..." -ForegroundColor Cyan

# 1️⃣ index.html
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
Write-Host "✅ index.html corrigido!" -ForegroundColor Green

# 2️⃣ main.tsx
$main = @'
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/global.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
'@
Set-Content -Path "src/main.tsx" -Value $main -Force
Write-Host "✅ main.tsx corrigido!" -ForegroundColor Green

# 3️⃣ App.tsx
$app = @'
import React from "react";
import { AppRouter } from "./AppRouter";
import { Navbar } from "./components/Navbar";

export default function App() {
  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      <Navbar />
      <div style={{ padding: "20px" }}>
        <AppRouter />
      </div>
    </div>
  );
}
'@
Set-Content -Path "src/App.tsx" -Value $app -Force
Write-Host "✅ App.tsx corrigido!" -ForegroundColor Green

# 4️⃣ AppRouter.tsx
$router = @'
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

export function AppRouter() {
  return (
    <BrowserRouter basename="/">
      <Routes>
        <Route
          path="*"
          element={
            <div style={{ padding: "40px" }}>
              <h1>🏠 CondoManager AI</h1>
              <p>Router funcional. Estás na rota: {window.location.pathname}</p>
              <p>Usa a Navbar para navegar.</p>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
'@
Set-Content -Path "src/AppRouter.tsx" -Value $router -Force
Write-Host "✅ AppRouter.tsx corrigido!" -ForegroundColor Green

# 5️⃣ Navbar.tsx
$navbar = @'
import React from "react";
import { Link } from "react-router-dom";

export function Navbar() {
  return (
    <nav
      style={{
        background: "#1e293b",
        padding: "10px 20px",
        display: "flex",
        gap: "20px"
      }}
    >
      <Link style={{ color: "white" }} to="/">Dashboard</Link>
      <Link style={{ color: "white" }} to="/predios">Prédios</Link>
      <Link style={{ color: "white" }} to="/fracoes">Frações</Link>
      <Link style={{ color: "white" }} to="/condominos">Condóminos</Link>
      <Link style={{ color: "white" }} to="/pagamentos">Pagamentos</Link>
      <Link style={{ color: "white" }} to="/test">Teste</Link>
    </nav>
  );
}
'@
New-Item -ItemType Directory -Force -Path "src/components" | Out-Null
Set-Content -Path "src/components/Navbar.tsx" -Value $navbar -Force
Write-Host "✅ Navbar.tsx corrigido!" -ForegroundColor Green

# 6️⃣ global.css
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

a {
  text-decoration: none;
}

#root {
  min-height: 100vh;
}
'@
New-Item -ItemType Directory -Force -Path "src/styles" | Out-Null
Set-Content -Path "src/styles/global.css" -Value $css -Force
Write-Host "✅ global.css corrigido!" -ForegroundColor Green

Write-Host "🚀 Corre agora: npm run dev e abre http://localhost:5177/" -ForegroundColor Cyan
Write-Host "👉 Se ainda estiver branco, abre a consola do browser (F12) e copia o erro para análise." -ForegroundColor Yellow
