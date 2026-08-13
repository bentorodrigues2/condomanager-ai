Write-Host "Atualização automática do AI Studio iniciada..."

# Caminhos
$root = ".\src\aistudio"
$zipFolder = "$root\src"
$libFolder = "$zipFolder\lib"

# Garantir pasta lib
if (!(Test-Path $libFolder)) {
    Write-Host "A criar pasta lib..."
    New-Item -ItemType Directory -Path $libFolder | Out-Null
}

# Copiar supabase.ts apenas se existir
$supabaseSource = "$root\supabase.ts"
$supabaseDest = "$libFolder\supabase.ts"

if (Test-Path $supabaseSource) {
    Write-Host "A garantir supabase eterno..."
    Copy-Item $supabaseSource $supabaseDest -Force
} else {
    Write-Host "⚠️ supabase.ts não existe em src/aistudio — ignorado."
}

# Copiar wrapper apenas se destino for diferente
$wrapperSource = "$root\AIStudioApp.jsx"
$wrapperDest = "$root\AIStudioApp.jsx"

Write-Host "A garantir wrapper eterno..."
# Não copiar se for o mesmo ficheiro
if ($wrapperSource -ne $wrapperDest) {
    Copy-Item $wrapperSource $wrapperDest -Force
} else {
    Write-Host "Wrapper já está no sítio — ignorado."
}

# Commit
Write-Host "A criar commit..."
git add .
git commit -m "Atualização automática do AI Studio" --allow-empty

# Push
Write-Host "A enviar para GitHub..."
git push

# Deploy
Write-Host "A disparar deploy no Vercel..."
vercel --prod

Write-Host "Atualização completa!"
