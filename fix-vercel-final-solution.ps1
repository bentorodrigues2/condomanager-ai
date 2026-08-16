# Encoding: UTF-8

Write-Host "Criando vercel.json com configuracao correta..." -ForegroundColor Cyan
Write-Host ""

$vercelConfig = @'
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rootDirectory": "."
}
'@

[System.IO.File]::WriteAllText("vercel.json", $vercelConfig, [System.Text.Encoding]::UTF8)

Write-Host "OK vercel.json criado" -ForegroundColor Green
Write-Host ""
Write-Host "Conteudo:" -ForegroundColor Yellow
Get-Content vercel.json
Write-Host ""

git add vercel.json
git commit -m "fix: vercel config com rootDirectory correto"
git push

Write-Host "OK Push concluido" -ForegroundColor Green
Write-Host ""
Write-Host "Agora execute:" -ForegroundColor Cyan
Write-Host "   vercel --prod --yes" -ForegroundColor Yellow
Write-Host ""