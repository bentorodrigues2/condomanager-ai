# Encoding: UTF-8
Write-Host "Atualização ULTRA ROBUSTA iniciada..."

# Caminhos base
$root = ".\src\aistudio"
$zipFolder = "$root\src"
$libFolder = "$zipFolder\lib"
$backupFolder = ".\backup_aistudio"

# Validar se o repositório Git existe
if (!(Test-Path ".\.git")) {
    Write-Host "ERRO: Nao esta num repositorio Git valido!"
    exit 1
}

# Validar pasta raiz
if (!(Test-Path $root)) {
    Write-Host "ERRO: A pasta $root nao existe!"
    exit 1
}

# Criar backup automático
Write-Host "Criando backup..."
if (!(Test-Path $backupFolder)) {
    New-Item -ItemType Directory -Path $backupFolder | Out-Null
}
Copy-Item $zipFolder $backupFolder -Recurse -Force -ErrorAction SilentlyContinue

# Garantir que o ZIP foi extraído
if (!(Test-Path $zipFolder)) {
    Write-Host "ERRO: A pasta $zipFolder nao existe. O ZIP foi extraido?"
    exit 1
}

# Criar pasta lib se faltar
if (!(Test-Path $libFolder)) {
    Write-Host "Criando pasta lib..."
    New-Item -ItemType Directory -Path $libFolder | Out-Null
}

# Copiar supabase.ts se existir
$supabaseSource = "$root\supabase.ts"
$supabaseDest = "$libFolder\supabase.ts"

if (Test-Path $supabaseSource) {
    Write-Host "Garantindo supabase.ts..."
    Copy-Item $supabaseSource $supabaseDest -Force
    Write-Host "supabase.ts atualizado."
}
else {
    Write-Host "Aviso: supabase.ts nao encontrado"
}

# Garantir wrapper
$wrapperSource = "$root\AIStudioApp.jsx"
$wrapperDest = "$zipFolder\AIStudioApp.jsx"

Write-Host "Garantindo wrapper..."
if ((Test-Path $wrapperSource) -and (Test-Path $wrapperDest)) {
    $sourceHash = (Get-FileHash $wrapperSource).Hash
    $destHash = (Get-FileHash $wrapperDest).Hash
    
    if ($sourceHash -ne $destHash) {
        Copy-Item $wrapperSource $wrapperDest -Force
        Write-Host "Wrapper atualizado."
    }
    else {
        Write-Host "Wrapper ja esta correto."
    }
}
else {
    Write-Host "Aviso: Wrapper nao encontrado"
}

# Commit seguro
Write-Host "Criando commit..."
git add .
git commit -m "[ULTRA ROBUSTO] Atualizacao do AI Studio" --allow-empty

if ($LASTEXITCODE -ne 0) {
    Write-Host "Aviso ao fazer commit."
}

# Push seguro
Write-Host "Enviando para GitHub..."
git push

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERRO: Erro ao fazer push!"
    exit 1
}

# Deploy seguro
Write-Host "Disparando deploy no Vercel..."
vercel --prod

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERRO: Deploy falhou! Restaurando backup..."
    Remove-Item $zipFolder -Recurse -Force -ErrorAction SilentlyContinue
    Copy-Item "$backupFolder\src" $zipFolder -Recurse -Force
    Write-Host "Backup restaurado."
    exit 1
}
else {
    Write-Host "Deploy concluido com sucesso!"
}

Write-Host "Atualizacao ULTRA ROBUSTA completa!"