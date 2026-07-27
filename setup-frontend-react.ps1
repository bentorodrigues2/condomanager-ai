Write-Host "Starting automatic React/Vite setup..."

# 1. Create react/ folder if missing
$reactPath = "./frontend/react"
if (!(Test-Path $reactPath)) {
    New-Item -ItemType Directory -Path $reactPath
    Write-Host "Created folder: frontend/react"
} else {
    Write-Host "Folder already exists: frontend/react"
}

# 2. Move React/Vite files
$reactFiles = @(
    "package.json",
    "package-lock.json",
    "vite.config.js"
)

foreach ($file in $reactFiles) {
    $source = "./frontend/$file"
    $dest = "./frontend/react/$file"

    if (Test-Path $source) {
        Move-Item $source $dest -Force
        Write-Host "Moved file: $file"
    } else {
        Write-Host "File not found: $file"
    }
}

# 3. Move React/Vite folders
$reactFolders = @(
    "src",
    "public",
    "node_modules"
)

foreach ($folder in $reactFolders) {
    $source = "./frontend/$folder"
    $dest = "./frontend/react/$folder"

    if (Test-Path $source) {
        Move-Item $source $dest -Force
        Write-Host "Moved folder: $folder"
    } else {
        Write-Host "Folder not found: $folder"
    }
}

# 4. Create vercel.json
$vercelJson = @"
{
  "version": 2,
  "builds": [
    {
      "src": "frontend/react/package.json",
      "use": "@vercel/static-build"
    }
  ],
  "routes": [
    { "src": "/(.*)", "dest": "frontend/react/dist/$1" }
  ]
}
"@

Set-Content -Path "./vercel.json" -Value $vercelJson -Encoding UTF8
Write-Host "Created vercel.json"

Write-Host "Setup complete. Run: git add . ; git commit ; git push"
Write-Host "Then set Vercel Root Directory = frontend/react"
