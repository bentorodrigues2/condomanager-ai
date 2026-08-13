# Encoding: UTF-8
# Script para corrigir configuracao Vercel

Write-Host "Corrigindo configuracao Vercel..." -ForegroundColor Cyan
Write-Host ""

# Conteudo correto do vercel.json (texto puro, sem ConvertTo-Json)
$vercelConfig = @'
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
'@

# Guardar vercel.json
$vercelConfig | Out-File -FilePath "vercel.json" -Encoding UTF8
Write-Host "OK vercel.json criado/atualizado" -ForegroundColor Green

Write-Host ""
Write-Host "Conteudo:" -ForegroundColor Yellow
Write-Host $vercelConfig
Write-Host ""

# Validar JSON
Write-Host "Validando JSON..." -ForegroundColor Cyan
try {
    $json = Get-Content "vercel.json" | ConvertFrom-Json
    Write-Host "OK JSON valido!" -ForegroundColor Green
} catch {
    Write-Host "ERRO: JSON invalido!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Agora adicione as variaveis de ambiente no Vercel:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Aceda a: https://vercel.com/dashboard" -ForegroundColor Cyan
Write-Host "2. Selecione o seu projeto 'condomanager-ai'"
Write-Host "3. Va para Settings > Environment Variables"
Write-Host "4. Adicione:" -ForegroundColor Cyan
Write-Host "   VITE_SUPABASE_URL = sua-url-do-supabase"
Write-Host "   VITE_SUPABASE_ANON_KEY = sua-chave-anonima"
Write-Host ""

Write-Host "Depois execute: .\deploy-complete.ps1" -ForegroundColor Green
Write-Host ""