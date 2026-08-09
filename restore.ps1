param(
    [string]
)

 = "supabase/backups/"

if (-Not (Test-Path )) {
    Write-Host "? Backup não encontrado: "
    exit
}

Write-Host "? A restaurar backup: "
supabase db execute --file 

Write-Host "? Base de dados restaurada."
