Write-Host "=== DIAGNÓSTICO PWA - V2 ==="

$root = (Get-Location).Path
$pwa = Join-Path $root "pwa"
$src = Join-Path $pwa "src"

Write-Host "`n--- Verificando ficheiros críticos ---"

$criticalFiles = @(
    "index.html",
    "src/main.jsx",
    "src/App.jsx",
    "src/router.jsx",
    "src/supabaseClient.js"
)

foreach ($file in $criticalFiles) {
    $path = Join-Path $pwa $file
    if (Test-Path $path) {
        $size = (Get-Item $path).Length
        if ($size -eq 0) {
            Write-Host "[ERRO GRAVE] $file existe mas está VAZIO!"
        } else {
            Write-Host "[OK] $file existe ($size bytes)"
        }
    } else {
        Write-Host "[ERRO] $file NÃO existe!"
    }
}

Write-Host "`n--- Verificando supabaseClient.js ---"

$supaPath = Join-Path $src "supabaseClient.js"
if (Test-Path $supaPath) {
    $content = Get-Content $supaPath -Raw
    if ($content.Trim().Length -lt 20) {
        Write-Host "[ERRO GRAVE] supabaseClient.js está vazio ou corrompido!"
    } else {
        Write-Host "[OK] supabaseClient.js tem conteúdo"
    }

    if ($content -notmatch "createClient") {
        Write-Host "[ERRO] createClient NÃO encontrado no supabaseClient.js"
    } else {
        Write-Host "[OK] createClient encontrado"
    }

    if ($content -notmatch "import.meta.env") {
        Write-Host "[ERRO] Variáveis VITE_ não estão a ser lidas!"
    } else {
        Write-Host "[OK] Variáveis VITE_ estão a ser lidas"
    }
}

Write-Host "`n--- Verificando .env.local ---"

$envFile = Join-Path $pwa ".env.local"
if (Test-Path $envFile) {
    $envContent = Get-Content $envFile -Raw
    if ($envContent -notmatch "VITE_SUPABASE_URL" -or $envContent -notmatch "VITE_SUPABASE_KEY") {
        Write-Host "[ERRO] Variáveis VITE_SUPABASE_URL ou KEY em falta!"
    } else {
        Write-Host "[OK] Variáveis Supabase encontradas"
    }
} else {
    Write-Host "[ERRO] .env.local NÃO existe!"
}

Write-Host "`n--- Verificando index.html ---"

$index = Join-Path $pwa "index.html"
if ((Get-Content $index -Raw) -notmatch "id=\"root\"") {
    Write-Host "[ERRO] index.html não contém <div id=\"root\"></div>"
} else {
    Write-Host "[OK] index.html contém root"
}

Write-Host "`n--- Verificando main.jsx ---"

$main = Join-Path $src "main.jsx"
if ((Get-Content $main -Raw) -notmatch "ReactDOM.createRoot") {
    Write-Host "[ERRO] main.jsx não monta o React!"
} else {
    Write-Host "[OK] main.jsx monta o React"
}

Write-Host "`n--- Verificando router.jsx ---"

$router = Join-Path $src "router.jsx"
if ((Get-Content $router -Raw) -notmatch "Routes") {
    Write-Host "[ERRO] router.jsx não contém <Routes>"
} else {
    Write-Host "[OK] router.jsx contém rotas"
}

Write-Host "`n--- Verificando sintaxe JS ---"

try {
    node --check $supaPath
    Write-Host "[OK] supabaseClient.js sem erros de sintaxe"
} catch {
    Write-Host "[ERRO] supabaseClient.js tem erro de sintaxe"
}

Write-Host "`n--- Verificando BOM / caracteres invisíveis ---"

$bytes = [System.IO.File]::ReadAllBytes($supaPath)
if ($bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF) {
    Write-Host "[ERRO] supabaseClient.js tem BOM UTF-8 (pode quebrar Vite)"
} else {
    Write-Host "[OK] supabaseClient.js sem BOM"
}

Write-Host "`n=== FIM DO DIAGNÓSTICO ==="
