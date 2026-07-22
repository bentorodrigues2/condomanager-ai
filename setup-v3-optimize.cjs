/**
 * CondoManager AI — setup-v3-optimize.cjs
 * Bloco 17: Otimização Final + Limpeza + Estrutura Definitiva
 */

const fs = require("fs");
const path = require("path");

function remove(file) {
  if (fs.existsSync(file)) {
    fs.rmSync(file, { recursive: true, force: true });
    console.log("🗑️ Removido:", file);
  }
}

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("📄 Criado/Atualizado:", file);
}

/* ============================================================
   1️⃣ Limpeza de ficheiros redundantes
   ============================================================ */

remove("frontend/src/App.css");
remove("frontend/src/index.css");
remove("frontend/src/assets");
remove("frontend/public/vite.svg");

/* ============================================================
   2️⃣ Estrutura final de pastas
   ============================================================ */

write(
  "frontend/STRUCTURE.txt",
  `
Estrutura final da aplicação:

frontend/
  src/
    components/
    pages/
    services/
    hooks/
    context/
    router/
    styles/
  public/
    icons/
    manifest.json
    service-worker.js
  dist/ (após build)
`
);

/* ============================================================
   3️⃣ Ajustes finais de performance
   ============================================================ */

write(
  "frontend/src/styles/global.css",
  `
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  background-color: var(--bg);
  color: var(--text);
  font-family: Arial, sans-serif;
}
`
);

/* ============================================================
   4️⃣ Remoção de warnings comuns do React/Vite
   ============================================================ */

write(
  "frontend/src/main.jsx",
  `
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`
);

/* ============================================================
   5️⃣ Ajuste final do index.html
   ============================================================ */

write(
  "frontend/index.html",
  `
<!DOCTYPE html>
<html lang="pt">
  <head>
    <meta charset="UTF-8" />
    <link rel="manifest" href="/manifest.json" />
    <meta name="theme-color" content="#007bff" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>CondoManager AI</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
`
);

/* ============================================================
   FINAL
   ============================================================ */

console.log("\\n🎯 Bloco 17 concluído com sucesso!");
console.log("Otimização final, limpeza e estrutura definitiva aplicadas.");
