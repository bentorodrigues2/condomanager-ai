const fs = require("fs");
const path = require("path");

const vercelFile = path.join(__dirname, "vercel.json");

console.log("🔧 A corrigir rootDirectory do Vercel...");

const correctConfig = {
  version: 2,
  rootDirectory: ".",
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

console.log("✔ vercel.json atualizado com rootDirectory");
console.log("🏁 Agora faz git add, commit e push.");
