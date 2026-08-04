Write-Host "=== Diagnóstico CondoManager-AI ==="

# Caminhos base
$base = (Get-Location).Path
$pwa = Join-Path $base "pwa"
$public = Join-Path $base "public"
$src = Join-Path $pwa "src"

function TestFile($path, $desc) {
    if (Test-Path $path) {
        Write-Host ("OK: " + $desc + " encontrado")
    } else {
        Write-Host ("ERRO: " + $desc + " não encontrado")
    }
}

Write-Host "--- Estrutura ---"
TestFile $pwa "pasta pwa"
TestFile $public "pasta public"
TestFile $src "pasta pwa/src"

Write-Host "--- Ficheiros essenciais ---"
TestFile (Join-Path $pwa "index.html") "index.html"
TestFile (Join-Path $src "main.jsx") "main.jsx"
TestFile (Join-Path $src "App.jsx") "App.jsx"
TestFile (Join-Path $src "supabaseClient.js") "supabaseClient.js"
TestFile (Join-Path $pwa "service-worker.js") "service-worker.js"
TestFile (Join-Path $public "manifest.json") "manifest.json"

Write-Host "--- Imports críticos ---"
$main = Get-Content (Join-Path $src "main.jsx") -ErrorAction SilentlyContinue
if ($main -match "App.jsx") { Write-Host "OK: main.jsx importa App.jsx" } else { Write-Host "ERRO: main.jsx não importa App.jsx" }
if ($main -match "react-router-dom") { Write-Host "OK: react-router-dom importado" } else { Write-Host "ERRO: react-router-dom não importado" }

$app = Get-Content (Join-Path $src "App.jsx") -ErrorAction SilentlyContinue
if ($app -match "supabaseClient.js") { Write-Host "OK: App.jsx importa supabaseClient.js" } else { Write-Host "ERRO: App.jsx não importa supabaseClient.js" }
if ($app -match "router.jsx") { Write-Host "AVISO: router.jsx não encontrado — verificar rotas" }

Write-Host "--- Variáveis do .env.local ---"
$envFile = Join-Path $pwa ".env.local"
if (Test-Path $envFile) {
    $envContent = Get-Content $envFile
    if ($envContent -match "VITE_SUPABASE_URL") { Write-Host "OK: VITE_SUPABASE_URL definida" } else { Write-Host "ERRO: VITE_SUPABASE_URL em falta" }
    if ($envContent -match "VITE_SUPABASE_SERVICE_ROLE_KEY") { Write-Host "OK: VITE_SUPABASE_SERVICE_ROLE_KEY definida" } else { Write-Host "ERRO: VITE_SUPABASE_SERVICE_ROLE_KEY em falta" }
} else {
    Write-Host "ERRO: .env.local não encontrado dentro de pwa/"
}

Write-Host "--- Verificação do manifest.json ---"
$manifestPath = Join-Path $public "manifest.json"
if (Test-Path $manifestPath) {
    $manifest = Get-Content $manifestPath -Raw
    if ($manifest -match '"name"') { Write-Host "OK: manifest.json contém nome da PWA" } else { Write-Host "ERRO: manifest.json sem campo name" }
    if ($manifest -match '"icons"') { Write-Host "OK: manifest.json contém ícones" } else { Write-Host "ERRO: manifest.json sem ícones" }
} else {
    Write-Host "ERRO: manifest.json não encontrado em public/"
}

Write-Host "--- Teste de build ---"
try {
    npm run build | Out-Host
    Write-Host "OK: build executado"
} catch {
    Write-Host "ERRO: falha na build"
}

Write-Host "=== FIM DO DIAGNÓSTICO ==="
