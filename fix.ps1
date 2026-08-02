Write-Host "Starting frontend cleanup..."

$root = Get-Location
$frontend = Join-Path $root "frontend/react"

# Ensure frontend/react exists
if (!(Test-Path $frontend)) {
    New-Item -ItemType Directory -Path $frontend | Out-Null
    Write-Host "Created folder frontend/react"
}

# Move Vite config files
$viteFiles = @("vite.config.js", "vite.config.ts", "index.html")

foreach ($file in $viteFiles) {
    $source = Join-Path $root $file
    $dest = Join-Path $frontend $file

    if (Test-Path $source) {
        Move-Item $source $dest -Force
        Write-Host "Moved: $file"
    }
}

# Move src folder
if (Test-Path (Join-Path $root "src")) {
    Move-Item (Join-Path $root "src") (Join-Path $frontend "src") -Force
    Write-Host "Moved folder: src/"
}

# Move CSS files
$cssFiles = @("global.css", "index.css")

foreach ($file in $cssFiles) {
    $source = Join-Path $root $file
    $dest = Join-Path $frontend "src\$file"

    if (Test-Path $source) {
        Move-Item $source $dest -Force
        Write-Host "Moved: $file"
    }
}

# Remove root package.json if it contains React
$pkgPath = Join-Path $root "package.json"
if (Test-Path $pkgPath) {
    $pkgContent = Get-Content $pkgPath | Out-String
    if ($pkgContent -match "react") {
        Remove-Item $pkgPath -Force
        Write-Host "Removed root package.json (React detected)"
    }
}

Write-Host "Frontend structure fixed."
Write-Host "Run: git add . ; git commit ; git push"
