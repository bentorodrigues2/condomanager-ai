// fix_vercel_vite_root.mjs
// Corrige estrutura e build para Vite + Vercel
// Corre com: node fix_vercel_vite_root.mjs

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("🔍 A corrigir estrutura e build para Vite + Vercel...");

// 1️⃣ Corrigir vite.config.js
const viteConfigPath = path.join(__dirname, "frontend", "vite.config.js");
if (fs.existsSync(viteConfigPath)) {
  let viteConfig = fs.readFileSync(viteConfigPath, "utf8");

  viteConfig = viteConfig.replace(
    /defineConfig\(\{/,
    `defineConfig({ root: '.', base: './', build: { outDir: 'dist' },`
  );

  fs.writeFileSync(viteConfigPath, viteConfig, "utf8");
  console.log("✔ vite.config.js ajustado → root '.', base './', outDir 'dist'");
}

// 2️⃣ Corrigir vercel.json
const vercelConfig = {
  version: 2,
  buildCommand: "npm run build",
  outputDirectory: "frontend/dist",
  installCommand: "npm install",
  rewrites: [{ source: "/(.*)", destination: "/" }],
};

fs.writeFileSync(path.join(__dirname, "vercel.json"), JSON.stringify(vercelConfig, null, 2), "utf8");
console.log("✔ vercel.json criado/corrigido → outputDirectory 'frontend/dist'");

// 3️⃣ Corrigir package.json
const pkgPath = path.join(__dirname, "package.json");
if (fs.existsSync(pkgPath)) {
  let pkg = fs.readFileSync(pkgPath, "utf8");
  pkg = pkg.replace(/"build":\s*"vite build.*"/, `"build": "vite build --config frontend/vite.config.js"`);
  fs.writeFileSync(pkgPath, pkg, "utf8");
  console.log("✔ package.json ajustado → build usa vite.config.js do frontend");
}

console.log("\n🎉 Concluído! Estrutura e build corrigidos.");
console.log("👉 Faz agora: git add . && git commit -m \"fix: corrigir estrutura vite vercel\" && git push");
console.log("👉 Depois disso, faz redeploy no Vercel.");
