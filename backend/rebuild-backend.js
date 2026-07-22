const fs = require("fs");
const path = require("path");

const backendPath = path.join(__dirname);
const packageJsonPath = path.join(backendPath, "package.json");

// Pacotes que SEMPRE devem existir
const baseDeps = {
  express: "^4.18.2",
  cors: "^2.8.5",
  dotenv: "^16.4.5",
  jsonwebtoken: "^9.0.2",
  "node-fetch": "^2.7.0",
  pdfkit: "^0.13.0"
};

// Função para detetar dependências usadas no código
function scanDir(dir) {
  const files = fs.readdirSync(dir);
  let requires = [];

  for (const file of files) {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);

    if (stat.isDirectory()) {
      requires = requires.concat(scanDir(full));
    } else if (file.endsWith(".js") || file.endsWith(".cjs")) {
      const content = fs.readFileSync(full, "utf8");
      const regex = /require\(["'`](.*?)["'`]\)/g;
      let match;

      while ((match = regex.exec(content)) !== null) {
        const pkg = match[1];
        if (
          !pkg.startsWith("./") &&
          !pkg.startsWith("../") &&
          !pkg.startsWith("/") &&
          !pkg.includes(".")
        ) {
          requires.push(pkg);
        }
      }
    }
  }

  return requires;
}

console.log("🔍 A analisar backend...\n");

// 1. Detetar dependências usadas
const usedDeps = scanDir(backendPath);

// 2. Remover duplicados
const uniqueDeps = [...new Set(usedDeps)];

// 3. Construir package.json final
const finalDeps = { ...baseDeps };

uniqueDeps.forEach((dep) => {
  if (!finalDeps[dep]) {
    finalDeps[dep] = "*"; // placeholder — npm install vai resolver
  }
});

// 4. Criar novo package.json
const newPackageJson = {
  name: "backend",
  version: "1.0.0",
  main: "server.js",
  type: "commonjs",
  scripts: {
    start: "node server.js"
  },
  dependencies: finalDeps
};

fs.writeFileSync(packageJsonPath, JSON.stringify(newPackageJson, null, 2));

console.log("📦 Novo package.json criado com sucesso!");
console.log("📦 Dependências detectadas:", uniqueDeps);
console.log("\n🏁 Agora corre: npm install");
