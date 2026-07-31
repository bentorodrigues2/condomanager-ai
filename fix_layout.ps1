Write-Host "=== FIX LAYOUTTOP ==="

# Caminho raiz do projeto
$root = "C:\Users\jcafg\Desktop\meus documentos\App Condominios\condomanager-ai"

# Caminhos corretos (onde o Vite compila)
$src = Join-Path $root "src"
$components = Join-Path $src "components"
$router = Join-Path $src "router"

# Caminhos onde os ficheiros estão atualmente
$frontendComponents = Join-Path $root "frontend/src/components/layouttop"
$frontendRouter = Join-Path $root "frontend/react/src"

# Criar pasta components se não existir
if (!(Test-Path $components)) {
    New-Item -ItemType Directory -Path $components | Out-Null
    Write-Host "Criada pasta: $components"
}

# Mover LayoutTop.jsx
$jsxSource = Join-Path $frontendComponents "LayoutTop.jsx"
$jsxDest = Join-Path $components "LayoutTop.jsx"

if (Test-Path $jsxSource) {
    Move-Item $jsxSource $jsxDest -Force
    Write-Host "LayoutTop.jsx movido para $jsxDest"
} else {
    Write-Host "ERRO: LayoutTop.jsx não encontrado em $jsxSource"
}

# Mover LayoutTop.css
$cssSource = Join-Path $frontendComponents "LayoutTop.css"
$cssDest = Join-Path $components "LayoutTop.css"

if (Test-Path $cssSource) {
    Move-Item $cssSource $cssDest -Force
    Write-Host "LayoutTop.css movido para $cssDest"
} else {
    Write-Host "ERRO: LayoutTop.css não encontrado em $cssSource"
}

# Mover AppRouter.tsx
$routerSource = Join-Path $frontendRouter "AppRouter.tsx"
$routerDest = Join-Path $router "AppRouter.tsx"

if (Test-Path $routerSource) {
    Move-Item $routerSource $routerDest -Force
    Write-Host "AppRouter.tsx movido para $routerDest"
} else {
    Write-Host "ERRO: AppRouter.tsx não encontrado em $routerSource"
}

Write-Host "=== A executar build ==="
cd $root
npm run build

Write-Host "=== FIX CONCLUÍDO ==="
