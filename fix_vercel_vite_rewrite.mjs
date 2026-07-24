// fix_vercel_vite_rewrite.mjs
// Corrige configuração de roteamento e build para Vite + Vercel
// Corre com: node fix_vercel_vite_rewrite.mjs

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("🔍 A corrigir configuração de roteamento e build para Vercel...");

// 1️⃣ Criar ou corrigir vercel.json
const vercelConfigPath = path.join(__dirname, "vercel.json");
const vercelConfig = {
  version: 2,
  buildCommand: "npm run build",
  outputDirectory: "dist",
  installCommand: "npm install",
  rewrites: [{ source: "/(.*)", destination: "/" }],
};

fs.writeFileSync(vercelConfigPath, JSON.stringify(vercelConfig, null, 2), "utf8");
console.log("✔ vercel.json criado/corrigido");

// 2️⃣ Corrigir vite.config.js
const viteConfigPath = path.join(__dirname, "vite.config.js");
if (fs.existsSync(viteConfigPath)) {
  let viteConfig = fs.readFileSync(viteConfigPath, "utf8");

  if (!viteConfig.includes("base: './'")) {
    viteConfig = viteConfig.replace(
      /defineConfig\(\{/,
      `defineConfig({ base: './', build: { outDir: 'dist' },`
    );
    fs.writeFileSync(viteConfigPath, viteConfig, "utf8");
    console.log("✔ vite.config.js ajustado → base './', outDir 'dist'");
  }
}

// 3️⃣ Corrigir package.json
const pkgPath = path.join(__dirname, "package.json");
if (fs.existsSync(pkgPath)) {
  let pkg = fs.readFileSync(pkgPath, "utf8");
  pkg = pkg.replace(/"build":\s*"vite build.*"/, `"build": "vite build --outDir dist"`);
  fs.writeFileSync(pkgPath, pkg, "utf8");
  console.log("✔ package.json ajustado → build para 'dist'");
}

console.log("\n🎉 Concluído! Configuração de build e roteamento corrigida.");
console.log("👉 Faz agora: git add . && git commit -m \"fix: corrigir roteamento vite vercel\" && git push");
console.log("👉 Depois disso, faz redeploy no Vercel.");
