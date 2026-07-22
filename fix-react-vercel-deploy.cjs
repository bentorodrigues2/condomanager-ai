// fix-react-vercel-deploy.cjs
// Cria projeto React/Vite funcional e força deploy automático no Vercel

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

console.log("🚀 Iniciando correção completa do frontend React/Vite...\n");

const projectRoot = path.resolve(__dirname);
const frontendDir = path.join(projectRoot, "frontend");

// 1️⃣ Criar pasta frontend se não existir
if (!fs.existsSync(frontendDir)) {
  fs.mkdirSync(frontendDir);
  console.log("📁 Pasta 'frontend' criada.");
}

// 2️⃣ Criar projeto React/Vite
console.log("⚙️ A criar projeto React/Vite...");
execSync(`npm create vite@latest "${frontendDir}" -- --template react`, { stdio: "inherit" });

// 3️⃣ Instalar dependências
console.log("\n📦 A instalar dependências...");
execSync(`npm install`, { cwd: frontendDir, stdio: "inherit" });

// 4️⃣ Corrigir package.json
const pkgPath = path.join(frontendDir, "package.json");
const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
pkg.scripts = {
  dev: "vite",
  build: "vite build",
  preview: "vite preview"
};
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
console.log("🧩 Scripts de build adicionados ao package.json.");

// 5️⃣ Criar vercel.json
const vercelConfig = {
  version: 2,
  builds: [{ src: "frontend/package.json", use: "@vercel/static-build" }],
  routes: [{ src: "/(.*)", dest: "/frontend/index.html" }],
  buildCommand: "npm run build",
  outputDirectory: "frontend/dist"
};
fs.writeFileSync(path.join(projectRoot, "vercel.json"), JSON.stringify(vercelConfig, null, 2));
console.log("✅ vercel.json criado com configuração correta.");

// 6️⃣ Commit e push automático
console.log("\n📤 A enviar alterações para o GitHub...");
execSync(`git add .`, { cwd: projectRoot, stdio: "inherit" });
execSync(`git commit -m "fix: React/Vite frontend setup"`, { cwd: projectRoot, stdio: "inherit" });
execSync(`git push`, { cwd: projectRoot, stdio: "inherit" });

console.log("\n🎉 Frontend React/Vite criado e enviado para o GitHub!");
console.log("O Vercel vai iniciar o deploy automaticamente.");
console.log("Abre: https://vercel.com/bento-rodrigues2/condomanager-ai/deployments");
console.log("E depois: https://bentorodrigues2.vercel.app\n");
