Write-Host "=== DIAGNOSTICO BUILD FRONTEND ==="

# 1. Verificar estrutura basica
$frontendPath = "frontend"
if (!(Test-Path $frontendPath)) {
    Write-Host "ERRO: Pasta 'frontend' nao existe."
    exit
} else {
    Write-Host "OK: Pasta 'frontend' encontrada."
}

# 2. Verificar ficheiros criticos
$criticalFiles = @(
"frontend/package.json",
"frontend/vite.config.js",
"frontend/src/main.jsx",
"frontend/src/App.jsx",
"frontend/src/components/LayoutTop.jsx",
"frontend/src/components/VideoFrame.jsx",
"frontend/src/assets/skyline.png",
"frontend/public/intro.mp4"
)

Write-Host "`n--- Ficheiros criticos ---"
foreach ($file in $criticalFiles) {
    if (Test-Path $file) {
        Write-Host "OK: $file existe."
    } else {
        Write-Host "FALTA: $file NAO existe."
    }
}

# 3. Mostrar script de build do package.json
Write-Host "`n--- package.json (scripts) ---"
$pkgPath = "frontend/package.json"
if (Test-Path $pkgPath) {
    $pkg = Get-Content $pkgPath -Raw
    Write-Host $pkg
} else {
    Write-Host "Nao foi possivel ler frontend/package.json"
}

# 4. Mostrar vite.config.js
Write-Host "`n--- vite.config.js ---"
$vitePath = "frontend/vite.config.js"
if (Test-Path $vitePath) {
    $vite = Get-Content $vitePath -Raw
    Write-Host $vite
} else {
    Write-Host "Nao foi possivel ler frontend/vite.config.js"
}

# 5. Procurar imports e chamadas problematicas
Write-Host "`n--- Procurar padrões problematicos ---"

$patterns = @(
"useSupabase",
"../../services/useSupabase",
"LayoutTopWithVideo",
"VideoFrame",
"skyline.png",
"intro.mp4"
)

foreach ($pattern in $patterns) {
    Write-Host "`nPESQUISA: $pattern"
    Get-ChildItem -Path "frontend/src" -Recurse -Include *.jsx,*.js |
        Select-String -Pattern $pattern |
        ForEach-Object {
            Write-Host ("{0}:{1}: {2}" -f $_.Path, $_.LineNumber, $_.Line.Trim())
        }
}

# 6. Mostrar conteudo resumido dos ficheiros chave
function Show-FileSummary($path) {
    if (Test-Path $path) {
        Write-Host "`n--- RESUMO: $path ---"
        Get-Content $path | Select-Object -First 40 | ForEach-Object { Write-Host $_ }
    } else {
        Write-Host "`n--- RESUMO: $path (NAO EXISTE) ---"
    }
}

Show-FileSummary "frontend/src/main.jsx"
Show-FileSummary "frontend/src/App.jsx"
Show-FileSummary "frontend/src/components/LayoutTop.jsx"
Show-FileSummary "frontend/src/components/VideoFrame.jsx"

Write-Host "`n=== FIM DO DIAGNOSTICO ==="
