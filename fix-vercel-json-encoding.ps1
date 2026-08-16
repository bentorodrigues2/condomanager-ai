# Encoding: UTF-8

Write-Host "Corrigindo encoding do vercel.json..." -ForegroundColor Cyan
Write-Host ""

# Remover ficheiro antigo
if (Test-Path "vercel.json") {
    Remove-Item -Force vercel.json
    Write-Host "OK vercel.json removido" -ForegroundColor Green
}

# Criar com encoding ASCII (sem BOM)
$vercelConfig = '{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rootDirectory": "."
}'

# Escrever com ASCII puro
$bytes = [System.Text.Encoding]::ASCII.GetBytes($vercelConfig)
[System.IO.File]::WriteAllBytes("vercel.json", $bytes)

Write-Host "OK vercel.json criado com encoding ASCII" -ForegroundColor Green
Write-Host ""
Write-Host "Conteudo:" -ForegroundColor Yellow
Get-Content vercel.json
Write-Host ""

# Validar JSON
Write-Host "Validando JSON..." -ForegroundColor Cyan
try {
    $json = Get-Content vercel.json -Raw | ConvertFrom-Json
    Write-Host "OK JSON valido!" -ForegroundColor Green
}
catch {
    Write-Host "ERRO: JSON invalido!" -ForegroundColor Red
    exit 1
}

Write-Host ""
git add vercel.json
git commit -m "fix: vercel.json with correct encoding"
git push

Write-Host "OK Push concluido" -ForegroundColor Green
Write-Host ""
Write-Host "Agora execute:" -ForegroundColor Cyan
Write-Host "   vercel --prod --yes" -ForegroundColor Yellow
Write-Host ""