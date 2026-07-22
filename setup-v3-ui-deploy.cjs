/**
 * CondoManager AI — setup-v3-ui-deploy.cjs
 * Bloco 4: Deploy, Build, Variáveis, PWA Final, Verificação
 */

const fs = require("fs");
const path = require("path");

// Utilitário para criar ficheiros
function writeFile(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
  console.log("📄 Criado:", filePath);
}

// === 1. Criar ficheiro vercel.json ===
writeFile(
  "frontend/vercel.json",
  `
{
  "version": 2,
  "builds": [
    { "src": "package.json", "use": "@vercel/static-build" }
  ],
  "routes": [
    { "src": "/(.*)", "dest": "/" }
  ]
}
`
);

// === 2. Criar script de build no package.json ===
const pkgPath = "frontend/package.json";
let pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));

pkg.scripts = pkg.scripts || {};
pkg.scripts.build = "vite build";
pkg.scripts.preview = "vite preview";

fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
console.log("🔧 Scripts de build adicionados ao package.json");

// === 3. Criar ficheiro de verificação PWA ===
writeFile(
  "frontend/src/pwa-check.js",
  `
export function verificarPWA() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(() => {
      console.log('PWA ativa e pronta');
    });
  } else {
    console.warn('Service Worker não encontrado');
  }

  if (window.matchMedia('(display-mode: standalone)').matches) {
    console.log('App instalada como PWA');
  } else {
    console.log('App ainda não instalada');
  }
}
`
);

// === 4. Criar splash screen e ícones base ===
writeFile(
  "frontend/public/splash-screen.html",
  `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>CondoManager AI</title>
    <style>
      body {
        background-color: #0f0f0f;
        color: #00b37e;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        font-family: Arial;
      }
    </style>
  </head>
  <body>
    <h1>CondoManager AI</h1>
  </body>
</html>
`
);

// === 5. Criar README de Deploy ===
writeFile(
  "frontend/DEPLOY.md",
  `
# CondoManager AI — Deploy

## 1. Instalar dependências
npm install

## 2. Build
npm run build

## 3. Deploy na Vercel
vercel --prod

## 4. Verificar PWA
Abra a app no telemóvel e instale pelo browser.

## 5. Verificar Service Worker
Abra o DevTools → Application → Service Workers.
`
);

// === Final ===
console.log("\\n🎯 Bloco 4 concluído com sucesso!");
console.log("Deploy, Build, PWA Final e Verificação prontos.");
