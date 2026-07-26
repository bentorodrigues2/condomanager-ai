import fs from "fs";
import path from "path";

// Caminhos principais
const rootSrc = path.resolve("src");
const frontendSrc = path.resolve("frontend/src");
const appPath = path.resolve("frontend/src/App.jsx");
const mainPath = path.resolve("frontend/src/main.jsx");
const indexPath = path.resolve("frontend/index.html");

// 1️⃣ Remover diretório duplicado src/components/
const duplicatedComponents = path.join(rootSrc, "components");
if (fs.existsSync(duplicatedComponents)) {
  console.log("⚠️ Removendo diretório duplicado: src/components/");
  fs.rmSync(duplicatedComponents, { recursive: true, force: true });
} else {
  console.log("✔ Nenhum diretório duplicado encontrado em src/components/");
}

// 2️⃣ Limpar App.jsx
if (fs.existsSync(appPath)) {
  let appContent = fs.readFileSync(appPath, "utf8");

  // Remover imports duplicados
  appContent = appContent.replace(/import\s+Dashboard[\s\S]*?;/g, "");
  appContent = appContent.replace(/import\s+Login[\s\S]*?;/g, "");

  // Inserir apenas uma vez
  const cleanImports = `
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
`;

  appContent = cleanImports + "\n" + appContent;

  // Remover rotas duplicadas
  appContent = appContent.replace(/<Route path="\/login"[\s\S]*?\/>/g, "");
  appContent = appContent.replace(/<Route path="\/dashboard"[\s\S]*?\/>/g, "");

  // Inserir rotas apenas uma vez
  appContent = appContent.replace(
    "</Routes>",
    `
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>`
  );

  fs.writeFileSync(appPath, appContent);
  console.log("✔ App.jsx corrigido");
} else {
  console.log("❌ ERRO: App.jsx não encontrado");
}

// 3️⃣ Limpar main.jsx
if (fs.existsSync(mainPath)) {
  let mainContent = fs.readFileSync(mainPath, "utf8");

  // Remover imports duplicados
  mainContent = mainContent.replace(/import\s+Dashboard[\s\S]*?;/g, "");
  mainContent = mainContent.replace(/import\s+Login[\s\S]*?;/g, "");

  fs.writeFileSync(mainPath, mainContent);
  console.log("✔ main.jsx corrigido");
} else {
  console.log("❌ main.jsx não encontrado");
}

// 4️⃣ Limpar index.html
if (fs.existsSync(indexPath)) {
  let indexContent = fs.readFileSync(indexPath, "utf8");

  // Remover referências duplicadas a scripts
  indexContent = indexContent.replace(/Dashboard\.jsx/g, "");
  indexContent = indexContent.replace(/Login\.jsx/g, "");

  fs.writeFileSync(indexPath, indexContent);
  console.log("✔ index.html corrigido");
} else {
  console.log("❌ index.html não encontrado");
}

// 5️⃣ Verificar se os ficheiros corretos existem
const loginPath = path.join(frontendSrc, "components", "Login.jsx");
const dashPath = path.join(frontendSrc, "components", "Dashboard.jsx");

console.log(fs.existsSync(loginPath) ? "✔ Login.jsx OK" : "❌ Login.jsx não encontrado");
console.log(fs.existsSync(dashPath) ? "✔ Dashboard.jsx OK" : "❌ Dashboard.jsx não encontrado");

console.log("\n🎉 Estrutura corrigida com sucesso!");
console.log("Agora faz: git add . && git commit -m \"Fix total\" && git push");
