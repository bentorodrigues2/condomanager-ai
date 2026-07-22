const fs = require("fs");
const path = require("path");

const file = path.join(__dirname, "frontend/index.html");

console.log("🔧 A corrigir caminho do vídeo em frontend/index.html...");

let html = fs.readFileSync(file, "utf8");

// Corrige o caminho do vídeo
html = html.replace(
    /<source src="assets\/video\.mp4" type="video\/mp4">/,
    `<source src="/assets/video/logo-animation.mp4" type="video/mp4">`
);

fs.writeFileSync(file, html);

console.log("✔ Caminho do vídeo corrigido para /assets/video/logo-animation.mp4");
console.log("🏁 Agora faz git add, commit e push.");
