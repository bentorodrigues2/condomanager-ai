Write-Host "=== LOCALIZAR BOTAO LOGIN (APP PRINCIPAL) ==="

$patterns = @(
    "Login",
    "login",
    "/login",
    "perfil",
    "/perfil",
    "dashboard",
    "/dashboard",
    "navigate(",
    "Link",
    "to="
)

foreach ($pattern in $patterns) {
    Write-Host "`n--- Procurando por: $pattern ---"
    Get-ChildItem -Path "src" -Recurse -Include *.tsx, *.jsx |
        Where-Object { $_.FullName -notmatch "aistudio" } |
        Select-String -Pattern $pattern |
        ForEach-Object {
            Write-Host "Encontrado em: $($_.Path)"
            Write-Host "Linha: $($_.Line)"
        }
}

Write-Host "`n=== CONCLUIDO ==="
