Write-Host "=== Verificação da Estrutura da PWA ==="

$paths = @(
    "pwa/src/auth",
    "pwa/src/roles",
    "pwa/src/pages",
    "pwa/src/components",
    "pwa/src",
    "pwa/src/App.jsx",
    "pwa/src/router.jsx",
    "pwa/src/supabaseClient.js",
    "pwa/src/auth/Login.jsx",
    "pwa/src/auth/Register.jsx",
    "pwa/src/auth/SessionListener.jsx",
    "pwa/src/auth/ProtectedRoute.jsx",
    "pwa/src/roles/roleMap.js"
)

foreach ($p in $paths) {
    if (Test-Path $p) {
        if ((Get-Item $p).PSIsContainer) {
            Write-Host "[OK] Pasta existe: $p"
        } else {
            $size = (Get-Item $p).Length
            if ($size -gt 0) {
                Write-Host "[OK] Ficheiro existe e não está vazio: $p ($size bytes)"
            } else {
                Write-Host "[ERRO] Ficheiro existe mas está vazio: $p"
            }
        }
    } else {
        Write-Host "[ERRO] Não existe: $p"
    }
}

Write-Host "`n=== Verificação concluída ==="
