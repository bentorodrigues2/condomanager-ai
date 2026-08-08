Write-Host "=== SETUP PWA PRE-AI STUDIO ==="

$root = (Get-Location).Path
$pwa = Join-Path $root "pwa"
$src = Join-Path $pwa "src"
$auth = Join-Path $src "auth"
$roles = Join-Path $src "roles"

# Criar pastas necessárias
Write-Host "`n--- Criando estrutura de pastas ---"
New-Item -ItemType Directory -Force -Path $auth | Out-Null
New-Item -ItemType Directory -Force -Path $roles | Out-Null

# Criar ficheiros base de autenticação
Write-Host "`n--- Criando ficheiros de autenticação ---"

Set-Content -Path (Join-Path $auth "Login.jsx") -Value @"
export default function Login() {
  return <div>Login (placeholder)</div>;
}
"@

Set-Content -Path (Join-Path $auth "Register.jsx") -Value @"
export default function Register() {
  return <div>Register (placeholder)</div>;
}
"@

Set-Content -Path (Join-Path $auth "SessionListener.jsx") -Value @"
export default function SessionListener() {
  return null; // AI Studio irá substituir
}
"@

Set-Content -Path (Join-Path $auth "ProtectedRoute.jsx") -Value @"
export default function ProtectedRoute({ children }) {
  return children; // AI Studio irá substituir
}
"@

# Criar roleMap
Write-Host "`n--- Criando roleMap ---"

Set-Content -Path (Join-Path $roles "roleMap.js") -Value @"
export const roleMap = {
  administrador: "/admin",
  gestor: "/gestor",
  técnico: "/tecnico",
  auditor: "/auditor",
  contabilista: "/contabilista",
  juridico: "/juridico",
  limpezas: "/limpezas",
  "condómino": "/condomino",
};
"@

# Atualizar App.jsx com fallback de sessão
Write-Host "`n--- Atualizando App.jsx ---"

$appPath = Join-Path $src "App.jsx"
$appContent = Get-Content $appPath -Raw

$appContent = $appContent -replace "if \(!role\) return <div>Carregando...\<\/div>;", "if (!role) return <Login />;"

Set-Content -Path $appPath -Value $appContent

# Atualizar router.jsx com rotas de login
Write-Host "`n--- Atualizando router.jsx ---"

$routerPath = Join-Path $src "router.jsx"
$routerContent = Get-Content $routerPath -Raw

if ($routerContent -notmatch "Login") {
    $routerContent = $routerContent -replace "export default function AppRouter", "import Login from \"./auth/Login.jsx\";\nimport Register from \"./auth/Register.jsx\";\n\nexport default function AppRouter"
}

if ($routerContent -notmatch "/login") {
    $routerContent = $routerContent -replace "return \(", "return (\n      <Route path=\"/login\" element={<Login />} />\n      <Route path=\"/register\" element={<Register />} />"
}

Set-Content -Path $routerPath -Value $routerContent

# Validar supabaseClient.js
Write-Host "`n--- Validando supabaseClient.js ---"

$supaPath = Join-Path $src "supabaseClient.js"
$supaContent = Get-Content $supaPath -Raw

if ($supaContent.Trim().Length -lt 20) {
    Write-Host "[ERRO] supabaseClient.js está vazio — recriando..."
    Set-Content -Path $supaPath -Value @"
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
"@
} else {
    Write-Host "[OK] supabaseClient.js válido"
}

Write-Host "`n=== SETUP COMPLETO ==="
Write-Host "A PWA está pronta para integrar o AI Studio."
