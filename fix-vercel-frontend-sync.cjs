// fix-vercel-frontend-sync.cjs
// Sincroniza automaticamente a pasta frontend com o repositório GitHub usado pelo Vercel

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

console.log("🚀 Iniciando sincronização automática do frontend com o GitHub...\n");

// Caminhos
const localProject = path.resolve(__dirname);
const githubClone = path.resolve(__dirname, "..", "condomanager-ai-github-clone");
const frontendLocal = path.join(localProject, "frontend");
const frontendClone = path.join(githubClone, "frontend");

// 1️⃣ Clonar o repositório GitHub
console.log("📥 A clonar repositório GitHub...");
execSync(`git clone https://github.com/bentorodrigues2/condomanager-ai.git "${githubClone}"`, { stdio: "inherit" });

// 2️⃣ Copiar a pasta frontend real para dentro do clone
console.log("\n📁 A copiar pasta frontend real para o clone...");
fs.rmSync(frontendClone, { recursive: true, force: true });
fs.cpSync(frontendLocal, frontendClone, { recursive: true });

console.log("✔ Pasta frontend copiada com sucesso!");

// 3️⃣ Commit + Push
console.log("\n📤 A adicionar ficheiros ao Git...");
execSync(`git add .`, { cwd: githubClone, stdio: "inherit" });

console.log("📝 A criar commit...");
execSync(`git commit -m "sync: add real frontend"`, { cwd: githubClone, stdio: "inherit" });

console.log("⬆ A enviar para o GitHub...");
execSync(`git push`, { cwd: githubClone, stdio: "inherit" });

console.log("\n🎉 Sincronização concluída!");
console.log("O Vercel vai iniciar o deploy automaticamente.");
console.log("Abre: https://vercel.com/bento-rodrigues2/condomanager-ai/deployments");
console.log("E depois: https://bentorodrigues2.vercel.app\n");
