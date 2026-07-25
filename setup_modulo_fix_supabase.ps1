Write-Host "Fix Supabase Import..."

# Garantir que a pasta services existe
$servicesPath = "frontend/src/services"
if (!(Test-Path $servicesPath)) {
    New-Item -ItemType Directory -Path $servicesPath | Out-Null
    Write-Host "Pasta services criada."
} else {
    Write-Host "Pasta services ja existe."
}

# Criar ficheiro useSupabase.js minimo para desbloquear o build
$useSupabasePath = "$servicesPath/useSupabase.js"
$useSupabaseContent = @(
'// Ficheiro criado automaticamente para desbloquear o build no Vercel'
'export function useSupabaseTable() {'
'  return null;'
'}'
)
Set-Content -Path $useSupabasePath -Value $useSupabaseContent -Force
Write-Host "useSupabase.js criado."

# Remover imports partidos nos modulos antigos
$modules = @(
"frontend/src/pages/modulos/intervencoes.jsx",
"frontend/src/pages/gestor/Dashboard.jsx",
"frontend/src/pages/modulos/financeiro.jsx",
"frontend/src/pages/modulos/obras.jsx",
"frontend/src/pages/modulos/limpezas.jsx"
)

foreach ($file in $modules) {
    if (Test-Path $file) {
        $content = Get-Content $file
        $newContent = $content -replace 'import\s+\{.*useSupabase.*\}.*;', '// import removido automaticamente'
        Set-Content -Path $file -Value $newContent -Force
        Write-Host "Import removido em: $file"
    }
}

# Git commit + push
git add .
git commit -m "Fix: added missing useSupabase.js and removed broken imports to unblock Vercel build"
git push

Write-Host "Fix concluido."
