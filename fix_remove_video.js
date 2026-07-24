// fix_remove_video.js
// Script automático para remover o vídeo fullscreen que está a bloquear o login
// Usado na v2.0 — corre no VS Code com Node: `node fix_remove_video.js`

const fs = require("fs");
const path = require("path");

// Diretórios onde o vídeo pode estar
const possibleFiles = [
  "index.html",
  "src/App.jsx",
  "src/App.js",
  "src/components/Hero.jsx",
  "src/components/VideoBackground.jsx",
  "src/components/Video.jsx",
  "src/main.jsx"
];

console.log("🔍 A procurar blocos de vídeo para remover...");

possibleFiles.forEach((file) => {
  const filePath = path.join(process.cwd(), file);

  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, "utf8");

    // Remove qualquer bloco <video ...> ... </video>
    const videoRegex = /<video[\s\S]*?<\/video>/gi;

    if (videoRegex.test(content)) {
      content = content.replace(videoRegex, "{/* Vídeo removido temporariamente para desbloquear login */}");
      fs.writeFileSync(filePath, content, "utf8");

      console.log(`✔ Vídeo removido de: ${file}`);
    }
  }
});

// Desativar CSS do vídeo
const cssFiles = [
  "src/index.css",
  "src/styles/hero.css",
  "src/styles/video.css",
  "src/video.css"
];

cssFiles.forEach((file) => {
  const filePath = path.join(process.cwd(), file);

  if (fs.existsSync(filePath)) {
    let css = fs.readFileSync(filePath, "utf8");

    const cssRegex = /\.video-background\s*\{[\s\S]*?\}/gi;

    if (cssRegex.test(css)) {
      css = css.replace(cssRegex, "/* Vídeo removido temporariamente para desbloquear login */");
      fs.writeFileSync(filePath, css, "utf8");

      console.log(`✔ CSS do vídeo desativado em: ${file}`);
    }
  }
});

console.log("\n🎉 Concluído! O vídeo foi removido e o login deve aparecer no Vercel após novo deploy.");
