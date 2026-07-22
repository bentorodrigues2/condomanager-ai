const fs = require("fs");
const path = require("path");

const APP_FILE = path.join(__dirname, "src", "App.jsx");

console.log("🔧 A corrigir caminho do vídeo no React...");

if (!fs.existsSync(APP_FILE)) {
  console.log("❌ Ficheiro App.jsx não encontrado.");
  process.exit(1);
}

let content = fs.readFileSync(APP_FILE, "utf8");

// Corrige automaticamente o caminho antigo para o novo
content = content.replace(
  /\/video\/logo-animation\.mp4/g,
  "/assets/video/logo-animation.mp4"
);

content = content.replace(
  /\/Videos\/logo-animation\.mp4/g,
  "/assets/video/logo-animation.mp4"
);

content = content.replace(
  /logo-animation\.mp4/g,
  "/assets/video/logo-animation.mp4"
);

fs.writeFileSync(APP_FILE, content, "utf8");

console.log("✔ Caminho do vídeo corrigido em App.jsx");
console.log("🏁 Correção concluída.");
