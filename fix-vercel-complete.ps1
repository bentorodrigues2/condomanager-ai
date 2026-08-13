# Encoding: UTF-8
# Script para corrigir Vercel completamente

Write-Host "Corrigindo Vercel completamente..." -ForegroundColor Cyan
Write-Host ""

# 1. Remover tudo do Vercel
Write-Host "1. Removendo configuracoes antigas..." -ForegroundColor Yellow
if (Test-Path ".vercel") {
    Remove-Item -Force -Recurse .vercel
    Write-Host "   OK .vercel removido" -ForegroundColor Green
}

if (Test-Path ".env.local") {
    Remove-Item -Force .env.local
    Write-Host "   OK .env.local removido" -ForegroundColor Green
}

Write-Host ""

# 2. Remover vercel.json se existir
if (Test-Path "vercel.json") {
    Remove-Item -Force vercel.json
    Write-Host "   OK vercel.json removido" -ForegroundColor Green
}

Write-Host ""

# 3. Git commit
Write-Host "2. Fazendo commit..." -ForegroundColor Yellow
git add .
git commit -m "cleanup: reset vercel config" --allow-empty
git push
Write-Host "   OK Push concluido" -ForegroundColor Green

Write-Host ""

# 4. Unlink Vercel
Write-Host "3. Desligando do Vercel..." -ForegroundColor Yellow
vercel unlink --yes
Write-Host "   OK Desligado" -ForegroundColor Green

Write-Host ""

# 5. Link novamente (INTERATIVO)
Write-Host "4. Ligando ao Vercel novamente..." -ForegroundColor Yellow
Write-Host "   Quando perguntar, responda:" -ForegroundColor Cyan
Write-Host "   - Set up and deploy: YES" -ForegroundColor Gray
Write-Host "   - Which scope: bento-rodrigues2" -ForegroundColor Gray
Write-Host "   - Link to existing project: YES" -ForegroundColor Gray
Write-Host "   - Which existing project: condomanager-ai" -ForegroundColor Gray
Write-Host ""

vercel link --yes

Write-Host ""
Write-Host "=====================================" -ForegroundColor Green
Write-Host "OK CONFIGURACAO RECRIADA!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""

Write-Host "Agora execute:" -ForegroundColor Cyan
Write-Host "   vercel --prod --yes" -ForegroundColor Yellow
Write-Host ""