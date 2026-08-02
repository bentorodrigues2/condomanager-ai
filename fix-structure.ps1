Write-Host '=== Corrigir estrutura ==='

$root = Get-Location
$src = "$root\src"
$wrong = "$root\src\src"

# Criar pastas se nao existirem
if (!(Test-Path "$src\router")) { New-Item -ItemType Directory -Path "$src\router" | Out-Null }
if (!(Test-Path "$src\pages")) { New-Item -ItemType Directory -Path "$src\pages" | Out-Null }
if (!(Test-Path "$src\components")) { New-Item -ItemType Directory -Path "$src\components" | Out-Null }

# Remover src/src duplicado
if (Test-Path $wrong) {
    Write-Host 'Mover router e pages'
    Move-Item "$wrong\router\*" "$src\router" -Force -ErrorAction SilentlyContinue
    Move-Item "$wrong\pages\*" "$src\pages" -Force -ErrorAction SilentlyContinue
    Remove-Item $wrong -Recurse -Force
}

# Criar ProtectedRoute.jsx
Set-Content "$src\components\ProtectedRoute.jsx" '// inserir codigo manualmente'

# Criar main.jsx
Set-Content "$src\main.jsx" '// inserir codigo manualmente'

Write-Host 'Git commit'
git add .
git commit -m 'fix estrutura'
git push

Write-Host '=== FIM ==='
