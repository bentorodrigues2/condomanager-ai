Write-Host "=== Verificando ambiente Condomanager-AI ===" -ForegroundColor Cyan

# 1. Confirmar que estamos na raiz do projeto
if (-Not (Test-Path ".\vite.config.js")) {
    Write-Host "ERRO: Não estás na raiz do projeto condomanager-ai." -ForegroundColor Red
    Write-Host "Usa: cd 'C:\Users\jcafg\Desktop\meus documentos\App Condominios\condomanager-ai'"
    exit
}

Write-Host "OK: ficheiro vite.config.js encontrado." -ForegroundColor Green

# 2. Verificar ficheiro .env.local
if (-Not (Test-Path ".\.env.local")) {
    Write-Host "ERRO: .env.local não encontrado na raiz!" -ForegroundColor Red
    exit
}

Write-Host "OK: .env.local encontrado." -ForegroundColor Green

# 3. Mostrar variáveis
Write-Host "`n=== Conteúdo do .env.local ===" -ForegroundColor Yellow
Get-Content ".\.env.local"

# 4. Limpar cache do Vite
if (Test-Path ".\node_modules\.vite") {
    Write-Host "`nLimpando cache do Vite..." -ForegroundColor Cyan
    Remove-Item -Recurse -Force ".\node_modules\.vite"
    Write-Host "Cache limpa." -ForegroundColor Green
} else {
    Write-Host "`nNenhuma cache do Vite encontrada." -ForegroundColor Yellow
}

# 5. Reiniciar servidor
Write-Host "`nIniciando servidor Vite..." -ForegroundColor Cyan
npm run dev
