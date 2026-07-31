Write-Host "=== FIX DEFINITIVO LAYOUTTOP ==="

# Caminho raiz do projeto
$root = "C:\Users\jcafg\Desktop\meus documentos\App Condominios\condomanager-ai"

# Caminhos de build (onde o Vite compila)
$src          = Join-Path $root "src"
$components   = Join-Path $src "components"
$publicAssets = Join-Path $root "public\assets"
$publicVideos = Join-Path $publicAssets "videos"

# Garantir pastas de destino
if (!(Test-Path $components)) {
    New-Item -ItemType Directory -Path $components | Out-Null
    Write-Host "Criada pasta: $components"
}

if (!(Test-Path $publicAssets)) {
    New-Item -ItemType Directory -Path $publicAssets | Out-Null
    Write-Host "Criada pasta: $publicAssets"
}

if (!(Test-Path $publicVideos)) {
    New-Item -ItemType Directory -Path $publicVideos | Out-Null
    Write-Host "Criada pasta: $publicVideos"
}

# Procurar LayoutTop.jsx e LayoutTop.css em frontend/src (independentemente da pasta exata)
$frontendSrc = Join-Path $root "frontend\src"

$layoutTopJsxSource = Get-ChildItem -Path $frontendSrc -Recurse -Filter "LayoutTop.jsx" -ErrorAction SilentlyContinue | Select-Object -First 1
$layoutTopCssSource = Get-ChildItem -Path $frontendSrc -Recurse -Filter "LayoutTop.css" -ErrorAction SilentlyContinue | Select-Object -First 1

if ($layoutTopJsxSource) {
    $jsxDest = Join-Path $components "LayoutTop.jsx"
    Copy-Item $layoutTopJsxSource.FullName $jsxDest -Force
    Write-Host "LayoutTop.jsx copiado de $($layoutTopJsxSource.FullName) para $jsxDest"
} else {
    Write-Host "ERRO: LayoutTop.jsx não encontrado em frontend\src"
}

if ($layoutTopCssSource) {
    $cssDest = Join-Path $components "LayoutTop.css"
    Copy-Item $layoutTopCssSource.FullName $cssDest -Force
    Write-Host "LayoutTop.css copiado de $($layoutTopCssSource.FullName) para $cssDest"
} else {
    Write-Host "ERRO: LayoutTop.css não encontrado em frontend\src"
}

# Copiar assets para public/assets
$skylineSource = Join-Path $root "condomanager-ai\public\assets\skyline.png"
$logoSource    = Join-Path $root "condomanager-ai\public\assets\logo.png"
$videoSource   = Join-Path $root "condomanager-ai\public\assets\videos\intro.mp4"

# Mas tu disseste que o caminho correto é:
$skylineSource = Join-Path $root "public\assets\skyline.png"
$logoSource    = Join-Path $root "public\assets\logo.png"
$videoSource   = Join-Path $root "public\assets\videos\intro.mp4"

# Se por acaso ainda estiverem em frontend/react/public, também tentamos
$skylineFallback = Join-Path $root "frontend\react\public\assets\skyline.png"
$logoFallback    = Join-Path $root "frontend\react\public\assets\logo.png"
$videoFallback   = Join-Path $root "frontend\react\public\assets\videos\intro.mp4"

# skyline
if (Test-Path $skylineSource) {
    Copy-Item $skylineSource $publicAssets -Force
    Write-Host "skyline.png garantido em $publicAssets"
} elseif (Test-Path $skylineFallback) {
    Copy-Item $skylineFallback $publicAssets -Force
    Write-Host "skyline.png copiado de fallback para $publicAssets"
} else {
    Write-Host "AVISO: skyline.png não encontrado em nenhum dos caminhos esperados"
}

# logo
if (Test-Path $logoSource) {
    Copy-Item $logoSource $publicAssets -Force
    Write-Host "logo.png garantido em $publicAssets"
} elseif (Test-Path $logoFallback) {
    Copy-Item $logoFallback $publicAssets -Force
    Write-Host "logo.png copiado de fallback para $publicAssets"
} else {
    Write-Host "AVISO: logo.png não encontrado em nenhum dos caminhos esperados"
}

# vídeo
if (Test-Path $videoSource) {
    Copy-Item $videoSource $publicVideos -Force
    Write-Host "intro.mp4 garantido em $publicVideos"
} elseif (Test-Path $videoFallback) {
    Copy-Item $videoFallback $publicVideos -Force
    Write-Host "intro.mp4 copiado de fallback para $publicVideos"
} else {
    Write-Host "AVISO: intro.mp4 não encontrado em nenhum dos caminhos esperados"
}

Write-Host "=== A executar build ==="
cd $root
npm run build

Write-Host "=== FIX DEFINITIVO CONCLUÍDO ==="
