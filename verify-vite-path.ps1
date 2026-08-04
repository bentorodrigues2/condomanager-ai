Write-Host "=== Verificação automática do caminho do Vite ===" -ForegroundColor Cyan

# 1. Verificar se o ficheiro vite.config.js existe
if (-Not (Test-Path ".\vite.config.js")) {
    Write-Host "❌ Ficheiro vite.config.js não encontrado na raiz!" -ForegroundColor Red
    exit
}

# 2. Ler o conteúdo
$content = Get-Content ".\vite.config.js" -Raw

# 3. Procurar se contém 'root:'
if ($content -match "root:") {
    Write-Host "✅ O Vite já tem caminho definido para a pasta pwa." -ForegroundColor Green
} else {
    Write-Host "⚠️ O Vite não tem caminho definido. A corrigir automaticamente..." -ForegroundColor Yellow

    # Inserir linha root: "pwa",
    $newContent = $content -replace "plugins: 

\[react\(\)\]

,", "plugins: [react()],`n    root: path.resolve(__dirname, 'pwa'),"
    Set-Content ".\vite.config.js" $newContent -Encoding UTF8

    Write-Host "✅ Caminho corrigido para a pasta pwa." -ForegroundColor Green
}

# 4. Mostrar caminho atual
Write-Host "`n=== Caminho atual do projeto ===" -ForegroundColor Yellow
Write-Host (Resolve-Path ".\pwa")

# 5. Limpar cache do Vite
if (Test-Path ".\node_modules\.vite") {
    Write-Host "`n🧹 A limpar cache do Vite..." -ForegroundColor Cyan
    Remove-Item -Recurse -Force ".\node_modules\.vite"
    Write-Host "✅ Cache limpa." -ForegroundColor Green
}

# 6. Reiniciar servidor
Write-Host "`n🚀 A iniciar servidor Vite..." -ForegroundColor Cyan
npm run dev
