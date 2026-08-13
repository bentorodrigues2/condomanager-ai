Write-Host "=== LOCALIZAR BOTAO AREA PESSOAL ==="

$patterns = @(
    "Area Pessoal",
    "Área Pessoal",
    "/perfil",
    "/login",
    "/app",
    "Link",
    "navigate",
    "Perfil",
    "Sidebar",
    "Menu"
)

foreach ($pattern in $patterns) {
    Write-Host "`n--- Procurando por: $pattern ---"
    Get-ChildItem -Path "." -Recurse -Include *.jsx, *.tsx | Select-String -Pattern $pattern | ForEach-Object {
        Write-Host "Encontrado em: $($_.Path)"
        Write-Host "Linha: $($_.Line)"
    }
}

Write-Host "`n=== CONCLUIDO ==="
