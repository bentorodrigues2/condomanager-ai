Write-Host "=== Verificando estrutura do projeto ==="

# 1. Confirmar que estamos na raiz
if (-Not (Test-Path ".\vite.config.js")) {
    Write-Host "ERRO: Não estás na raiz do projeto condomanager-ai."
    exit
}

# 2. Confirmar pasta pwa
if (-Not (Test-Path ".\pwa")) {
    Write-Host "ERRO: Pasta pwa não encontrada."
    exit
}

Write-Host "OK: Pasta pwa encontrada."

# 3. Confirmar main.jsx
$mainJsxInRoot = Test-Path ".\pwa\main.jsx"
$mainJsxInSrc = Test-Path ".\pwa\src\main.jsx"

if ($mainJsxInRoot) {
    $mainPath = "/main.jsx"
    Write-Host "OK: main.jsx encontrado em pwa/"
} elseif ($mainJsxInSrc) {
    $mainPath = "/src/main.jsx"
    Write-Host "OK: main.jsx encontrado em pwa/src/"
} else {
    Write-Host "ERRO: main.jsx não encontrado em pwa ou pwa/src."
    exit
}

# 4. Corrigir index.html automaticamente
$indexPath = ".\pwa\index.html"

if (-Not (Test-Path $indexPath)) {
    Write-Host "ERRO: index.html não encontrado em pwa."
    exit
}

$indexContent = Get-Content $indexPath -Raw

# Remover qualquer script antigo
$indexContent = $indexContent -replace '<script type="module" src=".*"></script>', ''

# Inserir script correto
$scriptTag = "<script type=module src=""$mainPath""></script>"

# Inserir antes do </body>
$indexContent = $indexContent -replace '</body>', "$scriptTag`n</body>"

Set-Content $indexPath $indexContent -Encoding UTF8

Write-Host "OK: index.html corrigido com caminho $mainPath"

# 5. Limpar cache do Vite
if (Test-Path ".\node_modules\.vite") {
    Write-Host "Limpando cache do Vite..."
    Remove-Item -Recurse -Force ".\node_modules\.vite"
    Write-Host "Cache limpa."
} else {
    Write-Host "Nenhuma cache do Vite encontrada."
}

# 6. Reiniciar servidor
Write-Host "Iniciando servidor Vite..."
npm run dev
