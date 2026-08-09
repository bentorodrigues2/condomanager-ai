param(
    [string] = "migration"
)

 = (Get-Date -Format "yyyyMMddHHmmss")
 = "supabase/migrations/-.sql"

'-- Escreve aqui a tua migração SQL' | Set-Content -Path 

Write-Host "? Migração criada: "
