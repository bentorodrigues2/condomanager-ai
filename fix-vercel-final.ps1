# Encoding: UTF-8
# Script final para corrigir Vercel com caminhos com espacos

Write-Host "Corrigindo configuracao Vercel..." -ForegroundColor Cyan
Write-Host ""

# Verifica caminho atual
$currentPath = Get-Location
Write-Host "Caminho atual: $currentPath" -ForegroundColor Yellow

# Conteudo do vercel.json SIMPLES (minimo)
$vercelConfig = '{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}'

# Escrever ficheiro com encoding ASCII (sem BOM)
$vercelPath = "vercel.json"
[System.IO.File]::WriteAllText($vercelPath, $vercelConfig, [System.Text.Encoding]::ASCII)

Write-Host "OK vercel.json criado" -ForegroundColor Green

# Verificar se ficheiro foi criado
if (Test-Path $vercelPath) {
    Write-Host "OK Ficheiro existe" -ForegroundColor Green
    Write-Host ""
    Write-Host "Conteudo:" -ForegroundColor Yellow
    Get-Content $vercelPath
    Write-Host ""
} else {
    Write-Host "ERRO: Ficheiro nao foi criado!" -ForegroundColor Red
    exit 1
}

# Validar JSON
Write-Host "Validando JSON..." -ForegroundColor Cyan
try {
    $json = Get-Content $vercelPath -Raw | ConvertFrom-Json
    Write-Host "OK JSON valido!" -ForegroundColor Green
} catch {
    Write-Host "ERRO ao validar JSON: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "=====================================" -ForegroundColor Green
Write-Host "VERCEL.JSON CORRIGIDO COM SUCESSO!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""

# Instrucoes para variaveis de ambiente
Write-Host "Proximos passos:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Aceda a dashboard Vercel:"
Write-Host "   https://vercel.com/dashboard" -ForegroundColor Yellow
Write-Host ""
Write-Host "2. Selecione projeto: condomanager-ai" -ForegroundColor Yellow
Write-Host ""
Write-Host "3. Va para: Settings > Environment Variables" -ForegroundColor Yellow
Write-Host ""
Write-Host "4. Adicione estas variaveis:" -ForegroundColor Yellow
Write-Host "   Nome: VITE_SUPABASE_URL"
Write-Host "   Valor: https://seu-projeto.supabase.co" -ForegroundColor Gray
Write-Host ""
Write-Host "   Nome: VITE_SUPABASE_ANON_KEY"
Write-Host "   Valor: sua-chave-anonima" -ForegroundColor Gray
Write-Host ""
Write-Host "5. Depois execute:" -ForegroundColor Yellow
Write-Host "   .\deploy-complete.ps1" -ForegroundColor Cyan
Write-Host ""
Write-Host "6. Ou manualmente:"
Write-Host "   git add vercel.json"
Write-Host "   git commit -m 'fix: vercel config'"
Write-Host "   git push"
Write-Host "   vercel --prod --yes" -ForegroundColor Cyan
Write-Host ""