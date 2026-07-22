const fs = require("fs");
const path = require("path");

const projectRoot = __dirname;

const TARGET_PATTERNS = [
  "export default function App",
  "<video",
  ".mp4",
  "createRoot",
  "ReactDOM.render",
];

const TARGET_FILES = [
  "package.json",
  "vite.config.js",
  "vercel.json",
  "public/index.html",
  "src/main.jsx",
  "src/index.jsx",
  "src/App.jsx",
  "src/router/index.jsx",
  "src/router.js",
  "src/ui/layout/Layout.jsx",
];

function safeRead(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch {
    return null;
  }
}

function scanForPatterns(dir) {
  const results = [];

  function walk(current) {
    const items = fs.readdirSync(current);

    for (const item of items) {
      const fullPath = path.join(current, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        walk(fullPath);
      } else {
        const content = safeRead(fullPath);
        if (!content) continue;

        for (const pattern of TARGET_PATTERNS) {
          if (content.includes(pattern)) {
            results.push({ file: fullPath, pattern });
            break;
          }
        }
      }
    }
  }

  walk(dir);
  return results;
}

console.log("📦 A recolher ficheiros críticos do projeto...\n");

const output = {};

for (const file of TARGET_FILES) {
  const fullPath = path.join(projectRoot, file);
  const content = safeRead(fullPath);
  if (content) {
    output[file] = content;
  }
}

const patternMatches = scanForPatterns(projectRoot);

console.log("📄 Ficheiros encontrados:\n");

for (const [file, content] of Object.entries(output)) {
  console.log(`==================== ${file} ====================\n`);
  console.log(content);
  console.log("\n");
}

console.log("🔍 Ficheiros adicionais com padrões críticos:\n");

for (const match of patternMatches) {
  console.log(`➡ ${match.file}  (padrão: ${match.pattern})`);
}

console.log("\n🏁 Concluído. Copia o output completo e envia-me aqui.");
