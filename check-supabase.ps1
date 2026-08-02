$backendPath = "backend"
$correctImport = "@supabase/supabase-js"
$wrongImport = "asupabase/supabase-js"

$shouldHave = @(
    "backend/supabase/supabaseNodeClient.cjs"
)

Write-Host "=== Verificar imports Supabase ==="

$files = Get-ChildItem -Path $backendPath -Recurse -Include *.js, *.cjs

$foundCorrect = @()
$foundWrong = @()
$missingCorrect = @()

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw

    if ($content -match $correctImport) {
        $foundCorrect += $file.FullName
    }

    if ($content -match $wrongImport) {
        $foundWrong += $file.FullName
    }
}

foreach ($expected in $shouldHave) {
    if (-not ($foundCorrect -contains $expected)) {
        $missingCorrect += $expected
    }
}

Write-Host "`nFiles with correct import:"
$foundCorrect | ForEach-Object { Write-Host "  $_" }

Write-Host "`nFiles with WRONG import:"
$foundWrong | ForEach-Object { Write-Host "  $_" }

Write-Host "`nFiles that SHOULD have correct import but do NOT:"
$missingCorrect | ForEach-Object { Write-Host "  $_" }

Write-Host "`n=== Verification complete ==="
