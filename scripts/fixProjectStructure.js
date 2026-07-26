import fs from "fs";
import path from "path";

// Caminhos principais
const rootSrc = path.resolve("src/components");
const frontendSrc = path.resolve("frontend/src/components");
const appPath = path.resolve("frontend/src/App.jsx");

// 1️⃣ Remover ficheiros duplicados fora do frontend/
if (fs.existsSync(rootSrc)) {
  console.log("⚠️ Removendo diretório duplicado: src/components/");
  fs.rmSync(rootSrc, { recursive: true, force: true });
} else {
  console.log("✔ Nenhum diretório duplicado encontrado em src/components/");
}

// 2️⃣ Limpar App.jsx (remover imports duplicados)
if (fs.existsSync(appPath)) {
  let appContent = fs.readFileSync(appPath, "utf8");

  // Remover imports duplicados de Dashboard e Login
  appContent = appContent.replace(
    /import\s+Dashboard\s+from\s+"\.\/components\/Dashboard";/g,
    ""
  );
  appContent = appContent.replace(
    /import\s+Login\s+from\s+"\.\/components\/Login";/g,
    ""
  );

  // Inserir apenas uma vez no topo
  const cleanImports = `
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
`;

  appContent = cleanImports + "\n" + appContent;

  // Remover rotas duplicadas
  appContent = appContent.replace(
    /<Route path="\/login" element={<Login \/>} \/>/g,
    ""
  );
  appContent = appContent.replace(
    /<Route path="\/dashboard" element={<Dashboard \/>} \/>/g,
    ""
  );

  // Inserir rotas apenas uma vez
  appContent = appContent.replace(
    "</Routes>",
    `
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>`
  );

  fs.writeFileSync(appPath, appContent);
  console.log("✔ App.jsx corrigido com sucesso");
} else {
  console.log("❌ ERRO: App.jsx não encontrado em frontend/src/");
}

// 3️⃣ Verificar se Login.jsx e Dashboard.jsx existem no sítio correto
const loginPath = path.join(frontendSrc, "Login.jsx");
const dashPath = path.join(frontendSrc, "Dashboard.jsx");

if (!fs.existsSync(loginPath)) {
  console.log("❌ Login.jsx não encontrado em frontend/src/components/");
} else {
  console.log("✔ Login.jsx OK");
}

if (!fs.existsSync(dashPath)) {
  console.log("❌ Dashboard.jsx não encontrado em frontend/src/components/");
} else {
  console.log("✔ Dashboard.jsx OK");
}

console.log("\n🎉 Estrutura corrigida com sucesso!");
console.log("Agora faz: git add . && git commit -m \"Fix estrutura\" && git push");
