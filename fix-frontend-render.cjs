// fix-frontend-render.cjs
// Script para verificar e corrigir o frontend Condomanager-AI (React/Vite)

const fs = require("fs");
const path = require("path");

const frontendPath = path.join(__dirname, "frontend");
const srcPath = path.join(frontendPath, "src");

console.log("🔍 A verificar estrutura do frontend...\n");

// 1️⃣ Corrigir vite.config.js
const viteConfigPath = path.join(frontendPath, "vite.config.js");
if (fs.existsSync(viteConfigPath)) {
  let viteContent = fs.readFileSync(viteConfigPath, "utf8");
  if (!viteContent.includes("defineConfig")) {
    viteContent = `
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '',
  plugins: [react()],
});
`;
    fs.writeFileSync(viteConfigPath, viteContent, "utf8");
    console.log("✅ Corrigido vite.config.js");
  } else {
    console.log("✔ vite.config.js já está configurado corretamente");
  }
} else {
  fs.writeFileSync(
    viteConfigPath,
    `
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '',
  plugins: [react()],
});
`,
    "utf8"
  );
  console.log("✅ Criado vite.config.js");
}

// 2️⃣ Corrigir src/main.tsx
const mainPath = path.join(srcPath, "main.tsx");
if (fs.existsSync(mainPath)) {
  let mainContent = fs.readFileSync(mainPath, "utf8");
  if (!mainContent.includes("ReactDOM.createRoot")) {
    mainContent = `
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`;
    fs.writeFileSync(mainPath, mainContent, "utf8");
    console.log("✅ Corrigido main.tsx");
  } else {
    console.log("✔ main.tsx já está correto");
  }
} else {
  fs.writeFileSync(
    mainPath,
    `
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`,
    "utf8"
  );
  console.log("✅ Criado main.tsx");
}

// 3️⃣ Corrigir src/App.tsx
const appPath = path.join(srcPath, "App.tsx");
let appContent = `
import React from "react";
import { AppRouter } from "./AppRouter";

export default function App() {
  return (
    <div style={{ fontFamily: 'sans-serif', textAlign: 'center', padding: '20px' }}>
      <h1>CondoManager AI</h1>
      <AppRouter />
    </div>
  );
}
`;
fs.writeFileSync(appPath, appContent, "utf8");
console.log("✅ Corrigido App.tsx");

// 4️⃣ Corrigir src/AppRouter.tsx
const routerPath = path.join(srcPath, "AppRouter.tsx");
let routerContent = `
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<h2>Dashboard</h2>} />
        <Route path="/dashboard" element={<h2>Dashboard</h2>} />
      </Routes>
    </BrowserRouter>
  );
}
`;
fs.writeFileSync(routerPath, routerContent, "utf8");
console.log("✅ Corrigido AppRouter.tsx");

console.log("\n🎉 Correção concluída!");
console.log("Agora executa:");
console.log("   git add .");
console.log('   git commit -m "fix: frontend render"');
console.log("   git push");
console.log("\nDepois: Vercel → Deploy latest commit\n");
