Write-Host "?? A aplicar migrações ao Supabase..."

 = Get-ChildItem -Path "supabase/migrations" -Filter *.sql | Sort-Object Name

foreach ( in ) {
    Write-Host "?? A aplicar: "
    supabase db execute --file .FullName
}

Write-Host "?? Todas as migrações foram aplicadas!"
