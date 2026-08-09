Write-Host "?? A criar backup incremental da base de dados Supabase..."

 = (Get-Date -Format "yyyyMMdd-HHmmss")
 = "supabase/backups/incremental-.sql"

supabase db dump --data-only --file 

Write-Host "? Backup incremental criado: "
