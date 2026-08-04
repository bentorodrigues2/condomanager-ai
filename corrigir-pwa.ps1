Write-Host "=== Diagnóstico e Correção CondoManager-AI ==="

$base = (Get-Location).Path
$pwa = Join-Path $base "pwa"
$public = Join-Path $base "public"
$viteConfig = Join-Path $base "vite.config.js"
$envFile = Join-Path $pwa ".env.local"
$manifestPath = Join-Path $public "manifest.json"
$swPath = Join-Path $pwa "service-worker.js"

# Corrigir .env.local
if (-not (Test-Path $envFile)) {
@"
VITE_SUPABASE_URL=https://kejnoxkllsrpijzeaiqr.supabase.co
VITE_SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
"@ | Set-Content $envFile -Encoding UTF8
Write-Host "Criado novo .env.local"
}

# Corrigir vite.config.js
if (Test-Path $viteConfig) {
$content = Get-Content $viteConfig -Raw
$content = $content -replace 'process.cwd..', "path.resolve(__dirname, 'pwa')"
$content = $content -replace 'port.:.5173,', "port: 5173,`n    strictPort: true,"
Set-Content $viteConfig $content -Encoding UTF8
Write-Host "vite.config.js corrigido"
}

# Corrigir manifest.json
try {
Get-Content $manifestPath -Raw | ConvertFrom-Json | Out-Null
Write-Host "manifest.json válido"
} catch {
@"
{
  "name": "CondoManager AI",
  "short_name": "CondoManager",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "orientation": "portrait",
  "background_color": "#ffffff",
  "theme_color": "#1A1A1A",
  "icons": [
    { "src": "/icons/favicon-64.png", "sizes": "64x64", "type": "image/png" },
    { "src": "/icons/favicon-128.png", "sizes": "128x128", "type": "image/png" },
    { "src": "/icons/favicon-256.png", "sizes": "256x256", "type": "image/png" },
    { "src": "/icons/favicon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
"@ | Set-Content $manifestPath -Encoding UTF8
Write-Host "manifest.json recriado"
}

# Corrigir service-worker.js
if (-not (Test-Path $swPath)) {
@"
self.addEventListener('install', () => console.log('Service Worker instalado'));
self.addEventListener('fetch', e => e.respondWith(fetch(e.request)));
"@ | Set-Content $swPath -Encoding UTF8
Write-Host "service-worker.js criado"
}

# Limpar cache e reiniciar
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
if (Test-Path "$pwa\node_modules\.vite") {
    Remove-Item "$pwa\node_modules\.vite" -Recurse -Force
}
Write-Host "Cache Vite limpa"

cd $pwa
npm install
npm run dev

Write-Host "=== Correção concluída ==="
