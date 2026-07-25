Write-Host "Fix skyline definitivo..."

# Caminho onde o Vite espera a imagem
$assetsPath = "frontend/src/assets"

# Garantir pasta assets
if (!(Test-Path $assetsPath)) {
    New-Item -ItemType Directory -Path $assetsPath | Out-Null
    Write-Host "Pasta assets criada."
}

# Procurar imagem real no projeto
$possibleImages = @(
    "Layout inicial.png",
    "layout-inicial.png",
    "layout_inicial.png",
    "layout.png",
    "inicio.png",
    "inicio.jpg",
    "Layout inicial.jpg"
)

$foundImage = $null

foreach ($img in $possibleImages) {
    if (Test-Path $img) {
        $foundImage = $img
        break
    }
}

if ($foundImage -eq $null) {
    Write-Host "ERRO: Nenhuma imagem encontrada na raiz. Coloca a imagem ao lado deste script."
    exit
}

Write-Host "Imagem encontrada: $foundImage"

# Copiar e renomear para o nome que o codigo espera
Copy-Item $foundImage "$assetsPath/skyline.png" -Force
Write-Host "Imagem skyline.png criada."

# Git commit + push
git add .
git commit -m "Fix: skyline.png adicionada para resolver erro UNRESOLVED_IMPORT"
git push

Write-Host "Fix concluido. O Vercel vai reconstruir o deploy agora."
