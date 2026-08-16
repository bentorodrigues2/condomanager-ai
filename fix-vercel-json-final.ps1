# Encoding: UTF-8

Write-Host "Corrigindo vercel.json (removendo rootDirectory)..." -ForegroundColor Cyan
Write-Host ""

# Remover ficheiro antigo
if (Test-Path "vercel.json") {
    Remove-Item -Force vercel.json
    Write-Host "OK vercel.json removido" -ForegroundColor Green
}

# Criar SEM rootDirectory
$vercelConfig = '{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}'

# Escrever com ASCII puro
$bytes = [System.Text.Encoding]::ASCII.GetBytes($vercelConfig)
[System.IO.File]::WriteAllBytes("vercel.json", $bytes)

Write-Host "OK vercel.json criado SEM rootDirectory" -ForegroundColor Green
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
git commit -m "fix: remove rootDirectory from vercel.json"
git push

Write-Host "OK Push concluido" -ForegroundColor Green
Write-Host ""
Write-Host "Agora execute:" -ForegroundColor Cyan
Write-Host "   vercel --prod --yes" -ForegroundColor Yellow
Write-Host ""