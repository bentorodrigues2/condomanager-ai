Write-Host "=== Mover frontend/react para a raiz ==="

# Caminho base
$root = Get-Location
$frontend = "$root\frontend\react"

# Verificar se a pasta existe
if (!(Test-Path $frontend)) {
    Write-Host "ERRO: Pasta frontend/react não encontrada."
    exit
}

Write-Host "=== A mover ficheiros ==="

# Mover src
Move-Item "$frontend\src" "$root\src" -Force

# Mover index.html
Move-Item "$frontend\index.html" "$root\index.html" -Force

# Mover package.json
Move-Item "$frontend\package.json" "$root\package.json" -Force

# Mover vite.config.js (se existir)
if (Test-Path "$frontend\vite.config.js") {
    Move-Item "$frontend\vite.config.js" "$root\vite.config.js" -Force
}

# Mover .env.example
if (Test-Path "$frontend\.env.example") {
    Move-Item "$frontend\.env.example" "$root\.env.example" -Force
}

Write-Host "=== A remover pasta antiga ==="
Remove-Item "$root\frontend" -Recurse -Force

Write-Host "=== Instalar dependências ==="
npm install

Write-Host "=== Git add ==="
git add .

Write-Host "=== Git commit ==="
git commit -m "Move frontend to root"

Write-Host "=== Git push ==="
git push

Write-Host "=== Concluído. Faz redeploy no Vercel. ==="
