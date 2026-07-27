# 1. Criar pastas na raiz se não existirem
New-Item -ItemType Directory -Force -Path "src" | Out-Null

# 2. Mover ficheiros principais do frontend para a raiz
Move-Item -Force "frontend\index.html" "index.html"
Move-Item -Force "frontend\package.json" "package.json"
Move-Item -Force "frontend\vite.config.ts" "vite.config.ts"

# 3. Mover configs (se existirem)
if (Test-Path "frontend\tailwind.config.js") { Move-Item -Force "frontend\tailwind.config.js" "tailwind.config.js" }
if (Test-Path "frontend\postcss.config.js") { Move-Item -Force "frontend\postcss.config.js" "postcss.config.js" }
if (Test-Path "frontend\tsconfig.json") { Move-Item -Force "frontend\tsconfig.json" "tsconfig.json" }

# 4. Mover a pasta src inteira
Move-Item -Force "frontend\src\*" "src\"

# 5. Instalar dependências na raiz
npm install

# 6. Mostrar confirmação final
Write-Host "`n✔ Projeto movido para a raiz com sucesso.`n✔ Dependências instaladas.`nAgora faz git add, commit e push.`n"
