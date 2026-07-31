Write-Host "=== Corrigir LayoutTop e AppRouter com caminhos reais ==="

# Caminhos base
$root = "C:\Users\jcafg\Desktop\meus documentos\App Condominios\condomanager-ai"

# Mundo React (onde estão os ficheiros que viste no VS Code)
$reactSrc = Join-Path $root "frontend/react/src"
$reactComponents = Join-Path $reactSrc "components"
$reactPublicAssets = Join-Path $root "frontend/react/public/assets"

# Mundo que o Vite está a compilar
$src = Join-Path $root "src"
$components = Join-Path $src "components"
$publicAssets = Join-Path $root "public/assets"
$routerFile = Join-Path $src "router/AppRouter.tsx"

Write-Host "Root: $root"
Write-Host "React src: $reactSrc"
Write-Host "Build src: $src"

# Garantir pastas de destino
if (!(Test-Path $components)) {
    New-Item -ItemType Directory -Path $components | Out-Null
    Write-Host "Criada pasta: $components"
}

if (!(Test-Path $publicAssets)) {
    New-Item -ItemType Directory -Path $publicAssets | Out-Null
    Write-Host "Criada pasta: $publicAssets"
}

# Mover LayoutTop.jsx e LayoutTop.css do mundo react para o mundo build
$layoutTopJsxReact = Join-Path $reactComponents "LayoutTop.jsx"
$layoutTopCssReact = Join-Path $reactComponents "LayoutTop.css"

$layoutTopJsxDest = Join-Path $components "LayoutTop.jsx"
$layoutTopCssDest = Join-Path $components "LayoutTop.css"

if (Test-Path $layoutTopJsxReact) {
    Move-Item $layoutTopJsxReact $layoutTopJsxDest -Force
    Write-Host "LayoutTop.jsx movido para $layoutTopJsxDest"
} else {
    Write-Host "AVISO: LayoutTop.jsx não encontrado em $layoutTopJsxReact"
}

if (Test-Path $layoutTopCssReact) {
    Move-Item $layoutTopCssReact $layoutTopCssDest -Force
    Write-Host "LayoutTop.css movido para $layoutTopCssDest"
} else {
    Write-Host "AVISO: LayoutTop.css não encontrado em $layoutTopCssReact"
}

# Mover vídeo e assets do mundo react para public/assets
$videoReact = Join-Path $reactPublicAssets "videos/intro.mp4"
$videoDestDir = Join-Path $publicAssets "videos"
$videoDest = Join-Path $videoDestDir "intro.mp4"

if (!(Test-Path $videoDestDir)) {
    New-Item -ItemType Directory -Path $videoDestDir | Out-Null
}

if (Test-Path $videoReact) {
    Move-Item $videoReact $videoDest -Force
    Write-Host "intro.mp4 movido para $videoDest"
} else {
    Write-Host "AVISO: intro.mp4 não encontrado em $videoReact"
}

# Corrigir import do LayoutTop no AppRouter.tsx (no mundo build)
if (Test-Path $routerFile) {
    $content = Get-Content $routerFile
    $content = $content -replace 'import LayoutTop.*', 'import LayoutTop from "../components/LayoutTop";'
    Set-Content -Path $routerFile -Value $content
    Write-Host "Import do LayoutTop corrigido em $routerFile"
} else {
    Write-Host "AVISO: AppRouter.tsx não encontrado em $routerFile"
}

Write-Host "=== A executar build ==="
cd $root
npm run build

Write-Host "=== Script concluído ==="
