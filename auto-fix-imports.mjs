import fs from "fs";
import path from "path";

const ROOT = path.resolve("src");
const exts = [".jsx", ".tsx", ".js", ".ts"];

// 1. Carregar a lista de imports quebrados gerada pelo script anterior
const broken = [
  { file: "App.jsx", import: "./pages/Dashboard.jsx" },
  { file: "layout/Layout.tsx", import: "../components/Sidebar" },
  { file: "router/AppRouter.tsx", import: "../pages/Arrecadacoes" },
  { file: "router/AppRouter.tsx", import: "../pages/ArrecadacaoForm" },
  // todos os services
  { file: "services/assembleias.ts", import: "../supabase/supabaseClient" },
  { file: "services/auditoria.ts", import: "../supabase/supabaseClient" },
  { file: "services/condominios.ts", import: "../supabase/supabaseClient" },
  { file: "services/condominos.ts", import: "../supabase/supabaseClient" },
  { file: "services/documentos.ts", import: "../supabase/supabaseClient" },
  { file: "services/fornecedores.ts", import: "../supabase/supabaseClient" },
  { file: "services/fracoes.ts", import: "../supabase/supabaseClient" },
  { file: "services/incidencias.ts", import: "../supabase/supabaseClient" },
  { file: "services/pagamentos.ts", import: "../supabase/supabaseClient" },
  { file: "services/tarefas.ts", import: "../supabase/supabaseClient" }
];

// 2. Função para procurar ficheiro real no projeto
function findFile(name) {
  const stack = [ROOT];
  while (stack.length) {
    const dir = stack.pop();
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        stack.push(full);
      } else {
        const base = path.parse(e.name).name;
        if (base.toLowerCase() === name.toLowerCase()) {
          return full;
        }
      }
    }
  }
  return null;
}

// 3. Corrigir automaticamente
console.log("🔧 A corrigir imports automaticamente...\n");

for (const p of broken) {
  const filePath = path.join(ROOT, p.file);
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️ Ficheiro não encontrado: ${p.file}`);
    continue;
  }

  const content = fs.readFileSync(filePath, "utf8");

  const importName = p.import.split("/").pop();
  const found = findFile(importName);

  if (!found) {
    console.log(`❌ Não encontrei ficheiro correspondente a ${p.import}`);
    continue;
  }

  const rel = path.relative(path.dirname(filePath), found).replace(/\\/g, "/");
  const newImport = rel.startsWith(".") ? rel : "./" + rel;

  const newContent = content.replace(p.import, newImport);
  fs.writeFileSync(filePath, newContent);

  console.log(`✔ Corrigido: ${p.file}`);
  console.log(`    ${p.import}  →  ${newImport}\n`);
}

console.log("🏁 Correções automáticas concluídas.");
