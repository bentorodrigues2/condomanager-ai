Write-Host "=== Fixing CondoManager AI Project ==="

# 1. Remove diagnostic scripts
Write-Host "`nRemoving diagnostic scripts..."
Get-ChildItem -Path . -Include *.ps1, *.sh -Recurse | Where-Object {
    $_.Name -like "*diagnose*" -or $_.Name -like "*test*" -or $_.Name -like "*.sh"
} | Remove-Item -Force -Recurse

# 2. Ensure index.html is in project root
Write-Host "`nChecking index.html location..."
if (Test-Path ".\src\index.html") {
    Write-Host "Moving index.html from src/ to project root..."
    Move-Item ".\src\index.html" ".\index.html" -Force
}

# 3. Fix index.html script reference
Write-Host "`nFixing index.html script reference..."
$indexPath = ".\index.html"
if (Test-Path $indexPath) {
    $content = Get-Content $indexPath
    $fixed = $content -replace 'src="/main.jsx"', 'src="/src/main.jsx"'
    $fixed = $fixed -replace 'src="/index.tsx"', 'src="/src/main.jsx"'
    $fixed | Set-Content $indexPath
}

# 4. Remove dist folder completely
Write-Host "`nRemoving dist folder..."
if (Test-Path ".\dist") {
    Remove-Item ".\dist" -Recurse -Force
}

# 5. Clean Vercel config
Write-Host "`nFixing vercel.json..."
@'
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
'@ | Set-Content ".\vercel.json"

# 6. Run local build
Write-Host "`nRunning local build..."
npm run build

# 7. Commit and push
Write-Host "`nCommitting and pushing changes..."
git add .
git commit -m "Automatic project fix: structure, index.html, dist cleanup, vercel.json"
git push

Write-Host "`n=== Fix completed. Check new Vercel deployment. ==="
