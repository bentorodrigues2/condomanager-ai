const fs = require('fs');
const path = require('path');

// 1. Remover pasta antiga src/supabase
const oldPath = path.join(__dirname, 'src', 'supabase');
if (fs.existsSync(oldPath)) {
  fs.rmSync(oldPath, { recursive: true, force: true });
  console.log('✔ Pasta src/supabase removida');
} else {
  console.log('ℹ Pasta src/supabase já não existe');
}

// 2. Caminho correto do ficheiro
const correctPath = './supabase/supabaseNodeClient.cjs';

// 3. Atualizar imports nos ficheiros do backend
const backendDir = path.join(__dirname, 'backend');

function fixImports(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);

    if (fs.statSync(fullPath).isDirectory()) {
      fixImports(fullPath);
      continue;
    }

    if (!file.endsWith('.js') && !file.endsWith('.cjs')) continue;

    let content = fs.readFileSync(fullPath, 'utf8');

    const oldImportRegex = /require\(['"`].*src\/supabase\/supabaseNodeClient\.cjs['"`]\)/g;

    if (oldImportRegex.test(content)) {
      const newContent = content.replace(
        oldImportRegex,
        `require('${correctPath}')`
      );

      fs.writeFileSync(fullPath, newContent, 'utf8');
      console.log(`✔ Corrigido: ${fullPath}`);
    }
  }
}

fixImports(backendDir);

console.log('✔ Todos os imports corrigidos');
