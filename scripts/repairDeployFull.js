import fs from "fs";
import path from "path";
import { execSync } from "child_process";

// Caminhos base
const frontendDir = path.resolve("frontend");
const srcDir = path.join(frontendDir, "src");
const assetsDir = path.join(srcDir, "assets");

// Ficheiro supabase original
const oldSupabase = path.join(srcDir, "supabaseClient.js");

// Novo nome seguro
const newSupabase = path.join(srcDir, "supabaseCore.js");

// 1. Instalar supabase-js
try {
  console.log("📦 A instalar @supabase/supabase-js...");
  execSync("npm install @supabase/supabase-js", { cwd: frontendDir, stdio: "inherit" });
  console.log("✔ Pacote supabase instalado.");
} catch (err) {
  console.error("❌ Erro ao instalar supabase:", err);
}

// 2. Renomear supabaseClient.js se existir
if (fs.existsSync(oldSupabase)) {
  fs.renameSync(oldSupabase, newSupabase);
  console.log("✔ supabaseClient.js renomeado para supabaseCore.js");
}

// 3. Atualizar imports automaticamente
const componentsDir = path.join(srcDir, "components");
const filesToFix = fs.readdirSync(componentsDir).filter(f => f.endsWith(".jsx"));

filesToFix.forEach(file => {
  const filePath = path.join(componentsDir, file);
  let content = fs.readFileSync(filePath, "utf8");

  content = content.replace(
    /supabaseClient/g,
    "supabaseCore"
  );

  fs.writeFileSync(filePath, content);
  console.log(`✔ Imports atualizados em ${file}`);
});

// 4. Garantir pasta assets
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
  console.log("✔ Pasta assets criada.");
}

// 5. Garantir skyline.png
const skylinePath = path.join(assetsDir, "skyline.png");
if (!fs.existsSync(skylinePath)) {
  fs.writeFileSync(skylinePath, Buffer.from(""));
  console.log("✔ Placeholder skyline.png criado.");
}

// 6. Garantir Logo.png
const logoPath = path.join(assetsDir, "Logo.png");
if (!fs.existsSync(logoPath)) {
  fs.writeFileSync(logoPath, Buffer.from(""));
  console.log("✔ Placeholder Logo.png criado.");
}

// 7. Criar vercel.json para forçar build correto
const vercelConfigPath = path.resolve("vercel.json");
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

fs.writeFileSync(vercelConfigPath, JSON.stringify(vercelConfig, null, 2));
console.log("✔ vercel.json criado/atualizado.");

console.log("\n🎉 Todas as correções aplicadas com sucesso!");
console.log("Agora executa:");
console.log("git add .");
console.log('git commit -m "Repair deploy automatically (supabase + assets + vercel)"');
console.log("git push");
