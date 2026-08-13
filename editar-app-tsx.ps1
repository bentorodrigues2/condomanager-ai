Write-Host "=== EDITAR APP.TSX ==="

# Caminho do ficheiro na raiz
$filePath = "App.tsx"

if (!(Test-Path $filePath)) {
    Write-Host "[ERRO] App.tsx nao encontrado na raiz!"
    exit
}

# Ler conteudo
$content = Get-Content $filePath -Raw

# Verificar se ja esta correto
if ($content -match "/app/login") {
    Write-Host "[OK] App.tsx ja aponta para /app/login"
    exit
}

# Substituir /perfil por /app/login
$newContent = $content -replace "/perfil", "/app/login"

# Guardar
Set-Content -Path $filePath -Value $newContent

Write-Host "[DONE] App.tsx atualizado para usar /app/login"
Write-Host "=== CONCLUIDO ==="
