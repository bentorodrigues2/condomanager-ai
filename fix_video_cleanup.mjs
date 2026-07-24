// fix_video_cleanup.mjs
// Script automático para remover moldura e CSS do vídeo que bloqueia o login
// Corre com: node fix_video_cleanup.mjs

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Setup ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("🔍 A procurar ficheiros para limpar vídeo...");

// Ficheiros HTML onde encontrámos moldura
const htmlFiles = [
  "frontend/index.html",
  "frontend/module22/video-container.html"
];

// Ficheiros CSS onde encontrámos moldura
const cssFiles = [
  "frontend/module22/css/video.css",
  "src/styles.css"
];

// Remover moldura HTML
htmlFiles.forEach((file) => {
  const filePath = path.join(__dirname, file);

  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, "utf8");

    // Remover blocos #video-wrapper e #video-container
    const wrapperRegex = /<div id="video-wrapper">[\s\S]*?<\/div>/gi;

    if (wrapperRegex.test(content)) {
      content = content.replace(
        wrapperRegex,
        "<!-- Vídeo removido temporariamente para desbloquear login -->"
      );
      fs.writeFileSync(filePath, content, "utf8");
      console.log(`✔ Moldura HTML removida em: ${file}`);
    }
  }
});

// Remover CSS da moldura
cssFiles.forEach((file) => {
  const filePath = path.join(__dirname, file);

  if (fs.existsSync(filePath)) {
    let css = fs.readFileSync(filePath, "utf8");

    // Remover blocos CSS relacionados com vídeo
    const cssRegex = /#video-wrapper[\s\S]*?\}|#video-container[\s\S]*?\}|#main-video[\s\S]*?\}|\.video-wrapper[\s\S]*?\}|\.logo-video[\s\S]*?\}/gi;

    if (cssRegex.test(css)) {
      css = css.replace(
        cssRegex,
        "/* Moldura de vídeo removida para desbloquear login */"
      );
      fs.writeFileSync(filePath, css, "utf8");
      console.log(`✔ CSS da moldura removido em: ${file}`);
    }
  }
});

console.log("\n🎉 Concluído! Moldura e CSS do vídeo removidos. O login deve aparecer após novo deploy no Vercel.");
