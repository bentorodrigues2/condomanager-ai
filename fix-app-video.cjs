const fs = require("fs");
const path = require("path");

const APP_FILE = path.join(__dirname, "src", "App.jsx");

console.log("🔧 A remover vídeo do topo do App.jsx...");

if (!fs.existsSync(APP_FILE)) {
  console.log("❌ Ficheiro App.jsx não encontrado.");
  process.exit(1);
}

let content = fs.readFileSync(APP_FILE, "utf8");

// Remove qualquer <video> no topo do ficheiro
content = content.replace(
  /<video[\s\S]*?<\/video>/g,
  ""
);

// Garante que o vídeo só aparece dentro do layout
const videoBlock = `
  <video
    src="/assets/videos/logo-animation.mp4"
    autoPlay
    loop
    muted
    playsInline
    className="logo-video"
  />
`;

content = content.replace(
  /return\s*\(/,
  `return (
    ${videoBlock}
`
);

fs.writeFileSync(APP_FILE, content, "utf8");

console.log("✔ Vídeo removido do topo e reinserido dentro do layout.");
console.log("🏁 Correção concluída.");
