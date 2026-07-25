Write-Host "Fix definitivo: corrigir paths de imagem e video..."

# Caminhos
$assetsPath = "frontend/src/assets"
$publicPath = "frontend/public"

# Garantir pastas
if (!(Test-Path $assetsPath)) { New-Item -ItemType Directory -Path $assetsPath | Out-Null }
if (!(Test-Path $publicPath)) { New-Item -ItemType Directory -Path $publicPath | Out-Null }

# 1. Copiar imagem real para o nome que o codigo espera
if (Test-Path "Layout inicial.png") {
    Copy-Item "Layout inicial.png" "$assetsPath/skyline.png" -Force
    Write-Host "Imagem skyline.png criada a partir de Layout inicial.png"
} else {
    Write-Host "ERRO: Ficheiro 'Layout inicial.png' nao encontrado na raiz."
}

# 2. Copiar video real para o nome que o codigo espera
if (Test-Path "logo-animation.mp4") {
    Copy-Item "logo-animation.mp4" "$publicPath/intro.mp4" -Force
    Write-Host "Video intro.mp4 criado a partir de logo-animation.mp4"
} else {
    Write-Host "ERRO: Ficheiro 'logo-animation.mp4' nao encontrado na raiz."
}

# 3. Corrigir LayoutTop.jsx para garantir que o import esta correto
$layoutTop = "frontend/src/components/LayoutTop.jsx"
if (Test-Path $layoutTop) {
    $content = Get-Content $layoutTop -Raw
    $content = $content -replace 'import skyline from "../../assets/.*";', 'import skyline from "../../assets/skyline.png";'
    Set-Content $layoutTop $content
    Write-Host "LayoutTop.jsx corrigido."
}

# 4. Corrigir VideoFrame.jsx para garantir que o src esta correto
$videoFrame = "frontend/src/components/VideoFrame.jsx"
if (Test-Path $videoFrame) {
    $content = Get-Content $videoFrame -Raw
    $content = $content -replace 'src="/.*"', 'src="/intro.mp4"'
    Set-Content $videoFrame $content
    Write-Host "VideoFrame.jsx corrigido."
}

# 5. Git commit + push
git add .
git commit -m "Fix definitivo: paths corrigidos para skyline.png e intro.mp4"
git push

Write-Host "Fix concluido. O Vercel vai reconstruir o deploy agora."
