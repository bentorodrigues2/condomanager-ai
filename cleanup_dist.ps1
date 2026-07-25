Write-Host "Limpeza definitiva da pasta dist..."

# Apagar pasta dist local
if (Test-Path "frontend/dist") {
    Remove-Item -Recurse -Force "frontend/dist"
    Write-Host "Pasta dist removida localmente."
} else {
    Write-Host "Pasta dist nao existe localmente."
}

# Remover dist do Git
git rm -r --cached frontend/dist
Write-Host "Pasta dist removida do Git."

# Commit + push
git add .
git commit -m "Fix: remover pasta dist do repositorio para corrigir build Vercel"
git push

Write-Host "Dist removida. Vercel vai reconstruir corretamente."
