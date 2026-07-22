/**
 * CondoManager AI — setup-v3-ui-core.cjs
 * Bloco 1: Estrutura base + Tema + Router + Branding + PWA + Supabase
 */

const fs = require("fs");
const path = require("path");

// === 1. Estrutura de pastas ===
const folders = [
  "frontend/src/assets/branding/logos",
  "frontend/src/assets/branding/icons",
  "frontend/src/assets/branding/modules",
  "frontend/src/assets/branding/states",
  "frontend/src/assets/branding/actions",
  "frontend/src/components",
  "frontend/src/pages",
  "frontend/src/config",
  "frontend/src/styles",
  "frontend/public",
];

folders.forEach((folder) => {
  fs.mkdirSync(folder, { recursive: true });
});
console.log("✅ Estrutura de pastas criada");

// === 2. Temas (dark/light) ===
const themeCSS = `
:root[data-theme='dark'] {
  --bg: #0f0f0f;
  --surface: #1a1a1a;
  --text: #e0e0e0;
  --primary: #00b37e;
  --accent: #00ff99;
  --border: #2a2a2a;
}

:root[data-theme='light'] {
  --bg: #f9f9f9;
  --surface: #ffffff;
  --text: #222222;
  --primary: #00b37e;
  --accent: #007755;
  --border: #dddddd;
}
`;
fs.writeFileSync("frontend/src/styles/theme.css", themeCSS);
console.log("✅ Sistema de temas criado");

// === 3. Router principal ===
const appJSX = `
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import DashboardGestor from './pages/gestor/Dashboard';
import PainelProprietario from './pages/proprietario/Painel';
import Perfil from './pages/Perfil';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/gestor/dashboard" element={<DashboardGestor />} />
        <Route path="/proprietario/painel" element={<PainelProprietario />} />
        <Route path="/perfil" element={<Perfil />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
`;
fs.writeFileSync("frontend/src/App.jsx", appJSX);
console.log("✅ Router principal criado");

// === 4. Branding e ícones ===
const iconsJS = `
export const Icons = {
  enviar: '/assets/branding/actions/enviar.png',
  atualizar: '/assets/branding/actions/atualizar.png',
  predio: '/assets/branding/modules/predio.png',
  financeiro: '/assets/branding/modules/financeiro.png',
  ia: '/assets/branding/modules/ia.png',
};
`;
fs.writeFileSync("frontend/src/config/icons.js", iconsJS);
console.log("✅ Ficheiro de ícones criado");

// === 5. PWA ===
const manifest = {
  name: "CondoManager AI",
  short_name: "CondoManager",
  start_url: "/",
  display: "standalone",
  background_color: "#0f0f0f",
  theme_color: "#00b37e",
  icons: [
    {
      src: "/assets/branding/icons/app-icon.png",
      sizes: "512x512",
      type: "image/png",
    },
  ],
};
fs.writeFileSync("frontend/public/manifest.json", JSON.stringify(manifest, null, 2));

const serviceWorker = `
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open('condomanager-v3').then((cache) => {
      return cache.addAll(['/']);
    })
  );
});
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request))
  );
});
`;
fs.writeFileSync("frontend/public/service-worker.js", serviceWorker);
console.log("✅ PWA configurada");

// === 6. Supabase ===
const envFile = `
SUPABASE_URL=https://<your-project>.supabase.co
SUPABASE_KEY=<your-anon-key>
`;
fs.writeFileSync("frontend/.env", envFile);

const supabaseJS = `
import { createClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);
`;
fs.writeFileSync("frontend/src/config/supabase.js", supabaseJS);
console.log("✅ Supabase configurado");

// === Final ===
console.log("\\n🎯 Bloco 1 concluído com sucesso!");
console.log("Estrutura base + Tema + Router + Branding + PWA + Supabase prontos.");
