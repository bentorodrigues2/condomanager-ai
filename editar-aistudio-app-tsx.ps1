Write-Host "=== EDITAR AI STUDIO APP.TSX ==="

# Caminho CORRETO que tu deste
$filePath = "src\aistudio\src\src\app.tsx"

if (!(Test-Path $filePath)) {
    Write-Host "[ERRO] Ficheiro nao encontrado: $filePath"
    exit
}

# Ler conteudo
$content = Get-Content $filePath -Raw

# Verificar se ja esta correto
if ($content -match "/app/login") {
    Write-Host "[OK] app.tsx ja aponta para /app/login"
    exit
}

# Substituir /perfil por /app/login
$newContent = $content -replace "/perfil", "/app/login"

# Guardar
Set-Content -Path $filePath -Value $newContent

Write-Host "[DONE] app.tsx atualizado para usar /app/login"
Write-Host "=== CONCLUIDO ==="
