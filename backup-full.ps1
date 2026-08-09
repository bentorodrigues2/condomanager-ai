Write-Host "?? A criar backup completo da base de dados Supabase..."

 = (Get-Date -Format "yyyyMMdd-HHmmss")
 = "supabase/backups/full-.sql"

supabase db dump --file 

Write-Host "? Backup completo criado: "
