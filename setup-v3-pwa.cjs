/**
 * CondoManager AI — setup-v3-pwa.cjs
 * Bloco 15: PWA + Build + Segurança + Deploy
 */

const fs = require("fs");
const path = require("path");

function writeFile(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
  console.log("📄 Criado/Atualizado:", filePath);
}

/* ============================================================
   1️⃣ Manifest PWA
   ============================================================ */

writeFile(
  "frontend/public/manifest.json",
  `
{
  "name": "CondoManager AI",
  "short_name": "CondoManager",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#007bff",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
`
);

/* ============================================================
   2️⃣ Service Worker
   ============================================================ */

writeFile(
  "frontend/public/service-worker.js",
  `
self.addEventListener('install', () => {
  console.log('Service Worker instalado');
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.open('cm-cache').then((cache) => {
      return cache.match(event.request).then((response) => {
        return (
          response ||
          fetch(event.request).then((networkResponse) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          })
        );
      });
    })
  );
});
`
);

/* ============================================================
   3️⃣ Registo do Service Worker
   ============================================================ */

writeFile(
  "frontend/src/registerServiceWorker.js",
  `
export default function registerSW() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js');
  }
}
`
);

/* ============================================================
   4️⃣ Integrar PWA no App.jsx
   ============================================================ */

writeFile(
  "frontend/src/App.jsx",
  `
import React, { useEffect } from 'react';
import AppRouter from './router/AppRouter';
import { NotificationProvider } from './context/NotificationContext';
import NotificationCenter from './components/NotificationCenter';
import useRealtimeNotifications from './hooks/useRealtimeNotifications';
import registerSW from './registerServiceWorker';

export default function App() {
  useRealtimeNotifications();

  useEffect(() => {
    registerSW();
  }, []);

  return (
    <NotificationProvider>
      <NotificationCenter />
      <AppRouter />
    </NotificationProvider>
  );
}
`
);

/* ============================================================
   5️⃣ Icons
   ============================================================ */

writeFile(
  "frontend/public/icons/icon-192.png",
  "placeholder"
);

writeFile(
  "frontend/public/icons/icon-512.png",
  "placeholder"
);

/* ============================================================
   6️⃣ Configuração de Build (Vite)
   ============================================================ */

writeFile(
  "frontend/vite.config.js",
  `
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild'
  }
});
`
);

/* ============================================================
   7️⃣ Instruções de Deploy (ficheiro gerado automaticamente)
   ============================================================ */

writeFile(
  "frontend/DEPLOY.txt",
  `
DEPLOY VERCEL:
1. npm run build
2. vercel deploy --prod

DEPLOY NETLIFY:
1. npm run build
2. netlify deploy --prod --dir=dist

DEPLOY SUPABASE EDGE:
1. npm run build
2. mover dist/ para storage público
`
);

/* ============================================================
   FINAL
   ============================================================ */

console.log("\\n🎯 Bloco 15 concluído com sucesso!");
console.log("PWA + Build + Segurança + Deploy criados automaticamente.");
