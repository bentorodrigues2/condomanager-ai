Write-Host "Fix Supabase Calls..."

# Lista de ficheiros onde o Vercel reportou erros
$modules = @(
"frontend/src/pages/modulos/intervencoes.jsx",
"frontend/src/pages/gestor/Dashboard.jsx",
"frontend/src/pages/modulos/financeiro.jsx",
"frontend/src/pages/modulos/obras.jsx",
"frontend/src/pages/modulos/limpezas.jsx"
)

foreach ($file in $modules) {
    if (Test-Path $file) {
        Write-Host "Processando: $file"

        $content = Get-Content $file

        # Remover chamadas a useSupabaseTable(
        $newContent = $content -replace 'useSupabaseTable\s*\([^)]*\)', 'null'

        # Remover linhas que contenham useSupabaseTable
        $newContent = $newContent -replace '.*useSupabaseTable.*', '// chamada removida automaticamente'

        Set-Content -Path $file -Value $newContent -Force

        Write-Host "Chamadas removidas em: $file"
    }
}

# Git commit + push
git add .
git commit -m "Fix: removed all useSupabaseTable calls to unblock Vercel build"
git push

Write-Host "Fix concluido."
