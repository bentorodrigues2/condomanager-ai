import fs from "fs";
import path from "path";

const ROOT = path.resolve("src");

// 1. Remover import quebrado do router.jsx
function fixRouterCrud() {
  const routerPath = path.join(ROOT, "router.jsx");
  if (!fs.existsSync(routerPath)) {
    console.log("⚠️ router.jsx não encontrado.");
    return;
  }

  let content = fs.readFileSync(routerPath, "utf8");

  // Remover import do CRUD
  content = content.replace(/import\s+.*?["']\.\/pages\/crud["'];?\n?/g, "");

  // Remover rota que usa CRUD
  content = content.replace(/<Route\s+path="\/crud".*?\/>\n?/g, "");

  fs.writeFileSync(routerPath, content);
  console.log("✔ CRUD removido automaticamente do router.jsx");
}

// 2. Revalidar imports
function revalidate() {
  console.log("\n🔍 Revalidando imports…");

  const exts = [".jsx", ".tsx", ".js", ".ts"];

  function listFiles(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    const files = [];
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        files.push(...listFiles(full));
      } else if (exts.some(ext => entry.name.endsWith(ext))) {
        files.push(full);
      }
    }
    return files;
  }

  function parseImports(content) {
    const regex = /import\s+[^'"]+\s+from\s+["']([^"']+)["']/g;
    const results = [];
    let match;
    while ((match = regex.exec(content)) !== null) {
      results.push(match[1]);
    }
    return results;
  }

  const files = listFiles(ROOT);
  const problems = [];

  for (const file of files) {
    const relFile = path.relative(ROOT, file);
    const content = fs.readFileSync(file, "utf8");
    const imports = parseImports(content);

    for (const imp of imports) {
      if (!imp.startsWith("./") && !imp.startsWith("../")) continue;

      const base = path.resolve(path.dirname(file), imp);
      const candidates = [
        base,
        ...exts.map(ext => base + ext),
        path.join(base, "index.jsx"),
        path.join(base, "index.tsx"),
        path.join(base, "index.js"),
        path.join(base, "index.ts"),
      ];

      const exists = candidates.some(c => fs.existsSync(c));

      if (!exists) {
        problems.push({
          file: relFile,
          import: imp,
        });
      }
    }
  }

  if (problems.length === 0) {
    console.log("✅ Todos os imports estão válidos.");
  } else {
    console.log("❌ Ainda existem imports quebrados:\n");
    for (const p of problems) {
      console.log(`- ${p.file} → "${p.import}" não resolve`);
    }
  }
}

console.log("🔧 A aplicar correções automáticas…\n");

fixRouterCrud();
revalidate();

console.log("\n🏁 Correções automáticas concluídas.");
