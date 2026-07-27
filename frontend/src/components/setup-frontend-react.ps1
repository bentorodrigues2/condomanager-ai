# ================================
# AUTO-SETUP FRONTEND REACT/VITE
# ================================

Write-Host "🔧 Iniciando reorganização automática do frontend..."

# 1. Criar pasta react/ se não existir
if (!(Test-Path "./frontend/react")) {
    New-Item -ItemType Directory -Path "./frontend/react"
    Write-Host "📁 Pasta react/ criada."
} else {
    Write-Host "📁 Pasta react/ já existe."
}

# 2. Mover ficheiros React/Vite para react/
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
        Write-Host "📦 Movido: $file"
    } else {
        Write-Host "⚠️ Não encontrado: $file"
    }
}

# 3. Mover pastas React/Vite para react/
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
        Write-Host "📂 Movida pasta: $folder"
    } else {
        Write-Host "⚠️ Pasta não encontrada: $folder"
    }
}

# 4. Criar vercel.json automaticamente
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
Write-Host "📝 vercel.json criado."

# 5. Mensagem final
Write-Host "✅ Estrutura React/Vite reorganizada com sucesso!"
Write-Host "➡️ Agora faz: git add . ; git commit ; git push"
Write-Host "➡️ Depois redeploy no Vercel com Root Directory = frontend/react"
