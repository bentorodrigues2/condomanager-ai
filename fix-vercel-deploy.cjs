const fs = require("fs");
const path = require("path");

const vercelFile = path.join(__dirname, "vercel.json");

console.log("🔧 A corrigir configuração do Vercel...");

// Apagar vercel.json antigo
if (fs.existsSync(vercelFile)) {
  fs.unlinkSync(vercelFile);
  console.log("✔ vercel.json antigo removido");
}

// Criar vercel.json correto
const correctConfig = {
  version: 2,
  builds: [
    {
      src: "package.json",
      use: "@vercel/static-build"
    }
  ],
  buildCommand: "npm run build",
  outputDirectory: "dist"
};

fs.writeFileSync(vercelFile, JSON.stringify(correctConfig, null, 2));

console.log("✔ vercel.json novo criado");
console.log("🏁 Correção concluída. Agora faz git add, commit e push.");
