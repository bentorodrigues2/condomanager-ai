const fs = require("fs");
const path = require("path");

const backendPath = path.join(__dirname);
const packageJsonPath = path.join(backendPath, "package.json");

const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
const declaredDeps = Object.keys(packageJson.dependencies || {});

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

console.log("🔍 A analisar dependências usadas no backend...\n");

const usedDeps = scanDir(backendPath);
const missing = usedDeps.filter((d) => !declaredDeps.includes(d));

console.log("📦 Dependências usadas no código:", usedDeps);
console.log("\n❌ Dependências em falta:", missing);

console.log("\n🏁 Concluído.");
