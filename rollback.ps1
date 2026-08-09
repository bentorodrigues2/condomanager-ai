param(
    [string]
)

 = "supabase/rollback/"

if (-Not (Test-Path )) {
    Write-Host "? Rollback não encontrado: "
    exit
}

Write-Host "? A aplicar rollback: "
supabase db execute --file 

Write-Host "? Rollback aplicado."
