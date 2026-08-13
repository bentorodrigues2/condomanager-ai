# Encoding: UTF-8
# Script para corrigir Root Directory no Vercel

Write-Host "Corrigindo Root Directory no Vercel..." -ForegroundColor Cyan
Write-Host ""

# Remover cache do Vercel
if (Test-Path ".vercel") {
    Write-Host "Removendo cache .vercel..." -ForegroundColor Yellow
    rm -Force -Recurse .vercel
    Write-Host "OK Cache removido" -ForegroundColor Green
}

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "PROXIMAS INSTRUCOES:" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "1. Aceda ao Dashboard Vercel:" -ForegroundColor Yellow
Write-Host "   https://vercel.com/dashboard/bento-rodrigues2/condomanager-ai"
Write-Host ""

Write-Host "2. Vá para: Settings > General" -ForegroundColor Yellow
Write-Host ""

Write-Host "3. Localize: Root Directory" -ForegroundColor Yellow
Write-Host "   Campo de input com './' ou vazio"
Write-Host ""

Write-Host "4. MUDE para: . (apenas um ponto)" -ForegroundColor Cyan
Write-Host "   Remove o '/' do final"
Write-Host ""

Write-Host "5. Clique em: Save" -ForegroundColor Yellow
Write-Host ""

Write-Host "6. Aguarde alguns segundos e depois execute:" -ForegroundColor Green
Write-Host "   vercel --prod --yes" -ForegroundColor Cyan
Write-Host ""

Write-Host "=====================================" -ForegroundColor Green
Write-Host ""