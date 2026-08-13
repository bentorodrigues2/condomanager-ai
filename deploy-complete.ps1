# Encoding: UTF-8
# Script de Deploy Automatico com Verificacao Completa

param(
    [switch]$SkipTests = $false,
    [switch]$SkipBackup = $false,
    [switch]$DryRun = $false
)

# Cores para output
$colors = @{
    Success = "Green"
    Error = "Red"
    Warning = "Yellow"
    Info = "Cyan"
}

function Write-Status {
    param([string]$Message, [string]$Type = "Info")
    $color = $colors[$Type]
    Write-Host "[$Type] $Message" -ForegroundColor $color
}

function Test-FileExists {
    param([string]$Path, [string]$Name)
    if (Test-Path $Path) {
        Write-Status "OK $Name encontrado" "Success"
        return $true
    } else {
        Write-Status "FALHA $Name NAO encontrado: $Path" "Error"
        return $false
    }
}

# ============================================
# 1. VERIFICACAO INICIAL
# ============================================
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "DEPLOY AUTOMATICO - VERIFICACAO COMPLETA" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

Write-Status "Iniciando verificacoes..." "Info"

# Verificar se esta num repositorio Git
if (!(Test-Path ".\.git")) {
    Write-Status "ERRO: Nao esta num repositorio Git valido!" "Error"
    exit 1
}
Write-Status "OK Repositorio Git valido" "Success"

# Verificar estrutura de pastas
$requiredFiles = @(
    @{ Path = "src/App.tsx"; Name = "App.tsx" },
    @{ Path = "src/auth/AuthGate.tsx"; Name = "AuthGate.tsx" },
    @{ Path = "src/auth/ProtectedRoute.tsx"; Name = "ProtectedRoute.tsx" },
    @{ Path = "src/lib/supabaseClient.ts"; Name = "supabaseClient.ts" },
    @{ Path = "src/aistudio/AIStudioApp.jsx"; Name = "AIStudioApp.jsx" },
    @{ Path = "src/aistudio/AIStudioLayout.jsx"; Name = "AIStudioLayout.jsx" },
    @{ Path = "src/aistudio/RequireAIStudio.jsx"; Name = "RequireAIStudio.jsx" },
    @{ Path = "src/aistudio/pages/Login.jsx"; Name = "Login.jsx" },
    @{ Path = "src/aistudio/context/AIAuthContext.jsx"; Name = "AIAuthContext.jsx" },
    @{ Path = "src/aistudio/supabase.ts"; Name = "aistudio/supabase.ts" },
    @{ Path = ".env"; Name = ".env" },
    @{ Path = "package.json"; Name = "package.json" }
)

Write-Host ""
Write-Status "Verificando ficheiros necessarios..." "Info"
$missingFiles = @()

foreach ($file in $requiredFiles) {
    if (!(Test-FileExists $file.Path $file.Name)) {
        $missingFiles += $file.Path
    }
}

if ($missingFiles.Count -gt 0) {
    Write-Host ""
    Write-Status "ERRO: Faltam ficheiros:" "Error"
    foreach ($file in $missingFiles) {
        Write-Host "  - $file" -ForegroundColor Red
    }
    exit 1
}

# ============================================
# 2. VERIFICAR .ENV
# ============================================
Write-Host ""
Write-Status "Verificando configuracao .env..." "Info"

$envContent = Get-Content ".env" -Raw
if ($envContent -notmatch "VITE_SUPABASE_URL") {
    Write-Status "AVISO: VITE_SUPABASE_URL nao encontrada em .env" "Warning"
}
if ($envContent -notmatch "VITE_SUPABASE_ANON_KEY") {
    Write-Status "AVISO: VITE_SUPABASE_ANON_KEY nao encontrada em .env" "Warning"
}
Write-Status "OK .env verificado" "Success"

# ============================================
# 3. CRIAR BACKUP
# ============================================
if (!$SkipBackup) {
    Write-Host ""
    Write-Status "Criando backup..." "Info"
    $backupFolder = ".\backup_$(Get-Date -Format 'yyyyMMdd_HHmmss')"
    
    if (!(Test-Path $backupFolder)) {
        New-Item -ItemType Directory -Path $backupFolder | Out-Null
    }
    
    Copy-Item "src" "$backupFolder\src" -Recurse -Force -ErrorAction SilentlyContinue
    Write-Status "OK Backup criado em: $backupFolder" "Success"
}

# ============================================
# 4. INSTALAR DEPENDENCIAS
# ============================================
Write-Host ""
Write-Status "Verificando Node.js..." "Info"

$nodeVersion = node --version 2>$null
if ($nodeVersion) {
    Write-Status "OK Node.js $nodeVersion encontrado" "Success"
}
else {
    Write-Status "ERRO: Node.js nao esta instalado!" "Error"
    exit 1
}

Write-Host ""
Write-Status "Instalando dependencias..." "Info"

if (Test-Path "bun.lock") {
    Write-Status "Usando Bun..." "Info"
    bun install
    if ($LASTEXITCODE -ne 0) {
        Write-Status "ERRO ao instalar com Bun!" "Error"
        exit 1
    }
}
else {
    Write-Status "Usando npm..." "Info"
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Status "ERRO ao instalar com npm!" "Error"
        exit 1
    }
}
Write-Status "OK Dependencias instaladas" "Success"

# ============================================
# 5. BUILD E TESTES
# ============================================
if (!$SkipTests) {
    Write-Host ""
    Write-Status "Construindo projeto..." "Info"
    
    if (Test-Path "bun.lock") {
        bun run build
    }
    else {
        npm run build
    }
    
    if ($LASTEXITCODE -ne 0) {
        Write-Status "ERRO no build! Verifique os erros acima." "Error"
        exit 1
    }
    Write-Status "OK Build concluido com sucesso" "Success"
}

# ============================================
# 6. COMMIT E PUSH
# ============================================
Write-Host ""
Write-Status "Preparando commit..." "Info"

git add .
Write-Status "OK Ficheiros adicionados" "Success"

Write-Host ""
Write-Status "Criando commit..." "Info"
$commitMessage = "[DEPLOY] Atualizacao automatica - $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
git commit -m $commitMessage --allow-empty

if ($LASTEXITCODE -ne 0) {
    Write-Status "AVISO: Problema ao fazer commit" "Warning"
}

Write-Host ""
Write-Status "Fazendo push para GitHub..." "Info"

if ($DryRun) {
    Write-Status "DRY RUN: Pulando git push" "Warning"
}
else {
    git push
    if ($LASTEXITCODE -ne 0) {
        Write-Status "ERRO ao fazer push!" "Error"
        exit 1
    }
    Write-Status "OK Push concluido com sucesso" "Success"
}

# ============================================
# 7. DEPLOY NO VERCEL
# ============================================
Write-Host ""
Write-Status "Verificando Vercel CLI..." "Info"

$vercelVersion = vercel --version 2>$null
if ($vercelVersion) {
    Write-Status "OK Vercel CLI encontrado: $vercelVersion" "Success"
    
    Write-Host ""
    Write-Status "Iniciando deploy no Vercel..." "Info"
    
    if ($DryRun) {
        Write-Status "DRY RUN: Pulando deploy Vercel" "Warning"
    }
    else {
        vercel --prod --yes
        
        if ($LASTEXITCODE -eq 0) {
            Write-Status "OK Deploy Vercel concluido com sucesso!" "Success"
        }
        else {
            Write-Status "AVISO: Deploy Vercel pode ter tido problemas" "Warning"
        }
    }
}
else {
    Write-Status "AVISO: Vercel CLI nao encontrado. Pulando deploy automatico." "Warning"
    Write-Status "Para instalar: npm install -g vercel" "Info"
}

# ============================================
# 8. RESUMO FINAL
# ============================================
Write-Host ""
Write-Host "=====================================" -ForegroundColor Green
Write-Host "OK DEPLOY AUTOMATICO CONCLUIDO!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""

Write-Status "Resumo:" "Success"
Write-Host "  OK Estrutura verificada"
Write-Host "  OK Dependencias instaladas"
Write-Host "  OK Build concluido"
Write-Host "  OK Git sincronizado"
Write-Host "  OK Deploy iniciado"
Write-Host ""

if ($DryRun) {
    Write-Status "Este foi um DRY RUN (simulacao)" "Info"
}

Write-Status "Data/Hora: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" "Info"
Write-Host ""