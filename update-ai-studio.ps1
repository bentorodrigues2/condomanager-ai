Write-Host "Atualização automática do AI Studio iniciada..."

# Caminho FINAL onde o AI Studio vive
$AI_DST = ".\src\aistudio\src"

# Verificar se a pasta existe
if (!(Test-Path $AI_DST)) {
    Write-Host "ERRO: A pasta src/aistudio/src não existe."
    Write-Host "Cria a pasta e extrai o ZIP diretamente para lá."
    exit
}

# Garantir supabase eterno
Write-Host "A garantir supabase eterno..."
Copy-Item ".\src\aistudio\supabase.ts" ".\src\aistudio\src\lib\supabase.ts" -Force

# Garantir wrapper eterno
Write-Host "A garantir wrapper eterno..."
Copy-Item ".\src\aistudio\AIStudioApp.jsx" ".\src\aistudio\AIStudioApp.jsx" -Force

# Commit automático
Write-Host "A criar commit..."
git add .
git commit -m "Atualização automática do AI Studio"

# Push automático
Write-Host "A enviar para GitHub..."
git push

# Deploy automático no Vercel
Write-Host "A disparar deploy no Vercel..."
vercel --prod

Write-Host "Atualização completa!"
