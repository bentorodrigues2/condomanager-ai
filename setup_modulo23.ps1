Write-Host "Iniciando Modulo 23..."

# Detectar ficheiro principal
$home1 = "frontend/src/App.jsx"
$home2 = "frontend/src/pages/Home.jsx"

if (Test-Path $home1) {
    $target = $home1
    Write-Host "App.jsx encontrado."
} elseif (Test-Path $home2) {
    $target = $home2
    Write-Host "Home.jsx encontrado."
} else {
    Write-Host "Nenhum ficheiro de entrada encontrado."
    exit
}

# Ler conteudo
$content = Get-Content $target

# Substituir LayoutTop por LayoutTopWithVideo
$newContent = $content -replace "LayoutTop", "LayoutTopWithVideo"

# Guardar
Set-Content -Path $target -Value $newContent -Force

Write-Host "Componente atualizado na pagina inicial."

# Git commit + push
git add .
git commit -m "Modulo 23: Pagina inicial atualizada para usar LayoutTopWithVideo"
git push

Write-Host "Modulo 23 concluido."
