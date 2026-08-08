# Caminhos
$projectRoot = "condomanager-ai/frontend"
$aiStudioFolder = "$projectRoot/Condomanager-ai studio/src"
$frontendSrc = "$projectRoot/src"

Write-Host "=== INTEGRAÇÃO AUTOMÁTICA DO AI STUDIO ==="

# Pastas internas do AI Studio que queremos copiar
$foldersToCopy = @(
    "pages",
    "routes",
    "browser",
    "pwa",
    "context",
    "auth",
    "hooks"
)

# Copiar componentes internos (se existirem)
$componentsInternal = "$aiStudioFolder/components/internal"
if (Test-Path $componentsInternal) {
    $foldersToCopy += "components/internal"
}

foreach ($folder in $foldersToCopy) {
    $source = "$aiStudioFolder/$folder"
    $destination = "$frontendSrc/$folder"

    if (Test-Path $source) {
        Write-Host "Copiando: $folder"
        if (!(Test-Path $destination)) {
            New-Item -ItemType Directory -Path $destination | Out-Null
        }
        Copy-Item -Path $source/* -Destination $destination -Recurse -Force
    } else {
        Write-Host "Ignorado (não existe): $folder"
    }
}

Write-Host "=== INTEGRAÇÃO CONCLUÍDA ==="
Write-Host "Frontend intacto. Conteúdo interno do AI Studio integrado."
