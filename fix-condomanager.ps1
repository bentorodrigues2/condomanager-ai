# Corrigir estrutura de layout e router do CondoManager AI

Write-Host "== CondoManager AI: aplicar correções de layout e router ==" -ForegroundColor Cyan

# 1) Apagar o LayoutTop antigo que está a bloquear o router
$oldLayoutTop = "src\components\LayoutTop.tsx"
if (Test-Path $oldLayoutTop) {
    Remove-Item $oldLayoutTop -Force
    Write-Host "Removido ficheiro antigo: $oldLayoutTop" -ForegroundColor Yellow
} else {
    Write-Host "Ficheiro antigo não existe (ok): $oldLayoutTop" -ForegroundColor DarkYellow
}

# 2) Criar nova página inicial: src/pages/LayoutTop.jsx
$newLayoutTopPath = "src\pages"
if (!(Test-Path $newLayoutTopPath)) {
    New-Item -ItemType Directory -Path $newLayoutTopPath | Out-Null
    Write-Host "Criada pasta: $newLayoutTopPath" -ForegroundColor Green
}

$newLayoutTopFile = Join-Path $newLayoutTopPath "LayoutTop.jsx"
@"
import React from "react";

export default function LayoutTop() {
  return (
    <div>
      <h1>CondoManager AI</h1>
      <p>Bem-vindo ao painel principal.</p>
    </div>
  );
}
"@ | Set-Content $newLayoutTopFile -Encoding UTF8

Write-Host "Criado ficheiro: $newLayoutTopFile" -ForegroundColor Green

# 3) Substituir src/layout/AppLayout.tsx com versão correta (Outlet)
$appLayoutFile = "src\layout\AppLayout.tsx"
@"
import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { lightTheme } from "../theme";

export function AppLayout({ theme = lightTheme }: { theme?: any }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const saved = window.localStorage.getItem("sidebar-open");
    return saved === "true";
  });

  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (isDesktop) setIsSidebarOpen(true);
  }, [isDesktop]);

  useEffect(() => {
    window.localStorage.setItem("sidebar-open", isSidebarOpen ? "true" : "false");
  }, [isSidebarOpen]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: theme.colors.background,
        color: theme.colors.text,
        transition: "background 0.4s ease, color 0.4s ease"
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.75rem 1rem",
          borderBottom: `1px solid ${theme.colors.border}`,
          background: theme.colors.card
        }}
      >
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          style={{
            padding: "0.4rem 0.6rem",
            borderRadius: "0.4rem",
            border: `1px solid ${theme.colors.border}`,
            background: theme.colors.card,
            color: theme.colors.text,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.3rem"
          }}
        >
          <span>☰</span>
          <span style={{ fontSize: "0.85rem" }}>Menu</span>
        </button>

        <span style={{ fontWeight: "bold", fontSize: "0.95rem" }}>
          {theme.brandName}
        </span>
      </div>

      <div style={{ display: "flex", position: "relative" }}>
        <Sidebar theme={theme} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        <main
          style={{
            flex: 1,
            padding: theme.spacing.section,
            maxWidth: "1200px",
            margin: "0 auto",
            marginTop: "1rem"
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
"@ | Set-Content $appLayoutFile -Encoding UTF8

Write-Host "Substituído ficheiro: $appLayoutFile" -ForegroundColor Green

# 4) Ajustar imports em src/router/AppRouter.jsx (apenas cabeçalho)
$appRouterFile = "src\router\AppRouter.jsx"
if (Test-Path $appRouterFile) {
    $routerContent = Get-Content $appRouterFile -Raw

    # Substituir imports de AppLayout e LayoutTop
    $routerContent = $routerContent -replace 'import\s+AppLayout.*', 'import AppLayout from "../layout/AppLayout";'
    $routerContent = $routerContent -replace 'import\s+LayoutTop.*', 'import LayoutTop from "../pages/LayoutTop";'

    Set-Content $appRouterFile $routerContent -Encoding UTF8
    Write-Host "Atualizados imports em: $appRouterFile" -ForegroundColor Green
} else {
    Write-Host "ATENÇÃO: não encontrei src/router/AppRouter.jsx" -ForegroundColor Red
}

Write-Host "== Correções aplicadas. Agora: git add, commit, push e redeploy na Vercel ==" -ForegroundColor Cyan
