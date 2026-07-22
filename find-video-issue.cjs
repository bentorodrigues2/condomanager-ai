const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "src");

const PATTERNS = [
  "supabase.storage",
  "getPublicUrl",
  "download(",
  ".mp4",
  "<video",
  "blob:",
  "URL.createObjectURL",
  "video",
];

function searchInFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const hits = PATTERNS.filter((p) => content.includes(p));
  if (hits.length > 0) {
    return { file: filePath, hits };
  }
  return null;
}

function walk(dir) {
  const results = [];
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      results.push(...walk(fullPath));
    } else if (stat.isFile()) {
      const res = searchInFile(fullPath);
      if (res) results.push(res);
    }
  }

  return results;
}

console.log("🔍 A procurar origem do vídeo no Supabase...");
const findings = walk(ROOT);

if (findings.length === 0) {
  console.log("✔ Nenhum ficheiro suspeito encontrado.");
} else {
  console.log("⚠ Ficheiros suspeitos encontrados:\n");
  findings.forEach((f) => {
    console.log("📄 " + f.file);
    console.log("   → padrões encontrados: " + f.hits.join(", "));
    console.log("");
  });
}

console.log("🏁 Diagnóstico concluído.");
