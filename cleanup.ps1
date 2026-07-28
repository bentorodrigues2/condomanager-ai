Write-Host "=== Cleaning diagnostic and temporary files ==="

Get-ChildItem -Path . -Include *.ps1, *.sh, *.txt -Recurse | Where-Object {
    $_.Name -like "*diagnose*" -or
    $_.Name -like "*fix*" -or
    $_.Name -like "*test*" -or
    $_.Name -like "*.sh" -or
    $_.Name -like "*.txt"
} | Remove-Item -Force -Recurse

Write-Host "Cleanup complete."
