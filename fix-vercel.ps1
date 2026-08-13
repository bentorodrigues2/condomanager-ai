# Encoding: UTF-8
# Script para corrigir configuracao Vercel

Write-Host "Corrigindo configuracao Vercel..." -ForegroundColor Cyan
Write-Host ""

# Conteudo correto do vercel.json
$vercelConfig = @{
    "buildCommand" = "npm run build"
    "outputDirectory" = "dist"
    "framework" = "vite"
    "env" = @{
        "VITE_SUPABASE_URL" = "@vite_supabase_url"
        "VITE_SUPABASE_ANON_KEY" = "@vite_supabase_anon_key"
    }
} | ConvertTo-Json -Depth 10

# Guardar vercel.json
$vercelConfig | Out-File -FilePath "vercel.json" -Encoding UTF8
Write-Host "OK vercel.json criado/atualizado" -ForegroundColor Green

Write-Host ""
Write-Host "Conteudo:" -ForegroundColor Yellow
Write-Host $vercelConfig
Write-Host ""

# Adicionar variaveis de ambiente ao Vercel
Write-Host "Para adicionar variaveis de ambiente ao Vercel:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Aceda a: https://vercel.com/dashboard" -ForegroundColor Yellow
Write-Host "2. Selecione o seu projeto 'condomanager-ai'"
Write-Host "3. Vá para Settings > Environment Variables"
Write-Host "4. Adicione:" -ForegroundColor Yellow
Write-Host "   VITE_SUPABASE_URL = sua-url-do-supabase"
Write-Host "   VITE_SUPABASE_ANON_KEY = sua-chave-anonima"
Write-Host ""

Write-Host "Depois execute: .\deploy-complete.ps1" -ForegroundColor Cyan
Write-Host ""