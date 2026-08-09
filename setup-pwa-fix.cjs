#!/usr/bin/env node

/**
 * Fix PWA build for Vercel
 * - Ensures manifest.json is included
 * - Ensures sw.js is included
 * - Fixes vite.config.js to copy public/
 * - Fixes index.html to reference manifest
 */

const fs = require("fs");
const path = require("path");

function updateViteConfig() {
  const file = "vite.config.js";
  if (!fs.existsSync(file)) {
    console.log("❌ vite.config.js não encontrado.");
    return;
  }

  let content = fs.readFileSync(file, "utf8");

  if (!content.includes("copyPublicDir")) {
    content = content.replace(
      /build:\s*\{/,
      `build: {
    copyPublicDir: true,`
    );

    fs.writeFileSync(file, content);
    console.log("✅ vite.config.js atualizado (copyPublicDir: true)");
  } else {
    console.log("⏭️ vite.config.js já tem copyPublicDir");
  }
}

function ensureManifestLink() {
  const file = "index.html";
  if (!fs.existsSync(file)) {
    console.log("❌ index.html não encontrado.");
    return;
  }

  let content = fs.readFileSync(file, "utf8");

  if (!content.includes('rel="manifest"')) {
    content = content.replace(
      "</head>",
      `  <link rel="manifest" href="/manifest.json" />\n</head>`
    );

    fs.writeFileSync(file, content);
    console.log("✅ index.html atualizado com manifest.json");
  } else {
    console.log("⏭️ index.html já tem manifest.json");
  }
}

function checkPublicFiles() {
  const manifest = "public/manifest.json";
  const sw = "public/sw.js";

  if (!fs.existsSync(manifest)) {
    console.log("❌ public/manifest.json não existe!");
  } else {
    console.log("✅ manifest.json encontrado");
  }

  if (!fs.existsSync(sw)) {
    console.log("❌ public/sw.js não existe!");
  } else {
    console.log("✅ sw.js encontrado");
  }
}

console.log("🚀 A corrigir PWA para Vercel...");

updateViteConfig();
ensureManifestLink();
checkPublicFiles();

console.log("🎉 Módulo 16 concluído!");
console.log("👉 Agora faz deploy no Vercel e testa novamente /sw.js e o manifest.");
