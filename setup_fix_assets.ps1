Write-Host "Fix Assets..."

# Garantir pasta assets
$assetsPath = "frontend/src/assets"
if (!(Test-Path $assetsPath)) {
    New-Item -ItemType Directory -Path $assetsPath | Out-Null
}

# Garantir pasta public
$publicPath = "frontend/public"
if (!(Test-Path $publicPath)) {
    New-Item -ItemType Directory -Path $publicPath | Out-Null
}

# Copiar imagem correta
Copy-Item "Layout inicial.png" "$assetsPath/skyline.png" -Force
Write-Host "Imagem skyline.png corrigida."

# Copiar video correto
Copy-Item "logo-animation.mp4" "$publicPath/intro.mp4" -Force
Write-Host "Video intro.mp4 corrigido."

# Git commit + push
git add .
git commit -m "Fix: assets skyline.png e intro.mp4 adicionados para desbloquear Vercel"
git push

Write-Host "Fix concluido."
