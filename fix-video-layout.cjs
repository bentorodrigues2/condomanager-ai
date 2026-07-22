const fs = require("fs");
const path = require("path");

// 1) Remover vídeo do index.html
const indexPath = path.join(__dirname, "index.html");
let indexContent = fs.readFileSync(indexPath, "utf8");

indexContent = indexContent.replace(/<video[\s\S]*?<\/video>/gi, "");
indexContent = indexContent.replace(/<source[\s\S]*?>/gi, "");

fs.writeFileSync(indexPath, indexContent);
console.log("✔ index.html limpo — vídeo removido");

// 2) Atualizar App.jsx
const appPath = path.join(__dirname, "src", "App.jsx");
let appContent = fs.readFileSync(appPath, "utf8");

const videoComponent = `
<div className="video-wrapper">
  <video
    src="/Videos/logo-animation.mp4"
    autoPlay
    loop
    muted
    playsInline
    className="logo-video"
  />
</div>
`;

if (!appContent.includes("video-wrapper")) {
  appContent = appContent.replace(
    /return\s*\(/,
    `return (
      ${videoComponent}
    `
  );
}

fs.writeFileSync(appPath, appContent);
console.log("✔ App.jsx atualizado — vídeo movido para React");

// 3) Escrever CSS em styles.css
const cssPath = path.join(__dirname, "src", "styles.css");
let cssContent = fs.readFileSync(cssPath, "utf8");

const cssFix = `
.video-wrapper {
  width: 960px;
  margin: 0 auto;
  padding-top: 20px;
}

.logo-video {
  width: 100%;
  height: auto;
  max-width: 960px;
  object-fit: contain;
  display: block;
}
`;

if (!cssContent.includes(".video-wrapper")) {
  cssContent += "\n\n" + cssFix;
}

fs.writeFileSync(cssPath, cssContent);
console.log("✔ styles.css atualizado — fullscreen removido");

console.log("\n🎉 Correção completa! Agora faz:\n");
console.log("git add .");
console.log('git commit -m "fix: video layout"');
console.log("git push");
