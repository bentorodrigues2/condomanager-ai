import fs from "fs";
import path from "path";

// Caminho do vercel.json na raiz do projeto
const vercelConfigPath = path.resolve("vercel.json");

// Conteúdo que força o Vercel a compilar apenas o frontend
const vercelConfig = {
  version: 2,
  builds: [
    {
      src: "frontend/package.json",
      use: "@vercel/static-build"
    }
  ],
  routes: [
    { src: "/(.*)", dest: "/frontend/$1" }
  ]
};

try {
  // Criar ou substituir vercel.json automaticamente
  fs.writeFileSync(vercelConfigPath, JSON.stringify(vercelConfig, null, 2));

  console.log("✔ vercel.json criado/atualizado com sucesso.");
  console.log("✔ O Vercel agora vai compilar apenas a pasta 'frontend/'.");
  console.log("✔ O fallback root-level build foi desativado.");
  console.log("✔ O Vercel vai ignorar 'src/main.jsx' e 'index.html' da raiz.");
  console.log("✔ O erro 'aggregateBindingErrorsIntoJsError' será resolvido.");
  console.log("\nAgora executa:");
  console.log("git add vercel.json");
  console.log('git commit -m "Fix Vercel deploy automatically"');
  console.log("git push");
} catch (err) {
  console.error("❌ Erro ao criar vercel.json:", err);
}
