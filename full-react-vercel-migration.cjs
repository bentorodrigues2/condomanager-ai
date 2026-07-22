// full-react-vercel-migration.cjs
// Move o projeto para um caminho sem espaços, cria React/Vite, configura Vercel e faz deploy automático

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

console.log("🚀 MIGRAÇÃO COMPLETA + REACT/VITE + VERCEL\n");

// Caminho atual
const oldPath = path.resolve(__dirname);

// Caminho novo sem espaços
const newBase = "C:\\condomanager-ai";

// 1️⃣ Criar pasta nova sem espaços
if (!fs.existsSync(newBase)) {
  fs.mkdirSync(newBase);
  console.log("📁 Pasta C:\\condomanager-ai criada.");
}

// 2️⃣ Mover projeto para o novo caminho
console.log("📦 A mover projeto para C:\\condomanager-ai...");
execSync(`xcopy "${oldPath}" "${newBase}" /E /H /C /I`, { stdio: "inherit" });

console.log("✔ Projeto movido com sucesso!\n");

// 3️⃣ Criar pasta frontend no novo caminho
const frontendDir = path.join(newBase, "frontend");
if (!fs.existsSync(frontendDir)) {
  fs.mkdirSync(frontendDir);
  console.log("📁 Pasta frontend criada.");
}

// 4️⃣ Criar projeto React/Vite sem interação
console.log("⚙️ A criar projeto React/Vite sem prompts...");
execSync(`npm create vite@latest "${frontendDir}" -- --template react --yes --no-interactive`, {
  stdio: "inherit"
});

// 5️⃣ Instalar dependências
console.log("\n📦 A instalar dependências...");
execSync(`npm install`, { cwd: frontendDir, stdio: "inherit" });

// 6️⃣ Corrigir package.json
const pkgPath = path.join(frontendDir, "package.json");
const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
pkg.scripts = {
  dev: "vite",
  build: "vite build",
  preview: "vite preview"
};
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
console.log("🧩 Scripts de build adicionados ao package.json.");

// 7️⃣ Criar vercel.json
const vercelConfig = {
  version: 2,
  builds: [{ src: "frontend/package.json", use: "@vercel/static-build" }],
  routes: [{ src: "/(.*)", dest: "/frontend/index.html" }],
  buildCommand: "npm run build",
  outputDirectory: "frontend/dist"
};
fs.writeFileSync(path.join(newBase, "vercel.json"), JSON.stringify(vercelConfig, null, 2));
console.log("✅ vercel.json criado.");

// 8️⃣ Commit + Push
console.log("\n📤 A enviar alterações para o GitHub...");
execSync(`git add .`, { cwd: newBase, stdio: "inherit" });
execSync(`git commit -m "migration: react/vite frontend + vercel setup"`, { cwd: newBase, stdio: "inherit" });
execSync(`git push`, { cwd: newBase, stdio: "inherit" });

console.log("\n🎉 MIGRAÇÃO COMPLETA!");
console.log("O Vercel vai iniciar o deploy automaticamente.");
console.log("Abre: https://vercel.com/bento-rodrigues2/condomanager-ai/deployments");
console.log("E depois: https://bentorodrigues2.vercel.app\n");
