// verify_dist_and_index.mjs
import fs from 'fs';
import path from 'path';
const root = process.cwd();
const distIndex = path.join(root, 'frontend', 'dist', 'index.html');

if (!fs.existsSync(distIndex)) {
  console.error('✖ frontend/dist/index.html não existe. Faz build localmente: cd frontend && npm run build');
  process.exit(1);
}

const indexHtml = fs.readFileSync(distIndex, 'utf8');
const scriptRegex = /<script[^>]*src=["']([^"']+)["'][^>]*>/gi;
let m;
const missing = [];
const htmlServed = [];

while ((m = scriptRegex.exec(indexHtml)) !== null) {
  let src = m[1];
  // normalizar caminho relativo
  if (src.startsWith('/')) src = src.slice(1);
  const filePath = path.join(root, 'frontend', 'dist', src);
  if (!fs.existsSync(filePath)) {
    missing.push(src);
  } else {
    const head = fs.readFileSync(filePath, 'utf8').slice(0, 20);
    if (head.trim().startsWith('<')) {
      htmlServed.push(src);
    }
  }
}

console.log('✔ Verificação concluída.');
if (missing.length) {
  console.warn('Arquivos referenciados não encontrados em frontend/dist:', missing);
} else {
  console.log('Todos os ficheiros referenciados existem em frontend/dist.');
}
if (htmlServed.length) {
  console.error('Alguns ficheiros parecem conter HTML em vez de JS (começam com "<"):', htmlServed);
  console.error('Isto indica que o servidor está a devolver index.html para esses pedidos.');
} else {
  console.log('Nenhum ficheiro JS começa com "<".');
}
